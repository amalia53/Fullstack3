const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name must be at least 3 letters long"],
        required: "Name is required"
    },
    number: {
        type: String,
        required: "Number is required",
        minlength: [8, "Number must contain at least 7 numbers and be partitioned with a hyphen (-) after either 2 or 3 numbers (for example 123-4567 or 12-345678)"],
        validate: {
            validator: function (number) {
                const reg = /^[0-9]{2,3}[-][0-9]{4,100}$/
                return reg.test(number)
            }, 
            message: "Number must be partitioned with a hyphen (-) after either 2 or 3 numbers (for example 123-4567 or 12-345678)"
        }
    }
})

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person", personSchema)