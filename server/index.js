const server = require('http').createServer()
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const log = console.log;
// получаем обработчики событий
const registerMessageHandlers = require('./handlers/messageHandlers');
const registerUserHandlers = require('./handlers/userHandlers');

// данная функция выполняется при подключении каждого сокета (обычно, один клиент = один сокет)
const onConnection = (socket) => {
  log('User connected')

  // получаем название комнаты из строки запроса "рукопожатия"
  const { roomId } = socket.handshake.query;

  // сохраняем название комнаты в соответствующем свойстве сокета
  socket.roomId = roomId;
  // присоединяемся к комнате (входим в нее)
  socket.join(roomId);

  // регистрируем обработчики
  // обратите внимание на передаваемые аргументы
  registerMessageHandlers(io, socket);
  registerUserHandlers(io, socket);

  // обрабатываем отключение сокета-пользователя
  socket.on('disconnect', () => {
    log('User disconnected');
    socket.leave(roomId);
  })
}

// обрабатываем подключение
io.on('connection', onConnection);

// запускаем сервер

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  log(`Server ready. PORT: ${PORT}`);
})