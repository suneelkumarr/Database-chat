const Room = require('../model/room.model')

exports.get = async (req, res) =>{
    try{
        const rooms= Room.findOne(req.params.id)
        res.status(200).json({
            data: rooms,
          });
    }catch(e){
        console.error(e);
        res.status(500)
    }
}

exports.create = async (req, res) =>{
    try{
        const oldUser = await Room.findOne({ room: req.body.room });  
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Create diffrent name room");
        }
        const rooms = await Room.create({
          room: req.body.room,
        });
    
        // Validate rooms input
        if (!rooms) {
          res.status(400).send("All input is required");
        }

        await rooms.save();
       res.status(201).send({ sucess: true, data: rooms });

    }catch(e){
        console.error(e);
        res.status(500)
    }
}

exports.update = async (req, res) =>{
    try{

    }catch(e){
        console.error(e);
        res.status(500)
    }
}

exports.delete = async (req, res) =>{
    try{

    }catch(e){
        console.error(e);
        res.status(500)
    }
}