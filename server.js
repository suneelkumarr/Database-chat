require("dotenv").config()
const express = require('express');
const cors = require('cors')
const morgan = require("morgan");
const mongoose = require('mongoose');
const app = express();
const server = require('http').createServer(app)
const port = process.env.PORT || 4000;
const io = require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
});

const Rooms = require("./model/room.model")

//Routes

// const room = require("./Routes/room.routes")
const user= require("./Routes/user.routes")

//view js connected
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("common"));



mongoose.Promise  = require("bluebird");
//database conneted
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('database is connected')
}).catch(err => console.log(err))

let rooms = {}



app.use('/',require('./Routes/index.route'));
app.use('/user',require("./Routes/user.routes"));


// app.use("/rooms", room)

//indexfile
// app.get('/',(req,res)=>{ 
//     res.render('index', { rooms: rooms })
// });

app.use('/', (req, res)=>{ 
  res.render('index')
})

// app.get('/login',(req, res)=>{ 
//   res.render('login')
// })


//post request
app.post('/room', async(req, res) => {
   if (rooms[req.body.room] != null) {
      return res.redirect('/')
    }
    var room = new Rooms(req.body)
    await room.save()
    rooms[req.body.room] = { users: {} }
    res.redirect(req.body.room)
    // Send message that new room was created
    io.emit('room-created', req.body.room)
  });

//get request params
app.get('/:room', (req, res) => {
    if (rooms[req.params.room] == null) {
      return res.redirect('/')
    }
    res.render('room', { roomName: req.params.room })
  })

//socket connect
io.on('connect', (socket) => {
    console.log('user is connected');
    //user is connected
    socket.on('new-user', (room, name) => {
        socket.join(room)
        rooms[room].users[socket.id] = name
        console.log(rooms)
        socket.to(room).emit('user-connected', name)
      })

      //send the message to the user
      socket.on('send-chat-message', (room, message) => {
        socket.to(room).emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
      })
      //user is typing
      socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
      });
      //disconnecting the user
      socket.on('disconnect', (room) => {
        socket.leave(room);
        console.log('user is disconnected');
        getUserRooms(socket).forEach(room => {
          socket.to(room).emit('user-disconnected', rooms[room].users[socket.id])
          delete rooms[room].users[socket.id]
        })
      })
})

app.get('/use',(req, res) => {
    res.send('chat app conected')
})

function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
      if (room.users[socket.id] != null) names.push(name)
      return names
    }, [])
  }

server.listen(port,() => {
    console.log(`Server is running on ${port} `);
    console.log(`http://localhost:${port}`);
});