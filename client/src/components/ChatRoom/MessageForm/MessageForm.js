import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Picker } from 'emoji-mart'
import { FiSend } from 'react-icons/fi'
import { GrEmoji } from 'react-icons/gr'

export const MessageForm = ({ username, sendMessage }) => {
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  // обрабат изменение текста
  const hadleChangeText = (e) => {
    setText(e.target.value)
  }
  const handleEmojiShow = () => {
    setShowEmoji((v) =>!v)
  }

  // обрабатываем выбор емодзи
  // добавляем его к тексту, используя предыдущее знач сост текста
  const handleEmojiSelect = (e) => {
    setText((text) => (text += e.native))
  }

  // обрабатываем отправку сообщения 
  const handleSendMessage = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
  
    if (trimmed) {
      sendMessage({ messageText: text, senderName: username })
      setText('')
    }
  }

    return (
      <>
        <Form onSubmit={handleSendMessage}>
          <Form.Group className='d-flex'>
            <Button variant='primary' type='button' onClick={handleEmojiShow}>
              <GrEmoji />
            </Button>
            <Form.Control
              value={text}
              onChange={hadleChangeText}
              type='text'
              placeholder='Message...'
            />
            <Button variant='success' type='submit'>
              <FiSend />
            </Button>
          </Form.Group>
        </Form>
        {/* эмодзи */}
        {showEmoji && <Picker onSelect={handleEmojiSelect} emojiSize={20} />}
      </>
    )
}
