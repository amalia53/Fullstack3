
const Notification = ({ message, isError }) => {
  if (message == null) {
    return null
  }

  return (
    isError 
    ? <div className='error'>
    {message}
  </div>
    :<div className='notification'>
      {message}
    </div>
  )
}

export default Notification
