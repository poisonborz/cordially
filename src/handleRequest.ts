
import { Response } from 'express'

import { AuthenticatedRequest, emitError, getSuppliedUser } from '~/utils'

interface RequestHandler {
    (req: AuthenticatedRequest, res: Response): Promise<unknown>
}

export default (handler: RequestHandler, guestAccessible?: boolean, suppliedUserType?: undefined | 'guest' | 'admin') => {
    return async (req: AuthenticatedRequest, res: Response): Promise<void> => {

        if (!guestAccessible && !req.locals.userIsAdmin) {
            emitError(new QueryError('no_permission'), res, true)
            return
        }

        req = await getSuppliedUser(req, suppliedUserType)

        try {
            await handler(req, res)
        } catch (error) {
            emitError(error, res)
        }
    }
}

export class QueryError extends Error {
    public message: string
    public code: string
    public status: number
    public meta?: Record<string, unknown>

    constructor (code: string, meta?: Record<string, unknown>) {
        super(code)
        this.code = code
        this.meta = meta
    }
}


interface LogErrorMetaAttributes {
    critical?: boolean
}

const withLevel = (level: string) => {
    return (message: string, meta?: LogErrorMetaAttributes) => {
        console.log(`${level}: ${message}`)

        if ((meta as LogErrorMetaAttributes || {}).critical) {
            process.exit(1)
        }
    }
}

export const log = {
    debug: withLevel('debug'),
    info: withLevel('info'),
    warn: withLevel('warn'),
    error: withLevel('error')
}
