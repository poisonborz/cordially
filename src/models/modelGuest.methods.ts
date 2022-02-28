
import fs from 'fs'
import path from 'path'
import { Op, Transaction } from 'sequelize'
import { Response } from 'express'

import { Guest, GuestPublicAttributes, GuestPublicPropertyAttributes } from '~/models/modelGuest'
import { QueryError } from '~/handleRequest'
import db from '~/models/database'
import { GuestHasProperty, GuestHasPropertyAttributesWithProperty } from '~/models/modelGuestHasProperty'
import { Property } from '~/models/modelProperty'
import { Translation } from '~/models/modelTranslation'
import {
    AuthenticatedRequest,
    generatePreviewCode,
    generateCode,
    hashids,
    removeUndefinedProps,
    addAuthoringProps,
    generateLinkUrl
} from '~/utils'
import { Language } from '~/models/modelLanguage'




export const createGuest = async (
    req: AuthenticatedRequest, res: Response, internal?: boolean, suppliedTransaction?: Transaction
): Promise<unknown> => {

    if (!req.query.name || !req.query.languageId) {
        throw new QueryError('req_params_missing', { affectedParams: ['name', 'languageId'] })
    }

    const unhashedCode = generateCode()

    const guest: Guest = await db.transaction(async (transaction: Transaction) => {
        const utilizedTransaction = suppliedTransaction || transaction

        const g = await Guest.create(addAuthoringProps(removeUndefinedProps({
            code: unhashedCode,
            name: String(req.query.name),
            nameSecondLine: String(req.query.nameSecondLine),
            languageId: Number(req.query.languageId),
            countRatio: req.query.countRatio,
            isTest: req.query.isTest,
            created: new Date()
        }), req), { transaction: utilizedTransaction })

        if (req.query.properties) {
            await updateGuestProperties(
                checkPropertyArray(String(req.query.properties)), g.id, utilizedTransaction, req
            )
        }

        return g
    })

    const publicGuest = await generatePublicGuest(guest)
    // pass the plain user key as full URL a single time for the client (which should also not store it)
    publicGuest.code = generateLinkUrl(generatePreviewCode(guest.id, unhashedCode))

    // TODO
    return internal ? publicGuest : res.json(publicGuest)
}

export const updateGuest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    if (req.locals.userIsAdmin && !req.locals.suppliedUser) {
        throw new QueryError('req_params_missing', { affectedParams: ['suppliedUserId'] })
    }

    const guest = (req.locals.userIsAdmin ? req.locals.suppliedUser : req.locals.user) as Guest

    await db.transaction(async (transaction: Transaction) => {

        let propsUpdated

        if (req.query.properties) {
            await updateGuestProperties(
                checkPropertyArray(String(req.query.properties)), guest.id, transaction, req
            )

            propsUpdated = true
        }

        if (propsUpdated || req.locals.userIsAdmin) {
            const guestProps = addAuthoringProps(removeUndefinedProps({
                name: req.locals.userIsAdmin ? String(req.query.name) : undefined,
                nameSecondLine: req.locals.userIsAdmin ? String(req.query.nameSecondLine) : undefined,
                languageId: req.locals.userIsAdmin ? Number(req.query.languageId) : undefined,
                countRatio: req.locals.userIsAdmin ? req.query.countRatio : undefined,
                isTest: req.locals.userIsAdmin ? req.query.isTest : undefined
            }), req)

            await guest.update(guestProps, { transaction })
        }
    })

    res.json(await generatePublicGuest(guest))
}

const checkPropertyArray = (incomingPropArray: string): GuestPublicPropertyAttributes[] => {
    try {
        const decodedArray = JSON.parse(incomingPropArray)

        if (!Array.isArray(decodedArray)) {
            throw Error('Not an array of props')
        }

        return decodedArray
    } catch (error) {
        throw new QueryError('param_invalid_value', { affectedParams: ['properties'] })
    }
}

const updateGuestProperties = async (
    suppliedProperties: GuestPublicPropertyAttributes[],
    guestId: number,
    transaction: Transaction,
    req: AuthenticatedRequest
) => {

    const [properties, guestProperties] = await Promise.all([
        Property.findAll({
            where: {
                [Op.or]: [
                    { key: suppliedProperties.map(sp => sp.key) },
                    { required: true }
                ]
            }
        }),
        GuestHasProperty.findAll({
            where: { guestId }
        }) || []
    ])

    const requiredUnsubmittedProps = properties.filter(
        p => p.required && !guestProperties.find(gp => gp.propertyId === p.id)
    )

    if (
        requiredUnsubmittedProps.filter(rp => suppliedProperties.find(p => p.key === rp.key)).length !==
        requiredUnsubmittedProps.length
    ) {
        throw new QueryError('req_params_missing', { affectedParams: requiredUnsubmittedProps.map(rp => rp.key) })
    }

    await Promise.all((suppliedProperties).map(
        (pto: GuestPublicPropertyAttributes) => {
            return createOrUpdateGuestProperty(req, pto, transaction, guestId, properties, guestProperties)
        }))
}

export const deleteGuest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    if (!req.query.guestId) {
        throw new QueryError('req_params_missing', { affectedParams: ['guestId'] })
    }

    await db.transaction(async () => {
        await Guest.destroy({ where: { id: req.query.guestId } })
        await GuestHasProperty.destroy({ where: { id: req.query.guestId } })
    })

    res.json(true)
}

export const getGuest = async (req: AuthenticatedRequest, res: Response): Promise<unknown> => {

    let guest: Guest | null

    if (req.locals.userIsAdmin) {
        // admins get served a guest just to be able to inspect the invitation

        if (req.query.all) {
            return listGuest(req, res)
        } else {
            guest = await Guest.findOne()

            if (!guest) {
                throw new QueryError('no_guests_added')
            }
        }

    } else {
        guest = req.locals.user as Guest
    }

    if (!guest) {
        throw new QueryError('guest_retrieval_error')
    }

    res.json(await generatePublicGuest(guest))
}

export const listGuest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const guests = await Guest.findAll({
        include: [
            {
                model: GuestHasProperty,
                as: 'guestProperty',
                include: [
                    {
                        model: Property,
                        as: 'property'
                    }
                ]
            }
        ]
    })

    res.json(guests)
}

const createOrUpdateGuestProperty = async (
    req: AuthenticatedRequest,
    propToUpdate: GuestPublicPropertyAttributes,
    transaction: Transaction,
    guestId: number,
    properties: Property[],
    guestProperties: GuestHasProperty[]
): Promise<GuestHasProperty> => {

    const adminProps = ['minimumIntValue', 'maximumIntValue', 'required']

    const p = properties.find((pp: Property) => pp.key === propToUpdate.key)

    if (!p) {
        throw new QueryError('invalid_guest_prop')
    }

    const gp = guestProperties.find((pp) => pp.propertyId === p.id)

    const maxInt = gp?.maximumIntValue || p.maximumIntValue
    const minInt = gp?.minimumIntValue || p.minimumIntValue

    if (p.required && !propToUpdate.value) {
        throw new QueryError('param_no_null', { parameter: p.key })
    }

    if ((maxInt !== undefined && maxInt !== null) && (minInt !== undefined && minInt !== null)) {
        const num = Number(propToUpdate.value)
        if (isNaN(num)) {
            throw new QueryError('param_only_number', { parameter: p.key })
        }

        if (num > maxInt) {
            throw new QueryError('param_value_larger', { parameter: p.key })
        }

        if (num < minInt) {
            throw new QueryError('param_value_smaller', { parameter: p.key })
        }
    }

    const updatedProps = addAuthoringProps({ value: propToUpdate.value }, req)

    adminProps.forEach(ap => {
        if (propToUpdate[ap as keyof GuestPublicPropertyAttributes] !== undefined) {
            if (!req.locals.userIsAdmin) {
                throw new QueryError('no_permission', { parameter: p.key })
            }

            updatedProps[ap] = propToUpdate.value
        }
    })

    if (gp) {
        return gp.update(updatedProps, { transaction })
    } else {
        return GuestHasProperty.create({
            guestId: guestId,
            propertyId: p.id,
            ...updatedProps
        }, { transaction })
    }

}

// TODO implement actual dynamic upload
export const tempBulkCreateFromTsv = async (req: AuthenticatedRequest, res: Response) => {
    // guests: GuestCreationAttributes[], propertiest: GuestPublicPropertyAttributes[]
    const languages = await Language.findAll()
    const guestAttributesCount = 3
    const csvLines = fs.readFileSync(path.join(__dirname, '..', '..', 'transient', 'test.tsv'), 'utf8').split('\r\n')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const headers = csvLines.shift().split('\t')
    const entries = csvLines.map(line => {
        const values = line.split('\t')

        const g = { props: [] }

        values.forEach((v, i) => {
            if (i < guestAttributesCount) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                g[headers[i]] = v
            } else {
                if (v && v !== '0') {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    g.props.push({ key: headers[i], value: v, maximumIntValue: headers[i] === 'attendeesAdults' || headers[i] === 'attendeesKids' ? v : undefined })
                }
            }
        })

        return g
    })

    const guests = await db.transaction(async (transaction: Transaction) => {
        // TODO update create/update queries for bulk
        return Promise.all(entries.map(guest => createGuest({
            ...req,
            query: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: guest.name,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                nameSecondLine: guest.nameSecondLine,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                languageId: languages.find(l => l.code === guest.languageCode).id,
                properties: JSON.stringify(guest.props)
            }
        } as unknown as AuthenticatedRequest,
        res,
        true,
        transaction))
        )
    })

    fs.writeFileSync(
        path.join(__dirname, '..', '..', 'transient', 'test_res.tsv'),

        headers.join('\t') + '\tcode\r\n' + entries.map((e, i) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return csvLines[i] + `\t${guests[i].code}\r\n`
        }).join('')
    )

    res.json(true)
}

const generatePublicGuest = async (guest: Guest): Promise<GuestPublicAttributes> => {
    return {
        id: hashids.encode(guest.id),
        name: guest.name,
        nameSecondLine: guest.nameSecondLine,
        languageId: guest.languageId,
        lastUpdatedByGuestTime: guest.lastUpdatedByGuestTime,
        properties: await generatePublicGuestProperties(guest)
    }
}

const generatePublicGuestProperties = async (
    suppliedGuest?: Guest,
    suppliedGuestId?: number
): Promise<GuestPublicPropertyAttributes[]> => {
    const guest = suppliedGuest || await Guest.findOne({ where: { id: suppliedGuestId } })

    if (!guest) {
        throw new QueryError('guest_retrieval_error')
    }

    const guestProperties = await GuestHasProperty.findAll({
        where: {
            guestId: guest.id
        },
        include: [
            {
                model: Property,
                as: 'property',
                include: [
                    {
                        model: Translation,
                        as: 'translation'
                    }
                ]
            }
        ]
    }) as unknown as GuestHasPropertyAttributesWithProperty[]


    return guestProperties.map((guestProperty) => {

        return {
            texts: guestProperty.property.translation,
            key: guestProperty.property.key,
            value: guestProperty.value,
            minimumIntValue: guestProperty.minimumIntValue,
            maximumIntValue: guestProperty.maximumIntValue,
            required: guestProperty.property.required
        }
    })
}


