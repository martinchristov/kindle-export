const inquirer = require('inquirer')

module.exports = {
   askForDB: () => {
      const questions = [
         {
            type: 'input',
            name: 'path',
            message: 'Couldn\'t detect your kindle. Please provide a path to a vocab.db file'
         }
      ]
      return inquirer.prompt(questions);
   },
   askForDBagain: () => {
      const questions = [
         {
            type: 'input',
            name: 'path',
            message: 'Please provide a valid path to a vocab.db file'
         }
      ]
      return inquirer.prompt(questions);
   },
   askForLanguages: (langs) => {
      const questions = [
         {
           type: 'checkbox',
           name: 'langs',
           message: 'Which languages should be included?',
           choices: langs,
           default: langs
         }
       ];
       return inquirer.prompt(questions);
   },
   askForBooks: (books) => {
      const questions = [
         {
           type: 'list',
           name: 'books',
           message: 'Vocab from which book do you wish to export?',
           choices: [{name: 'All', value: 0}, ...books]
         }
       ];
       return inquirer.prompt(questions);
   },
   askForOutput: () => {
      const questions = [
         {
            type: 'input',
            name: 'path',
            message: 'Output location (/Users/me/Desktop/kindle.csv)'
         }
      ]
      return inquirer.prompt(questions);
   }
}