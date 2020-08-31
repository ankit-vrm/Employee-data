var express = require('express');
var empModel = require('../modules/employee');
const employeeModel = require('../modules/employee');
var userModel = require('../modules/admin'); 
var router = express.Router();
var employee = empModel.find({});
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


/* middlewere-- */
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try{
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err){
    res.redirect('/');
  }
  next();
}


function checkEmail(req,res,next){
  var email = req.body.email;
  var checkexistemail = userModel.findOne({ email:email});
  checkexistemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
     return res.render('signup', { title: 'Employee Records', msg:'Email already registered'});
    }
    next();
  });
};

function checkUsername(req,res,next){
  var uname = req.body.uname;
  var checkexistuser = userModel.findOne({ username:uname});
  checkexistuser.exec((err,data)=>{
    if(err) throw err;
    if(data){
     return res.render('signup', { title: 'Employee Records', msg:'User already registered'});
    }
    next();
  });
};


/* Add-employee*/
router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    res.render('add-employee', { title: 'New Employee', loginUser:loginUser, msg:''});
  });

  module.exports = router;