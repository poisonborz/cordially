
import bcrypt from 'bcryptjs'
import { Model, DataTypes } from 'sequelize'

import db from '~/models/database'
import { Admin } from '~/models/modelAdmin'
import { Language } from '~/models/modelLanguage'
import { GuestHasProperty } from '~/models/modelGuestHasProperty'


interface GuestAttributes {
    id: number
    code: string
    name: string
    nameSecondLine: string
    languageId: number
    lastUpdatedByAdminId: number
    lastUpdatedByAdminTime: number
    lastUpdatedByGuestTime: number
    countRatio?: number
    meta?: string
    isTest?: boolean
    created: number
}

interface GuestPublicPropertyAttributes {
    text?: string
    key: string
    value: string
    minimumIntValue?: number
    maximumIntValue?: number
    required?: boolean
}

interface GuestPublicAttributes {
    id: string
    name: string
    nameSecondLine: string
    languageId: number
    code?: string
    lastUpdatedByGuestTime?: number
    properties: GuestPublicPropertyAttributes[]
}

class Guest extends Model<GuestAttributes, Partial<GuestAttributes>>
    implements GuestAttributes {
    public id!: number
    public code: string
    public name!: string
    public nameSecondLine: string
    public languageId!: number
    public lastUpdatedByAdminId: number
    public lastUpdatedByAdminTime: number
    public lastUpdatedByGuestTime: number
    public countRatio?: number
    public meta?: string
    public isTest?: boolean
    public created: number
}

Guest.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nameSecondLine: {
        type: DataTypes.STRING(100)
    },
    languageId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    },
    meta: {
        type: DataTypes.TEXT
    },
    isTest: {
        type: DataTypes.BOOLEAN
    },
    created: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async (guest: any) => {
            guest.code = await bcrypt.hash(guest.code, 10)
            return guest
        }
    },
    sequelize: db
})

Guest.belongsTo(Language, {
    foreignKey: 'languageId',
    as: 'language'
})

Guest.belongsTo(Admin, {
    foreignKey: 'lastUpdatedByAdminId',
    as: 'lastUpdatedByAdmin'
})

Guest.hasMany(GuestHasProperty, {
    foreignKey: 'guestId',
    as: 'guestProperty'
})

GuestHasProperty.belongsTo(Guest, {
    foreignKey: 'guestId',
    as: 'guest'
})


export {
    Guest,
    GuestAttributes,
    GuestPublicAttributes,
    GuestPublicPropertyAttributes
}
