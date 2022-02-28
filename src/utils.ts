
import dotenv from 'dotenv'
import crypto from 'crypto'
import Hashids from 'hashids'
import { Request, Response, NextFunction } from 'express'

import { log, QueryError } from '~/handleRequest'
import { Guest } from '~/models/modelGuest'
import { Admin } from '~/models/modelAdmin'
import { createFirstAdmin } from '~/models/modelAdmin.methods'
import { errors } from '~/errors'


dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

// an ad-hoc unicode lookalike character for flexible hashed id inclusion in the auth code and deciding user type
const codeSeparator = 'һ'
const codeSeparatorAdmin = 'а'

export const hashids = new Hashids(process.env.idHashingSecret, 4)

if (!process.env.idHashingSecret) {
    log.error('No id hashing secret specified', { critical: true })
}

if (!process.env.codeUrlVar) {
    log.error('No code url variable specified', { critical: true })
}
//
export interface AuthenticatedRequest extends Request
{
    locals: {
        user: Guest | Admin
        userIsAdmin: boolean
        suppliedUser: Guest | Admin | null
    }
}


// contains additional information evaluated on auth
export const generatePreviewCode = (userId: number, unhashedCode: string, isAdmin?: boolean): string => {
    return hashids.encode(userId) + (isAdmin ? codeSeparatorAdmin : codeSeparator) + unhashedCode
}

export const generateCode = () => {
    return crypto.randomBytes(5)
        .toString('base64')
        .replace(/\+/g, '')
        .replace(/\//g, '')
        .replace(/=/g, '')
}

export const generateLinkUrl = (code: string, subsite?: string): string => {
    const port = process.env.PORT && process.env.PORT !== '80' ? ':' + process.env.PORT : ''
    const host = process.env.HOST || 'localhost'
    return `${host}${port}/${subsite || ''}?${process.env.codeUrlVar}=${code}`
}

export const removeUndefinedProps = (obj: Record<string, unknown>) => {
    Object.keys(obj).forEach((key) => (typeof obj[key] === 'undefined') && delete obj[key])
    return obj
}

export const getSuppliedUser = async (req: AuthenticatedRequest, suppliedUserType: undefined | 'guest' | 'admin'): Promise<AuthenticatedRequest> => {
    if (!suppliedUserType || !req.query.suppliedUserId) return req

    let suppliedUserId

    try {
        suppliedUserId = Number(hashids.decode(String(req.query.suppliedUserId)))
    } catch (err) {
        throw new QueryError('supplied_user_invalid')
    }

    const suppliedUser = await (() => {
        // eslint-disable-next-line default-case
        switch (suppliedUserType) {
            case 'admin':
                return Admin.findOne({ where: { id: suppliedUserId } })
            case 'guest':
                return Guest.findOne({ where: { id: suppliedUserId } })
        }
    })()

    if (!suppliedUser) {
        throw new QueryError('supplied_user_invalid')
    }

    req.locals.suppliedUser = suppliedUser

    return req
}

export const addAuthoringProps = (
    updateObj: Record<string, unknown>,
    req: AuthenticatedRequest
) => {
    if (req.locals.userIsAdmin) {
        updateObj.lastUpdatedByAdminId = req.locals.user.id
        updateObj.lastUpdatedByAdminTime = new Date()
    } else {
        updateObj.lastUpdatedByGuestTime = new Date()
    }

    return updateObj
}

export const emitError = (error: QueryError, res: Response, noLog?: boolean) => {
    const hideError = isProd && error?.status === 500

    if (!noLog) {
        log.error(error.message)
    }

    let item = errors.find(e => e.code === error.code) as QueryError

    if (hideError || !item) {
        item = errors.find(e => e.code === 'internal_error') as QueryError
    }

    return res.json({
        message: item.message,
        code: item.code,
        status: item.status,
        meta: error.meta || undefined
    })
}

export const validateRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const authCode = req.query[String(process.env.codeUrlVar)]

        if (!authCode) {
            throw Error()
        }

        const userIsAdmin = (authCode as string).indexOf(codeSeparatorAdmin) > -1
        const authCodeParts = (authCode as string).split(userIsAdmin ? codeSeparatorAdmin : codeSeparator)
        const extractedUserId = Number(hashids.decode(authCodeParts[0]))

        const user: Guest | Admin | null = userIsAdmin
            ? await Admin.findOne({ where: { id: extractedUserId } })
            : await Guest.findOne({ where: { id: extractedUserId } })

        if (!user) {
            throw Error()
        }

        (req as AuthenticatedRequest).locals = { user, userIsAdmin, suppliedUser: null }

        next()
    } catch (error) {
        emitError(new QueryError('invalid_auth'), res, true)
    }
}

// needed for npm run script
module.exports.createFirsAdmin = createFirstAdmin
