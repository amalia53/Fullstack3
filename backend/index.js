require("dotenv").config()

const express = require("express")
const app = express()

const morgan = require("morgan")
const Person = require("./models/person")

morgan.token("body", function get_body(req) {
    return JSON.stringify(req.body)
})
app.use(express.static("build"))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request, response) => {
    Person.collection.countDocuments().then((amount => {
        response.send(`Phonebook has info for ${amount} people <br>` + new Date())
    }))
})

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                console.log("Found ", person)
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    const body = request.body

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: "query" }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    }
    else if (error.errors["name"] !== undefined && error.errors["number"] !== undefined) {
        return response.status(400).json({ error: `${error.errors["name"].message} and ${error.errors["number"].message}`})
    }
    else if (error.errors["name"] !== undefined) {
        console.log("Nimivirhe")
        return response.status(400).json({ error: error.errors["name"].message})
    }
    else if (error.errors["number"] !== undefined) {
        console.log("Numerovirhe")
        return response.status(400).json({ error: error.errors["number"].message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})