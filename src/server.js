const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {})

app.listen(8080, () => console.log('Server started on 8080'))
