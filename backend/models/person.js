const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(console.log("connected to MongoDB"))
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name must contain min. 3 letters"],
        required: "Name is required"
    },
    number: {
        type: String,
        required: "Number is required",
        minlength: [8, "Number must contain min. 7 numbers and have a hyphen after 2 or 3 numbers (123-4567 or 12-345678)"],
        validate: {
            validator: function (number) {
                const reg = /^[0-9]{2,3}[-][0-9]{4,100}$/
                return reg.test(number)
            }, 
            message: "Number must have a hyphen after 2 or 3 numbers (123-4567 or 12-345678)"
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