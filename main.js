const FIRST_COLUM_REC_WIDTH_OFFSET = 20
const FIRST_ROW_REC_HEIGHT_OFFSET = 20
const MINUTES_IN_TABLE = 780

//COLORS
const LIGHT_BLUE = "#ADD8E6"
//

const denovi = ["Ponedelnik", "Vtornik", "Sreda", "Cetvrtok", "Petok"]

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       let resp = JSON.parse(this.response);
       resp.map((e)=>{
        drawEvent(firstColumRecWidth+(rectWidth*e.day),timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,0),rectWidth,timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,1));
        labelCenterOfRect(e.event_content,firstColumRecWidth+(rectWidth*e.day),timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,0),rectWidth,timeToPlaceInTable(e.start_h,e.start_m,e.end_h,e.end_m,1),25)
       })
    }
};
xhttp.open("GET", "http://localhost:8008/getEvents", true);
xhttp.send();


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

    
}