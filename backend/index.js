const express = require("express")
const morgan = require("morgan")

const app = express()

morgan.token("body", function get_body (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.use(express.json())

app.use(express.static("build"))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/info", (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people <br>` + new Date())
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }

    else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {

    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number missing"
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name already in use"
        })
    }

    const new_person = {
        id: generate_id(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(new_person)

    response.json(new_person)
})

const generate_id = () => {
    let new_id = 1
    while (persons.find(person => person.id === new_id)) {
        new_id = Math.floor(Math.random() * 10000000)
        console.log(`${new_id} already in use`)
    }
    return new_id
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})