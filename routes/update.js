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

//update
router.post('/', function(req, res, next) {
    
    var update = empModel.findByIdAndUpdate(req.body.id, {
      name: req.body.uname,
      email: req.body.email,
      etype: req.body.emptype,
      hourlyrate: req.body.hrlyrate,
      totalHour: req.body.ttlhr,
      total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr),
    });
  
    update.exec(function(err, data){
        if(err) throw err;
        employee.exec(function(err, data){
          if(err) throw err;
          var loginUser = localStorage.getItem('loginUser');
          res.render('record', { title: 'Employee Records',loginUser:loginUser, records:data, success:'Record Updated Successfully'});
      });
    });
  });

module.exports = router;