const express =require("express");
const cors = require("cors");


const app = express();
const port = 8008;

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
    connectionLimit:10,
    host:'localhost',
    user:'admin',
    password:'19304045',
    database:'aceivandb',
    port: 3306
});
const send = require("send");

let events_Array= [];
app.use(cors());

app.get("/getEvents",(req,response)=>{
    pool.getConnection((connErr,connection)=>{
        if(connErr){
            console.error("Error");
        }
        const sqlQuery = "SELECT * FROM EVENTS";
        connection.query("SELECT * FROM EVENTS",function(err,res,fields){
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
    
});

app.listen(port,()=>{
    console.log("Listening...")
})