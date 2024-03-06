const express =require("express");
const cors = require("cors");
const path =require("path");
const session = require("express-session");
const app = express();
const port = 8008;

const sessionStore= new Map();


app.use(session({
    secret:"some secret",
    cookie: {maxAge:600000},
    saveUninitialized: false
}));

class Event{
    constructor(userID,start_h,start_m,end_h,end_m,event_content,event_color,day){
        this.userID =userID;
        this.start_h =start_h;
        this.start_m =start_m;
        this.end_h =end_h;
        this.end_m =end_m;
        this.event_content =event_content;
        this.event_color =event_color;
        this.day =day;
    }
}   
var mysql = require("mysql");
const pool =  mysql.createPool({
    host:'localhost',
    user:'admin',
    password:'19304045',
    database:'aceivandb',
    port: 3306
});
const send = require("send");
const bodyParser = require("body-parser");
const { response } = require("express");
const { dir } = require("console");
const { dirname } = require("path");
const { allowedNodeEnvironmentFlags } = require("process");

let events_Array= [];
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true,
}),);
app.get("/styleLogin.css",(req,res)=>{
    res.sendFile(path.join(__dirname+"/styleLogin.css"));
})
app.get("/loginPage.js",(req,res)=>{
    res.sendFile(path.join(__dirname+"/loginPage.js"));
})
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname+"/index.html"));
})
app.get("/",(req,res)=>{
    if(req.session.authenticated){
        res.sendFile(path.join(__dirname+"/main.html"));
        
        console.log(req.session.user.username+" The current active user");
    }else{
        res.status(400);
        res.redirect("/login");
    }
    
})
app.get("/getEvents",(req,response)=>{
    if(req.session.authenticated){
        events_Array.push(req.session.user.username);
        pool.getConnection((connErr,connection)=>{
        if(connErr){
            console.error("Error");
        }
        connection.query(`SELECT * FROM EVENTS WHERE UserID='${req.session.user.userID}';`,function(err,res,fields){
            connection.release();
            if(err)throw err;
            Object.keys(res).forEach(function(key){
                let row =res[key];
                events_Array.push(new Event(row.UserID,row.Start_H,row.Start_M,row.End_H,row.End_M,row.Event_Content,row.Event_Color,row.Day));
                
            })
            
            response.json(events_Array);
            events_Array=[];
        });
        });
    }else{
        res.status(400);
        res.redirect("/login");
    }
});
app.post("/postEvent",(req,response)=>{
    if(req.session.authenticated){
        response.setHeader("Content-type","application/json");
        const query =`insert into events values(${req.session.user.userID},${req.body.start_h},${req.body.start_m},${req.body.end_h},${req.body.end_m},'${req.body.event_content}','${req.body.event_color}',${req.body.day});`;
        pool.getConnection((connErr,connection)=>{
            if(connErr){
                console.error("Error");
            }
            connection.query(query,function(err,res,fields){
                if(err)throw err;
                console.log("1 record inserted");
                response.status=200;
                response.send();
            });
        });
    }else{
        res.status(400);
        res.redirect("/login");
    }
})
app.post("/deleteEvent",(req,response)=>{

    if(req.session.authenticated){
        console.log(req.body);
        let text = req.body;
        const query =`delete from events where UserID=${req.session.user.userID} and Event_Content='${text.event_content}' and Start_H=${text.start_h} and Start_M=${text.start_m} and End_H=${text.end_h} and End_M=${text.end_m} and Day=${text.day};`;
        pool.getConnection((connErr,connection)=>{
            if(connErr){
                console.error("Error");
            }
            connection.query(query,function(err,res,fields){
                if(err)throw err;
                console.log("1 record inserted");
                response.status=200;
                response.send();
            });
        });
    }else{
        res.status(400);
        res.redirect("/login");
    }

})
app.post("/login",(req,respon)=>{
    pool.getConnection((err,conn)=>{
        if(err){
            console.log(err);
        }
        conn.query(`SELECT * FROM USERS WHERE Username='${req.body.name}' AND Password='${req.body.pword}';`,(err,res,fields)=>{
            conn.release();
            if(err)throw err;
            if(Object.keys(res).length==0){
                console.log("No such user");
                respon.status(400);
                respon.send("No such user");
            }else {
                let ob={
                    userID:0,username:0,password:0
                };
                Object.keys(res).forEach((e)=>{
                    let row = res[e];
                    ob.userID = row.UserID;
                    ob.username = row.Username;
                    ob.password = row.Password;
                });
                req.session.authenticated = true;
                req.session.user =ob;
                sessionStore.set(req.session);
                console.log(sessionStore);
                respon.send();
                
            };
            
        });
    });
    
});
app.get("/style.css",(req,res)=>{
    res.sendFile(path.join(__dirname+"/style.css"));
})
app.get("/main.js",(req ,res)=>{
    res.sendFile(path.join(__dirname+"/main.js"));
})
app.get("/logOut",(req,res)=>{
        if(req.session.authenticated){
            req.session.authenticated=false;
            req.session.destroy();
            
            res.redirect("/");
        }else{
            res.redirect("/");
        }
        
})



app.listen(port,()=>{
    console.log("Listening...")
})