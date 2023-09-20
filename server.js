const express = require ("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require ("dotenv");
const jwt = require("jsonwebtoken");

app.use(express.static(__dirname + '/public'));
dotenv.config({path:"./config/config.env"});
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

 const users= [
    {username: "manu",password:'123'},
    {username: "vinu",password:"123"}
]

app.get('/',(req,res)=>{
    const {token} = req.cookies
   
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,function(err,result){
            if(result){
                res.redirect("/profile")
            }else{
                res.sendFile(__dirname+"/login.html")
            }
        })
    }else{
        res.sendFile(__dirname+"/login.html")
    }
})

app.post('/login',(req,res)=>{
    const{username,password} = req.body;

    const user = users.find((data)=> data.username=== username && data.password === password);
    
    if(user){
        const data ={
            username,
            date:Date(),
        }
        const token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn:"10min"});

        console.log(token);

        res.cookie("token",token).redirect("/profile")
    }else{
        res.redirect("/")
    }

    
})

app.get('/profile',(req,res)=>{
    const {token} = req.cookies
    console.log(token);
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,function(err,result){
            if(err){
                res.redirect("/")
            }else{
                res.sendFile(__dirname + "/profile.html")
                
            }
        })
    }else{
        res.redirect("/")
    }
})


app.listen(process.env.PORT,()=>{
   console.log(`server is running on ${process.env.PORT}`);
})