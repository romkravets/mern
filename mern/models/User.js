const {Schema, model} = require('mongoose')

const shema = new Schema({
   email: {type: String, required: true, unique: true},
   password: {type: String, required: true},
   links: [type: Types.ObjeciId, ref:'Link']

})

model.export = model('User', shema)