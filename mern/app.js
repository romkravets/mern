const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port') || 5000

async function start(params) {
   try {
      await mongoose.connect(config.get('mongoUrl'), {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true
      })
      app.listen(PORT, () => console.log(`App hes been startes on port ${PORT}`))
   } catch (e) {

   }
}

start()


