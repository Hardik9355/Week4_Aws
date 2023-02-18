"use strict";
require("dotenv").config();
const env = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const AWS3 =  require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const connectDB = require("./config/db");
const employee = require("./models/employee");
const AWS = require("aws-sdk");
const { eventNames } = require("./models/employee");

env.config();
const awsConfig = {
  accessKeyId : process.env.AccessKey,
  secretAccessKey : process.env.SecretKey,
  region: process.env.AWS_REGION
}
const SES  = new AWS.SES (awsConfig);
connectDB();




module.exports.getEmployees = async (event) => {
  const e = await employee.find();
    // const e = await readfromDB()
    return {
        statusCode: 200,
        body: JSON.stringify(e),
      };
};

module.exports.postEmployee = async (event) => {
  // try{
    const email = process.env.FROM_EMAIL;
    let saltRounds =10;
  try{
    const{id,name,department,EMAIL,password} =JSON.parse(event.body);
    bcrypt.hash(password, saltRounds , async function(error,hash){
      if(!error){
        const createemployee =new employee({
          id,
          name,
          department,
          EMAIL,
          password: hash
    
        });
        await createemployee.save();

        
      }
    })
    
   
  const params ={
    Source: email,
    Destination :{
      ToAddresses : [EMAIL],
    },
    Message: {
      Subject : {
        Charset : "UTF-8",
        Data : "Welcome to Inzint.",
      },
      Body :{
        Html:{
          Charset : "UTF-8",
          Data: `<h1> Hii, Welcome to our Team With regards Hardik Garg</h1>`,
        },
      },
    },
  };
  const emailSent = await  SES.sendEmail(params).promise()
  .then(data => {
    data
  })
    .catch(error =>{
      error.message

    
  })
} catch(error){
  error;
}
   
};
module.exports.loginEmployee = async (event) => {
  const email = process.env.FROM_EMAIL;
  try{
    const{EMAIL,password} = JSON.parse(event.body);
    let loginemployee = await  employee.findOne({EMAIL:EMAIL});
    bcrypt.compare(password, loginemployee.password, function (error,result){
      if(result==true){
        var token = jwt.sign(
          {EMAIL:loginemployee.EMAIL, id:loginemployee._id, name: loginemployee.name},
          process.env.SECRETKEY
        );

        
        console.log("Logged in Successfully");
        
      }
      else{
        console.log("Logged in unsuccessfully");
      }
    });
    const params ={
      Source: email,
      Destination :{
        ToAddresses : [EMAIL],
      },
      Message: {
        Subject : {
          Charset : "UTF-8",
          Data : "Welcome to Inzint.",
        },
        Body :{
          Html:{
            Charset : "UTF-8",
            Data: `<h1> Hii, Welcome to our Team With regards Hardik Garg</h1>`,
          },
        },
      },
    };
    const emailSent = await SES.sendEmail(params).promise()
    .then(data => {
      data
    })
      .catch(error =>{
        error.message
  
      
    })


  }
  catch(error){
    console.log("Invalid Details");
  }
};





