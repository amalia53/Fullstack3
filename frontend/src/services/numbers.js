import axios from 'axios'

const url = '/api/persons'

const getAll = () => (
  axios
    .get(url)
    .then(response => response.data)
)

const add = (newObject) => (
  axios
    .post(url, newObject)
    .then(response => response.data)
)

const remove = (id) => (
  axios
    .delete(`${url}/${id}`)
)

const update = (id, newPerson) => (
  axios
  .put(`${url}/${id}`, newPerson)
)


export default { getAll, add, remove, update }