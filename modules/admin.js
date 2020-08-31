var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://netninja:test1234@node-tuts.njbd8.mongodb.net/employee?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
var conn = mongoose.connection;

var userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true}},
    email: { type: String, required: true, index: { unique: true}},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now}
});

var userModel = mongoose.model('admin', userSchema);
module.exports = userModel;