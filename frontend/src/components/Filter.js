
const Filter = (persons, search) => {
  return persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase()))
}

export default Filter