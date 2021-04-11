import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from 'hooks'
import { Form, Button } from 'react-bootstrap'

export function Home() {

  const [username, setUsername] = useLocalStorage('username', 'John')

  // локальное состояние для комнаты
  const [roomId, setRoomId] = useState('free')
  const linkRef = useRef(null)

  const handleChangeName = (e) => {
    setUsername(e.target.value)
  }

  const handleChangeRoom = (e) => {
    setRoomId(e.target.value)
  }

  // имитируем отправку форму
  const handleSubmit = (e) => {
    e.preventDefault()

    // выполняем нажатие кнопки
    linkRef.current.click()
  }
  console.log('HOME')
  const trimmed = username.trim()

  return (
    <Form
      className='mt-5'
      style={{ maxWidth: '320px', margin: '0 auto' }}
      onSubmit={handleSubmit}
    >
      <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control value={username} onChange={handleChangeName} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Room:</Form.Label>
        <Form.Control as='select' value={roomId} onChange={handleChangeRoom}>
          <option value='free'>Free</option>
          <option value='job' disabled>Job</option>
        </Form.Control>
      </Form.Group>
      {trimmed && (
        <Button variant='success' as={Link} to={`/${roomId}`} ref={linkRef}>
        Chat
        </Button>
      )}
    </Form>
  )
}