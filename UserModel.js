const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//user model
let userSchema = Schema({
	name: {
		type: String, 
		required: true
	},
    password:{
        type: String,
        required: true,
        minlength: 1
    },
	isAdmin:{
		type: Boolean,
		default: false
	}
});


module.exports = mongoose.model("User", userSchema);
