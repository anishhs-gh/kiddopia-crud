const fs = require('fs')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('hmm...')
})

app.listen(port, () => {
  console.log(`Kiddopia app listening at http://localhost:${port}`)
})