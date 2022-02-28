
import { Model, DataTypes } from 'sequelize'

import db from '~/models/database'
import { Translation } from '~/models/modelTranslation'


interface PropertyAttributes {
    id: number
    key: string
    translationKey: string
    required: boolean
    minimumIntValue: number
    maximumIntValue: number
    lastUpdatedByAdminId: number
    lastUpdatedByAdminTime: number
    lastUpdatedByGuestTime: number
}

class Property extends Model<PropertyAttributes, Partial<PropertyAttributes>>
    implements PropertyAttributes {
    public id!: number
    public key!: string
    public translationKey!: string
    public translation: string
    public required: boolean
    public minimumIntValue: number
    public maximumIntValue: number
    public lastUpdatedByAdminId: number
    public lastUpdatedByAdminTime: number
    public lastUpdatedByGuestTime: number
}

Property.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    translationKey: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    required: {
        type: DataTypes.BOOLEAN
    },
    minimumIntValue: {
        type: DataTypes.INTEGER
    },
    maximumIntValue: {
        type: DataTypes.INTEGER
    },
    lastUpdatedByAdminId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lastUpdatedByAdminTime: {
        type: DataTypes.TIME
    },
    lastUpdatedByGuestTime: {
        type: DataTypes.TIME
    }
}, {
    sequelize: db
})

Property.hasMany(Translation, {
    sourceKey: 'translationKey',
    foreignKey: 'key',
    as: 'translation'
})


export {
    Property
}
