require("dotenv").config()

const express = require("express")
const app = express()

const morgan = require("morgan")
const Person = require("./models/person")

morgan.token("body", function get_body(req) {
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.use(express.json())
app.use(express.static("build"))

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// app.get("/info", (request, response) => {
//     response.send(`Phonebook has info for ${persons.length} people <br>` + new Date())
// })

app.get("/api/persons/:id", (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            console.log("Found ", person)
            response.json(person)
        }

        else {
            response.status(404).end()
        }
    })
})

app.delete("/api/persons/:id", (request, response) => {
    Person.findByIdAndDelete(request.params.id, function (error, docs) {
        if (error) {
            console.log(error)
        }
        else {
            console.log("Deleted : ", docs);
        }
    })
    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const body = request.body

    if (body.name === "" || body.number === "") {
        return response.status(400).json({
            error: "name and number missing"
        })
    }

    // if (Person.exists({ name: body.name })) {
    //     return response.status(400).json({
    //         error: "name already in use"
    //     })
    // }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})