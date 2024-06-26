const { Schema } = require('mongoose')
const { model } = require('mongoose')
const demo = new Schema({
    patientId: { type: Number, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true }
   
})

const appointments  = model('appointments', demo) 
module.exports = appointments    