
const Person = ({ name, number, deletePerson }) => {
  return (
    <li className='person'>
      {name} : {number}
     &nbsp; <button className='delete' onClick={deletePerson}>DELETE</button>
    </li>
  )
}

export default Person