#!/usr/bin/env node
const sqlite3 = require('sqlite3').verbose()
const json2csv = require('json2csv').parse
const fs = require('fs')
const clear = require('clear')
const chalk = require('chalk')
const figlet = require('figlet')
const argv = require('minimist')(process.argv.slice(2))
const inquirer = require('./lib/inquirer')
const { booksQ, wordsLookupsQ } = require('./lib/queries')
const cn = require('./lib/connect')

clear()
console.log(
  chalk.green(
    figlet.textSync('Kindle Export', { horizontalLayout: 'full' })
  )
)

const interface = {
   fetchBooks: () => {
      cn.db.serialize(() => {
         const books = []
         cn.db.each(booksQ, (err, row) => {
            if(err){
               console.log(err)
            }
            books.push(row)
         }, async () => {
            const langs = 
               books
               .map(({ lang }) => lang)
               .filter((value, index, arr) => arr.indexOf(value) === index)
            
            const langChoice = await inquirer.askForLanguages(langs)
            const filteredBookTitles = books.filter(book => langChoice.langs.indexOf(book.lang) !== -1).map(book => ({ name: book.title, value: book.id }))
            const bookChoice = await inquirer.askForBooks(filteredBookTitles)
            
            interface.fetchWords(langChoice, bookChoice)
         })
      })
   },

   fetchWords: ({ langs }, {books}) => {
      let q = `${wordsLookupsQ}
      WHERE WORDS.lang IN (${langs.map(l => `"${l}"`).join(', ')})`
      if(books !== 0){
         q = `${q} AND BOOK_INFO.id = '${books}'`
      }
      cn.db.serialize(() => {
         const words = []
         cn.db.each(q, (err, row) => {
            if(err){
               console.log(err);
            }
            words.push(row)
         }, () => interface.saveCSV(words))
      })
   },

   saveCSV: async (words) => {
      console.log(
         chalk.green(`Exporting ${words.length} words!`)
      )
      exportPath = argv.output ? { path: argv.output } : await inquirer.askForOutput()
      const fields = ['word', 'word_key', 'stem', 'usage', 'book_title', 'timestamp']
      const opts = { fields }
      const csv = json2csv(words, opts)
      fs.writeFile(exportPath.path, csv, function(err) {
         if(err) {
            return console.log(err)
         }
         console.log(chalk.green("The file was saved!"))
      })
   }
}
cn.init().then(() => {
   interface.fetchBooks()
})
