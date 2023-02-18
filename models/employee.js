const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    id:{
        type:"String",
        required : true,
        
    },
    name:{
        type: "String",
        required : true,
    },
    department:{
        type: "String",
        required : true,
    },
    EMAIL :{
        type: "String",
        required : true,
        

    },
    password:{
        type : "String",
        required : true
    }
});
const employee = mongoose.model("employee", employeeSchema)
module.exports = employee;