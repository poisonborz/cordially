
import express, { Application } from 'express'

import handleRequest from '~/handleRequest'
import { createAdmin, deleteAdmin, getAdmin, updateAdmin } from '~/models/modelAdmin.methods'

const router = express.Router()

router.route('/')
    .get(handleRequest(getAdmin) as Application)
    .post(handleRequest(createAdmin) as Application)
    .put(handleRequest(updateAdmin) as Application)
    .delete(handleRequest(deleteAdmin) as Application)

export default router
