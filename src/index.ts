
import express from 'express'
import helmet from 'helmet'
import path from 'path'
import https from 'https'

import { validateRequest } from '~/utils'
import db from '~/models/database'
import routes from '~/routes'


const app = express()

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'script-src': ['unpkg.com', '\'self\'', '\'unsafe-eval\'', '\'unsafe-inline\'']
            }
        }
    })
)

const port = Number(process.env.PORT) || 4100
const host = process.env.HOST || 'localhost'

app.use(express.static(path.join(__dirname, '..', '/public')))
app.use(validateRequest)



db.authenticate()
    .then(() => {
        const server = app.listen(port, host, 511, () => {
            console.info(`Cordially API started https://${host}:${port}`)
        }).on('error', (err: Error) => {
            console.info(err.message, { stack: err.stack, critical: true })
        })

        process.on('SIGTERM', () => {
            console.warn('SIGTERM received: Cordially API will shut down')
            server.close(() => {
                console.info('Cordially API closed')
                process.exit(0)
            })
        })
    }).catch((err: Error) => {
        console.error(err)
    })



app.use(routes)
