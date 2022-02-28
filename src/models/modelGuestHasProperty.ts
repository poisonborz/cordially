
import { Model, DataTypes } from 'sequelize'

import db from '~/models/database'
import { Property } from '~/models/modelProperty'

interface GuestHasPropertyAttributes {
    id: number
    guestId: number
    propertyId: number
    value: string
    minimumIntValue: number
    maximumIntValue: number
    lastUpdatedByAdminId?: number
    lastUpdatedByAdminTime?: number
    lastUpdatedByGuestTime: number
}

export interface GuestHasPropertyAttributesWithProperty extends GuestHasPropertyAttributes{
    property: Property
}

class GuestHasProperty extends Model<GuestHasPropertyAttributes, Partial<GuestHasPropertyAttributes>>
    implements GuestHasPropertyAttributes {
    public id!: number
    public guestId!: number
    public propertyId!: number
    public value: string
    public minimumIntValue: number
    public maximumIntValue: number
    public lastUpdatedByAdminId?: number
    public lastUpdatedByAdminTime?: number
    public lastUpdatedByGuestTime: number
}


GuestHasProperty.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    guestId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING(100)
    },
    minimumIntValue: {
        type: DataTypes.INTEGER
    },
    maximumIntValue: {
        type: DataTypes.INTEGER
    },
    lastUpdatedByAdminId: {
        type: DataTypes.INTEGER
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

GuestHasProperty.belongsTo(Property, {
    foreignKey: 'propertyId',
    as: 'property'
})

export {
    GuestHasProperty,
    GuestHasPropertyAttributes
}
