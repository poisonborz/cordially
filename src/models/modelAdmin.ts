
import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'

import db from '~/models/database'
import { Language } from '~/models/modelLanguage'


interface AdminAttributes {
    id: number
    name: string
    languageId: number
    code: string
    isRoot: boolean
}

interface AdminPublicAttributes {
    id: string
    name?: string
    code?: string
    languageId: number
    isRoot: boolean
}

class Admin extends Model<AdminAttributes, Partial<AdminAttributes>>
    implements AdminAttributes {
    public id!: number
    public name: string
    public languageId!: number
    public code: string
    public isRoot: boolean
}

Admin.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100)
    },
    languageId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async (admin: any) => {
            admin.code = await bcrypt.hash(admin.code, 10)
            return admin
        }
    },
    sequelize: db
})

Admin.belongsTo(Language, {
    foreignKey: 'languageId',
    as: 'language'
})

export {
    Admin,
    AdminPublicAttributes
}
