
import express, { Application } from 'express'

import handleRequest from '~/handleRequest'
import { createGuest, deleteGuest, getGuest, updateGuest, tempBulkCreateFromTsv } from '~/models/modelGuest.methods'

const router = express.Router()

router.route('/')
    .get(handleRequest(getGuest, true) as Application)
    .post(handleRequest(createGuest) as Application)
    .put(handleRequest(updateGuest, true) as Application)
    .delete(handleRequest(deleteGuest) as Application)
    .options(handleRequest(tempBulkCreateFromTsv) as Application)

export default router
