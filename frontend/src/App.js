import { useEffect, useState } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import NewPerson from './components/NewPerson'
import numberService from './services/numbers'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")
  const [filtered, setFiltered] = useState(false)
  const [message, setMessage] = useState()
  const [isError, setIsError] = useState(false)
  let messageTimeout = -1, errorTimeout = -1

  useEffect(() => {
    numberService
      .getAll()
      .then(initialPersons => { setPersons(initialPersons) })
  }, [])

  const shown = filtered
    ? Filter(persons, search)
    : persons

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      const person = persons.filter(person => person.name === newName)[0]
      updateNumber(person, newNumber)
    } else {
      numberService
        .add(NewPerson(newName, newNumber))
        .then(
          newPerson => setPersons(persons.concat(newPerson)),
          setIsError(false),
          setMessage(`Added ${newName}`),
          setTimeout(() => setMessage(), 4000))
        .catch(error => {
          setIsError(true)
          setMessage(error.response.data.error)
          setTimeout(() => setMessage(), 4000)
          setTimeout(() => setIsError(false), 4000)
        })
    }
    setNewName("")
    setNewNumber("")
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      numberService
        .remove(id)
        .then(setPersons(persons.filter(person => person.id !== id)))
      setIsError(false)
      setMessage(`Deleted ${name}`)
      setTimeout(() => setMessage(), 4000)
    }
  }

  const updateNumber = (person, newNumber) => {
    const newPerson = { ...person, number: newNumber }
    if (window.confirm(`${person.name} is already added to phonebook. Do you want to replace the old number with a new one?`)) {
      setIsError(false)
      setMessage(`Updated ${person.name}`)
      setTimeout(() => setMessage(), 4000)

      numberService
        .update(person.id, newPerson)
        .catch(error => {
          setIsError(true)
          setMessage(error.response.data.error)
          setTimeout(() => setMessage(), 4000)
          setTimeout(() => setIsError(false), 4000)
        })
        .then(setPersons(persons.map(person =>
          newPerson.id !== person.id
            ? person
            : newPerson
        )))
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    const searchInput = event.target.value
    setSearch(searchInput)
    setFiltered(searchInput.length !== 0)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        Search for <input
          value={search}
          onChange={handleSearch}
        />
      </div>
      <h2>Add a new entry</h2>
      <Notification message={message} isError={isError} />
      <form onSubmit={addPerson}>
        <div>
          Name:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input
            value={newName}
            onChange={handleNameChange}
          />
          <p></p>
          Number:&nbsp;&nbsp;&nbsp;&nbsp;<input
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <p></p>
          <button className='add' type="submit">ADD</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {shown.map(person =>
        <Person key={person.name} name={person.name} number={person.number} deletePerson={() => deletePerson(person.id, person.name)}></Person>)}
    </div>
  )
}

export default App