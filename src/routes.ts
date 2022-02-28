
import express from 'express'

// TODO add auto route enumeration from per model dirs

import guestRoutes from '~/models/modelGuest.routes'
import adminRoutes from '~/models/modelAdmin.routes'

const router = express.Router()

router
    .use('/admin', adminRoutes)
    .use('/guest', guestRoutes)

export default router
