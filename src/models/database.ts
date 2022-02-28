
import Sequelize from 'sequelize'
import path from 'path'

export const dbLocation = path.join('database', 'db.sqlite')

export default new Sequelize.Sequelize({
    dialect: 'sqlite',
    dialectOptions: {
        multipleStatements: true
    },
    storage: dbLocation,
    define: {
        timestamps: false,
        freezeTableName: true
    }
})
