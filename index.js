require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const mongoose = require('mongoose')

app.use(express.json())
app.use(express.static('dist'))
const ownFormat = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(ownFormat))

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)

morgan.token('body', (request) => JSON.stringify(request.body))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    `)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

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

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
  

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})