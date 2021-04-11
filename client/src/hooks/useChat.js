import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { nanoid } from 'nanoid'
import { useLocalStorage, useBeforeUnload } from 'hooks'

// адресс сервера
const SERVER_URL = 'http://localhost:5000'

// хук принимает название комнаты 
export const useChat = (roomId) => {
  // локальное состояние для пользователей 
  const [users, setUsers] = useState([])
  // локальное состояние для сообщений 
  const [messages, setMessages] = useState([])

  // создаем и записываем в лок хран идентификатор пользователя
  const [userId] = useLocalStorage('userId', nanoid(8))
  // получаем имя пользователя
  const [username] = useLocalStorage('username')

  // создаем перем для хранения любых мутирующих значений в течение всего жизненного цикла компонента
  const socketRef = useRef(null)

  useEffect(() => {
    // создаем экземпляр сокета, передаем ему адрес сервера
    // и записываем объект с названием комнаты в строку запроса "рукопожатия"
    socketRef.current = io(SERVER_URL, {
      query: { roomId }
    })

    // отправляем событие добавления пользователя,
    // в качестве данных передаем объект с именем и id пользователя

    socketRef.current.emit('user:add', { username, userId })

    // обрабатываем получение списка пользователей
    socketRef.current.on('users', (users) => {
      // обновляем массив пользователей
      setUsers(users)
    })

    // отправляем запрос на получение сообщений
    socketRef.current.emit('messages:get')

    // обрабатываем получение сообщений 
    socketRef.current.on('messages', (messages) => {
      // определяем, какие сообщения были отправлены данным пользователем,
      // если значение свойства "userId" объекта сообщения совпадает с id пользователя,
      // то добавляем в объект сообщения свойство "currentUser" со значением "true",
      // иначе, просто возвращаем объект сообщения
      console.log(messages)
      const newMessages = messages.map((msg) => msg.userId === userId ? { ...msg, currentUser: true }: msg)
      // обновляем массив сообщений
      setMessages(newMessages)
    })

    return () => {
      // при размонтировании компонента отключение сокета
      socketRef.current.disconnect()
    }
  }, [roomId, userId, username])

  // ф-я отправки сообщения
  // принимает обьект с текстом сообщения и именем отправителя
  const sendMessage = ({ messageText, senderName }) => {

    // добавляем в обьект id пользователя при отправке на сервер
    socketRef.current.emit('message:add', {
      userId,
      messageText,
      senderName
    })
  }

  // функция удаления сообщений по id
  const removeMessage = ([id]) => {
    socketRef.current.emit('message:remove', id)
  }
  // отправляем на сервер событие "user:leave" перед перезагрузкой стр
  useBeforeUnload(() => {
    socketRef.current.emit('user:leave', userId)
  })
  // хук возвращвет пользователей, сообщений, ф-и для отправки удаления сообщений
  return { users, messages, sendMessage, removeMessage }
}
