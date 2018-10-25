module.exports = {
   booksQ: `
   SELECT
      title,
      lang,
      authors,
      id
   FROM BOOK_INFO
`,
   wordsLookupsQ: `
   SELECT
      word_key,
      usage,
      LOOKUPS.timestamp,
      WORDS.word,
      WORDS.stem,
      BOOK_INFO.title AS book_title
   FROM LOOKUPS
   INNER JOIN WORDS on WORDS.id=LOOKUPS.word_key
   INNER JOIN BOOK_INFO on LOOKUPS.book_key=BOOK_INFO.id
`
}