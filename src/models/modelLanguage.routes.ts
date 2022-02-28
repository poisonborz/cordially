

import { app } from '~/index'
import { createLanguage, deleteLanguage, getLanguage } from '~/models/modelLanguage.methods'

app.route('/Language')
    .get(getLanguage)
    .post(createLanguage)
    .delete(deleteLanguage)
