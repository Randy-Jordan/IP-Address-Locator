const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

require('dotenv').config()
const PORT = process.env.PORT
const app = express();
const server = app.listen(PORT, ()=> console.log(`Server Running on ${PORT}`))
const io = require('socket.io')(server)
app.set('socketio', io)


app.use(cors())
app.use(express.urlencoded({extended: true }))
app.use(express.json({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.use('/proxy', require('./routes'))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'./public/index.html'))
})

io.on('connection',(socket) => {
    socket.emit('data',{'ip':socket.request.connection.remoteAddress,'user-agent': socket.request.headers['user-agent']})
})
