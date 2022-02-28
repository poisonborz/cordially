

import { app } from '~/index'
import {
    createTranslations,
    deleteTranslations,
    listTranslations,
    updateTranslations
} from '~/models/modelTranslation.methods'


app.route('/translation')
    .get(listTranslations)
    .post(createTranslations)
    .put(updateTranslations)
    .delete(deleteTranslations)
