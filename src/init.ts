
import readline from 'readline'
import fs from 'fs'
import path from 'path'

import db, { dbLocation } from '~/models/database'
import { createFirstAdmin } from '~/models/modelAdmin.methods'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log(`
~ Welcome to Cordially! ~

This script will initialize the database and add the first admin user.
IT WILL DELETE ANY EXISTING DATA. Are you sure you want to continue?
`)

rl.question('Press y and enter to continue, anything else to cancel: ', async (answer) => {
    if (answer !== 'y') {
        console.log(`
-------------------------------
Initialization cancelled`)
        process.exit(0)
    }


    try {
        // sequelize will recreate the db below
        if (fs.existsSync(dbLocation)) {
            fs.unlinkSync(dbLocation)
        }
    } catch (error) {
        console.log('There was an error on clearing the DB: \n' + error.message)
    }


    try {
        await db.sync({ force: true })
        const dbQueries = fs.readFileSync(path.join(__dirname, 'models', 'bootstrap.sql'), 'utf8').split('\n\n')
        // multipleStatements not supported for sqlite
        // needs to be sync
        for (const q of dbQueries) {
            await db.query(q)
        }

        const adminUrl = await createFirstAdmin()

        console.log(`
-------------------------------

Initialized successfully! Your admin url: ${adminUrl}
        `)

    } catch (error) {
        console.log('There was an error on initializing the DB: \n' + error.message)
    }

    process.exit(0)
})
