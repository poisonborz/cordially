

import { app } from '~/index'
import { getSettings, updateSettings } from '~/models/modelSetting.methods'


app.route('/Settings')
    .get(getSettings)
    .put(updateSettings)
