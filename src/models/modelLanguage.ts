
import { Model, DataTypes } from 'sequelize'

import db from '~/models/database'


interface LanguageAttributes {
    id: number
    code: string
    name: string
}

class Language extends Model<LanguageAttributes, Partial<LanguageAttributes>>
    implements LanguageAttributes {
    public id!: number
    public code!: string
    public name!: string
}

Language.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    sequelize: db
})

export {
    Language
}
