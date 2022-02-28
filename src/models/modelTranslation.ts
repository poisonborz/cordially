
import { Model, DataTypes } from 'sequelize'

import db from '~/models/database'
import { Language } from '~/models/modelLanguage'


interface TranslationAttributes {
    id: number
    languageId: number
    key: string
    text: string
}

class Translation extends Model<TranslationAttributes, Partial<TranslationAttributes>>
    implements TranslationAttributes {
    public id!: number
    public languageId!: number
    public key: string
    public text!: string
}

Translation.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    languageId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: db
})

Translation.belongsTo(Language, {
    foreignKey: 'languageId',
    as: 'language'
})

export {
    Translation
}
