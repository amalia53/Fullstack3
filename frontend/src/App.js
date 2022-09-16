import { useEffect, useState } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import NewPerson from './components/NewPerson'
import numberService from './services/numbers'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(false)
  const [message, setMessage] = useState()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    numberService
      .getAll()
      .then(initialPersons => { setPersons(initialPersons) })
  }, [])
  console.log(persons)

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
        .then(newPerson => setPersons(persons.concat(newPerson)))
      setMessage(`Added ${newName}`)
      setTimeout(() => setMessage(), 3000)
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id, name) => {
    window.confirm(`Are you sure you want to delete ${name}?`)
    numberService
      .remove(id)
      .then(setPersons(persons.filter(person => person.id !== id)))
    setMessage(`Deleted ${name}`)
    setTimeout(() => setMessage(), 3000)
  }

  const updateNumber = (person, newNumber) => {
    const newPerson = { ...person, number: newNumber }
    window.confirm(`${person.name} is already added to phonebook. Do you want to replace the old number with a new one?`)
    setMessage(`Updated ${person.name}`)
    setTimeout(() => setMessage(), 3000)

    numberService
      .update(person.id, newPerson)
      .then(setPersons(persons.map(person =>
        newPerson.id !== person.id
          ? person
          : newPerson
      )))
      .catch(error => {
        setMessage(`${person.name} was already deleted from server`)
        setIsError(true)
        setTimeout(() => setMessage(), 6000)
        setTimeout(() => setIsError(false), 6000)
      }
      )
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