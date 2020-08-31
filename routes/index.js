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



/* GET home page. */
router.get('/', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
  res.render('index', { title: 'Employee Records', msg:''});
}
});

/* login */
router.post('/', function(req, res, next) {
  var username = req.body.uname;
  var password = req.body.password; 
  var checkUser = userModel.findOne({ username:username});

  checkUser.exec((err,data)=>{
    if(err) throw err;
    var getuserid = data._id; 
    var getpassword = data.password;
    if(bcrypt.compareSync(password,getpassword)){
      var token = jwt.sign({ userId: getuserid}, 'loginToken');
      localStorage.setItem('userToken', token);  
      localStorage.setItem('loginUser', username); 
      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'Employee Records', msg:'Invalid username and password'});
    }
  });

});



/* Signup*/
router.get('/signup', function(req, res, next) {
  var loginUser = localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
  res.render('signup', { title: 'Employee Records', msg:''});
  }
});

router.post('/signup', checkEmail, checkUsername, function(req, res, next) {
      var username = req.body.uname;
      var useremail = req.body.email;
      var userpassword = req.body.password;
      var confpassword = req.body.confpassword;

    if(userpassword != confpassword){
      res.render('signup', { title: 'Employee Records', msg:'Password not matched !'});
    }else{
      userpassword = bcrypt.hashSync(userpassword, 10);
        var userDetails = new userModel({
        username: username,
        email: useremail,
        password: userpassword
      });
      userDetails.save(function(err, doc){
            if(err) throw err;
            res.render('signup', { title: 'Employee Records', msg:'User registered successfully'});
      });
    }
  
});


/* logout */
router.get('/logout', function(req, res, next) {
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
});

module.exports = router;
