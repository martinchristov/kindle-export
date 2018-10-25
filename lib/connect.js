const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const chalk = require('chalk')
const argv = require('minimist')(process.argv.slice(2))

const connection = {
   db: null,
   pathToDB: argv.db ? argv.db : '/Volumes/Kindle/system/vocabulary/vocab.db',
   init: async () => {
      if (!fs.existsSync(connection.pathToDB)) {
         const inqdb = await inquirer.askForDB()
         connection.pathToDB = inqdb.path
      }
      connection.connect()
   },
   connect: async () => {
      try{
         console.log('connecting to: ', connection.pathToDB)
         connection.db = new sqlite3.Database(connection.pathToDB)
         console.log(chalk.green('Connection established!'))
      } catch(e){
         console.log(chalk.red('Couldn\'t connect'))
         const inqdb = await inquirer.askForDBagain()
         connection.pathToDB = inqdb.path
         connection.connect()
      }
   }
}

module.exports = connection

// initDb()