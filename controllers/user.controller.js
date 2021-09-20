const User = require('../model/user.model')
const bcrypt = require("bcryptjs");

exports.get = async (req, res) =>{
    try{
        const users= User.findOne(req.params.id)
        res.status(200).json({
            data: users,
          });
    }catch(e){
        console.error(e);
        res.status(500)
    }
}

exports.create = async (req, res) =>{
    try{
    //     const user = new User(req.body);
    //     await user.save();
    //     const room = await Room.findById({ _id: user.room });
    //     room.user.push(user);
    //     await room.save();
    //     //return new book object, after saving it to Publisher
    //     res.status(200).json({ success: true, data: user });
    //     await room.save();
    //    res.status(201).send({ sucess: true, data: room });
          const oldUser = await User.findOne({ email: req.body.email });  
            if (oldUser) {
               return res.status(409).send("User Already Exist. Please login");
            }
            const user = await User.create({
                username: req.body.username,
                 name: req.body.name,
                 email: req.body.email,
                 password:req.body.password,
            });
             // Validate rooms input
           if (!user) {
              res.status(400).send("All input is required");
            }
            // generate salt to hash password
           const salt = await bcrypt.genSalt(10);
           // now we set user password to hashed password
           user.password = await bcrypt.hash(user.password, salt);
           await user.save();
           res.status(201).send({ sucess: true, data: user });
    }catch(e){
        console.error(e);
        res.status(500)
    }
}

exports.login = async (req, res) =>{
    try{
        // Validate if user exist in our database
         const user = await User.findOne({ email: req.body.email });
        // Validate user input
         if (!user) {
            return res.status(401).json({ err: "email not match" });
         }

        auth = await bcrypt.compare(req.body.password,user.password);
        if (!auth) {
                return res.status(401).json({ err: "password not match" });
              }
        await user.save();
        // res.status(201).send({ sucess: true, data: user });
        res.redirect('dashboard')
    }catch(e){
        console.error(e);
        res.status(500)
    }
}

exports.update = async (req, res) =>{
    try{
        await User.findOneAndUpdate(req.params.id, req.body, {
            new: true,
          });
          return res
            .status(200)
            .json({ success: true, msg: "User Update successfully" });
    }catch(e){
        console.error(e);
        res.status(500)
    }
}

exports.delete = async (req, res) =>{
    try{
        const users = await User.deleteOne({_id:req.params.id});
        console.log(users);
        res.send(users);
    }catch(e){
        console.error(e);
        res.status(500)
    }
}