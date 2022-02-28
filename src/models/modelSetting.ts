
import { Model, DataTypes } from 'sequelize'

import db from '~/models/database'


interface SettingAttributes {
    id: number
    key: string
    value: string
    lastUpdatedByAdminId: number,
    updated: number
}

class Setting extends Model<SettingAttributes, Partial<SettingAttributes>>
    implements SettingAttributes {
    public id: number
    public key!: string
    public value!: string
    public lastUpdatedByAdminId: number
    public updated: number
}

Setting.init({
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
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    lastUpdatedByAdminId: {
        type: DataTypes.INTEGER
    },
    updated: {
        type: DataTypes.TIME
    }
}, {
    sequelize: db
})

export {
    Setting
}
