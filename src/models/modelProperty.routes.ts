

import { app } from '~/index'
import { listProperties, deleteProperties, updateProperties } from '~/models/modelProperty.methods'

app.route('/Properties')
    .get(listProperties)
    .post(updateProperties)
    .put(updateProperties)
    .delete(deleteProperties)
