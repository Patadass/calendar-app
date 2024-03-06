const FIRST_COLUM_REC_WIDTH_OFFSET = 20
const FIRST_ROW_REC_HEIGHT_OFFSET = 20
const MINUTES_IN_TABLE = 780

//COLORS
const LIGHT_BLUE = "#ADD8E6"
//

const denovi = ["Ponedelnik", "Vtornik", "Sreda", "Cetvrtok", "Petok"]

let events=[];


let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let canvasHeight = canvas.height
let canvasWidth = canvas.width
let rectHeight = canvasHeight/14
let rectWidth = canvasWidth/5
let firstColumRecWidth = rectWidth/2 + FIRST_COLUM_REC_WIDTH_OFFSET
let firstRowRecHeight = rectHeight + FIRST_ROW_REC_HEIGHT_OFFSET


function labelCenterOfRect(text, rectX, rectY, rw, rh, fontSize){
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = fontSize + "px Arial"
    ctx.globalAlpha = 1
    ctx.fillStyle = "black"
    ctx.fillText(text,rectX+(rw/2), rectY+(rh/2))
}

function drawEvent(rectX,rectY,w,h,color = LIGHT_BLUE){
    ctx.beginPath()
    ctx.globalAlpha = 0.8
    ctx.fillStyle = color
    ctx.rect(rectX,rectY,w,h)
    ctx.fill()
    ctx.stroke()
}

function timeToPlaceInTable(hour1,min1,hour2,min2,state){
    const pixel = canvasHeight / MINUTES_IN_TABLE
    hour1 -= 8
    hour2 -= 8
    let minutes1 = (hour1*60)+min1
    let minutes2 = (hour2*60)+min2
    minutes1 *= pixel
    minutes2 *= pixel
    if(state === 0){
        return minutes1 + firstRowRecHeight
    }
    if(state === 1){
        return  (minutes2 + firstRowRecHeight) - (minutes1 + firstRowRecHeight)
    }
}


function onLoad(){
    
    canvasHeight = canvas.height
    canvasWidth = canvas.width
    rectHeight = canvasHeight/14
    rectWidth = canvasWidth/5
    firstColumRecWidth = rectWidth/2 + FIRST_COLUM_REC_WIDTH_OFFSET
    firstRowRecHeight = rectHeight + FIRST_ROW_REC_HEIGHT_OFFSET
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //this it only for top left rect
    ctx.beginPath()
    ctx.rect(0,0,firstColumRecWidth,firstRowRecHeight)
    ctx.stroke()

    canvasHeight -= firstRowRecHeight//we take out the first row rect height from the canvas height so that we know how much height we have left
    rectHeight = canvasHeight/13 //we make a new rect height from the canvas size we have left
    //

    //this is for the first colum of rectangles
    for(let i = firstRowRecHeight;i < canvas.height;i+=rectHeight){
        ctx.beginPath()
        ctx.rect(0,i,firstColumRecWidth,rectHeight)
        let text = Math.floor(((i-firstRowRecHeight)/rectHeight) + 8) + ":00 - " + Math.floor(((i-firstRowRecHeight)/rectHeight) + 9) + ":00"
        labelCenterOfRect(text,0,i,firstColumRecWidth,rectHeight,15)
        ctx.stroke()
    }
    canvasWidth-=firstColumRecWidth//we take out the first col rect width from the canvas width so that we know how much width we have left
    rectWidth = canvasWidth/5 // we make a new rect width from the canvas we have left
    //

    //this is for the first row of rectangles
    for(let i = firstColumRecWidth;i < canvas.width;i+=rectWidth){
        ctx.beginPath()
        ctx.rect(i,0,rectWidth,firstRowRecHeight)
        labelCenterOfRect(denovi[(i - firstColumRecWidth)/rectWidth],i,0,rectWidth,firstRowRecHeight,20)
        ctx.stroke()
    }
    ctx.stroke()
    //we removed the height previously with the first top right rect
    //
    
    //rest of the rects
    for(let i = firstRowRecHeight;i < canvas.height;i+=rectHeight){
        for(let j = firstColumRecWidth;j < canvas.width;j+=rectWidth){
            ctx.beginPath()
            ctx.rect(j,i,rectWidth,rectHeight)
            ctx.stroke()
        }
    }
    //
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       
       let resp = JSON.parse(this.response);
       events=resp
       document.querySelector("#userName").textContent+=resp[0];
       console.log(resp);
       console.log("Before shift!");
       resp.shift();
       console.log(resp);
       console.log("After shift!")
       events.sort(compare);
       resp.map((e)=>{
        drawEvent(firstColumRecWidth+(rectWidth*e.day),timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,0),rectWidth,timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,1));
        labelCenterOfRect(e.event_content,firstColumRecWidth+(rectWidth*e.day),timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,0),rectWidth,timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,1),25)
       })
    }
};
xhttp.open("GET", "http://localhost:8008/getEvents", true);
xhttp.send();

    
}

const map = new Map(); //A map for storing the days (as strings) mapped to numbers
map.set("Ponedelnik",0);
map.set("Vtornik",1);
map.set("Sreda",2);
map.set("Cetvrtok",3);
map.set("Petok",4);


let activeButtonText="";
let btnsArr =document.querySelectorAll(".daysBtn");
btnsArr= Array.from(btnsArr);
console.log(btnsArr);
btnsArr.forEach((e)=>{
    e.addEventListener("click",changeButton);
})
function changeButton(e){
    console.log(e.target.textContent);
    activeButtonText=e.target.textContent;
    btnsArr.forEach((e)=>{
        if(e.textContent!==activeButtonText){
            e.classList="daysBtn";
        }else{
            e.classList="daysBtnActive";
        }
    })
}

let addEventBtn = document.querySelector("#addEventBtn");
addEventBtn.addEventListener("click",()=>{
        document.querySelector(".addEventModal").style.display="block";
        setTimeout(()=>{
        document.querySelector(".addEventModal").style.top="50%";    
        },200);
    
});

let postEventBtn=document.querySelector("#btnEventSubmit");
let e1=document.querySelector("#txtInputFromHr");
let e2=document.querySelector("#txtInputFromMin");
let e3=document.querySelector("#txtInputToHr");
let e4=document.querySelector("#txtInputToMin");
let e5=document.querySelector("#txtInputLabel");
postEventBtn.addEventListener("click",()=>{
    if(e1.value.trim()==""||e2.value.trim()==""||e3.value.trim()==""||e4.value.trim()==""||e5.value.trim()==""){
        alert("EMPTY FIELDS");
    }
    else{
        if((e1.value<8 ||e1.value>21)||(e3.value<8 ||e3.value>21)||(e2.value<0 ||e2.value>59)||(e4.value<0 ||e4.value>59)){
            alert(" ENTER A VALID TIME INTERVAL ");
        }else{
            var http = new XMLHttpRequest();
            var url = 'http://localhost:8008/postEvent';
            var params =JSON.stringify( {
                userID:0,
                start_h:e1.value,
                start_m:e2.value,
                end_h:e3.value,
                end_m:e4.value,
                event_content:e5.value,
                event_color:"#ADD8E6",
                day:map.get(document.querySelector(".daysBtnActive").textContent)
            });
            http.open('POST', url, true);
            http.setRequestHeader("Content-Type", "application/json; charset=UTF-8")


            //Send the proper header information along with the request
            
            http.onload = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                onload();
               
            }else{
                window.location.href = "http://localhost:8008/login";
            }
        }
            http.send(params);
            document.querySelector(".addEventModal").style.top="150%";
            setTimeout(()=>{
            document.querySelector(".addEventModal").style.display="none";
            },500)
        }
        
    }
    
    
})

function compare(a,b){
    if(a.day >b.day){
        return 1;
    }
    if(a.day <b.day){
        return -1;
    }
    return 0;
}

let editBtn = document.querySelector("#editEventBtn");
let template = `
    <div class="event">
        <h1></h1>
    </div>

`
editBtn.addEventListener("click",function(){
    document.querySelector(".editEventModal").style.display="block";    
    setTimeout(()=>{
        document.querySelector(".editEventModal").style.top="50%";
        },200);
    
    doSometing();
})

function deleteEventButton(e){
    console.log(events[e.target.parentElement.getAttribute("id")]);
    
    console.log(events);
    let http = new XMLHttpRequest();
    http.open('POST', "http://localhost:8008/deleteEvent", false);
            http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            //Send the proper header information along with the request
            http.onload = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                events.splice(e.target.parentElement.getAttribute("id"),1);
                console.log("Event id "+ e.target.parentElement.getAttribute("id"));
                doSometing();
                e.target.parentElement.remove();
                console.log(events);
                onLoad();
            }else{
                window.location.href = "http://localhost:8008/login";
            }
        }
    http.send(JSON.stringify(events[e.target.parentElement.getAttribute("id")]));    
    
}











function doSometing(){
    document.querySelector("#eventsContainer").innerHTML="";
    events.map((e,index)=>{
        template = `
    <div class="event" id="${index}">
        <h1>${denovi[e.day]}</h1>
        <p>${e.event_content}</p>
        <h3>From ${e.start_h}:${e.start_m} To ${e.end_h}:${e.end_m}</h3>
        <button class="deleteBtn">Delete</button>
    </div>

`
        document.querySelector("#eventsContainer").insertAdjacentHTML("beforeend",template);
    });
    let btnARR =document.querySelectorAll(".deleteBtn");
    btnARR = Array.from(btnARR);
    btnARR.forEach((e)=>{
        e.addEventListener("click",deleteEventButton);
    })
}

document.querySelector("#closeAddModalButton").addEventListener("click",(e)=>{
    document.querySelector(".addEventModal").style.top="150%";
    setTimeout(()=>{
        
        document.querySelector(".addEventModal").style.display="none";    
        },200);
});

document.querySelector("#closeEditModalButton").addEventListener("click",(e)=>{
    document.querySelector(".editEventModal").style.top="150%";
    setTimeout(()=>{
        
        document.querySelector(".editEventModal").style.display="none";    
        },200);
});



let logOutButton = document.querySelector("#logOutBtn");
logOutButton.addEventListener("click",logout);

function logout(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
            window.location.href = "http://localhost:8008/login";
        }
    };
    xhttp.open("GET", "http://localhost:8008/logOut", true);
    xhttp.send();
}