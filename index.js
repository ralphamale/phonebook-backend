const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')

morgan.token('body', function getId (req) {
  return JSON.stringify(req.body)
})

app.use(cors())
app.use(morgan(':method :url :response-time :body'))
app.use(express.static('dist'))
app.use(express.json())

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const currentTime = new Date()

  const responseString = `Phonebook has info for ${persons.length} people <br /> ${currentTime.toString()}`

  response.send(responseString)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const id = Math.round(Math.random() * 1000)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length > 0) {
    return response.status(409).json({
      error: `name must be unique: ${body.name}`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: id
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const persons = persons.filter(person => person.id != id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
