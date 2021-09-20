const express = require('express');
const router = express.Router();

const users = require('../controllers/user.controller');

router.get('/',users.get)
//login handle
router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render('register')
    })
router.post('/register', users.create,(req,res)=>{
    res.render('login')
    })
router.post('/login',users.login,(req,res)=>{
    res.render('register')
    })
router.put('/:id', users.update)
router.delete('/:id',users.delete)

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','Now logged out');
    res.redirect('/users/login'); 
    })


module.exports = router;