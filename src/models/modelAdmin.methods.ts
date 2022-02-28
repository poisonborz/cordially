
import { Response } from 'express'

import db from '~/models/database'
import { Admin, AdminPublicAttributes } from '~/models/modelAdmin'
import { log, QueryError } from '~/handleRequest'
import {
    AuthenticatedRequest,
    generateCode,
    generateLinkUrl,
    generatePreviewCode,
    hashids
} from '~/utils'
import { Language } from '~/models/modelLanguage'


export const createAdmin = async (req: AuthenticatedRequest, res: Response): Promise<void> => {

    if (!req.query.name || !req.query.languageId) {
        throw new QueryError('req_params_missing', { affectedParams: ['name', 'languageId'] })
    }

    const unhashedCode = generateCode()

    const admin = await Admin.create({
        code: unhashedCode,
        name: String(req.query.name),
        languageId: Number(req.query.languageId)
    })

    res.json({
        id: hashids.encode(admin.id),
        name: admin.name,
        languageId: admin.languageId,
        // pass the plain user key as full URL a single time for the client (which should also not store it)
        code: generateLinkUrl(generatePreviewCode(admin.id, unhashedCode, true))
    })
}

export const createFirstAdmin = async (): Promise<string> => {
    if ((await Admin.findOne())) {
        log.info('Admin account already exist - use one of them, or reinstall the database')
    }
    const unhashedCode = generateCode()

    const admin = await Admin.create({
        code: unhashedCode,
        // it's unreasonable to think this table is empty
        languageId: (await Language.findOne() || {}).id
    })

    return generateLinkUrl(generatePreviewCode(admin.id, unhashedCode, true), 'admin')
}

export const updateAdmin = async (req: AuthenticatedRequest): Promise<AdminPublicAttributes> => {

    const admin = (req.locals.suppliedUser || req.locals.user) as Admin

    await admin.update({
        name: String(req.query.name),
        languageId: Number(req.query.languageId)
    })

    return {
        id: hashids.encode(admin.id),
        name: admin.name,
        languageId: admin.languageId
    }
}

export const getAdmin = async (req: AuthenticatedRequest): Promise<AdminPublicAttributes> => {
    // TODO
    return { id: '', name: '', languageId: 1 }
}

export const deleteAdmin = async (req: AuthenticatedRequest): Promise<boolean> => {

    if (!req.query.adminId) {
        throw new QueryError('req_params_missing', { affectedParams: ['adminId'] })
    }

    await db.transaction(async () => {
        await Admin.destroy({ where: { id: req.query.adminId } })
    })

    return true
}

export const listAdmin = async (req: AuthenticatedRequest): Promise<AdminPublicAttributes[]> => {
    // TODO
    return []
}
