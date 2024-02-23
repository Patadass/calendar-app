const FIRST_COLUM_REC_WIDTH_OFFSET = 20
const FIRST_ROW_REC_HEIGHT_OFFSET = 20
const MINUTES_IN_TABLE = 780

//COLORS
const LIGHT_BLUE = "#ADD8E6"
//

const denovi = ["Ponedelnik", "Vtornik", "Sreda", "Cetvrtok", "Petok"]


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


document.getElementById("btnPonedelnik").addEventListener("click",getDayOfWeek)
document.getElementById("btnVtornik").addEventListener("click",getDayOfWeek)
document.getElementById("btnSreda").addEventListener("click",getDayOfWeek)
document.getElementById("btnCetvrtok").addEventListener("click",getDayOfWeek)
document.getElementById("btnPetok").addEventListener("click",getDayOfWeek)

let izbranDen = -1
function getDayOfWeek(){
    document.getElementById("btnPonedelnik").disabled = false
    document.getElementById("btnVtornik").disabled = false
    document.getElementById("btnSreda").disabled = false
    document.getElementById("btnCetvrtok").disabled = false
    document.getElementById("btnPetok").disabled = false
    let daysOfWeek = 5
    for(let i = 0;i < daysOfWeek;i++){
        if(denovi[i] === this.name){
            izbranDen = i
        }
    }
    this.disabled = true
}

document.getElementById("txtInputFromHr").addEventListener('input',handleInput)
document.getElementById("txtInputFromHr").addEventListener('propertychange',handleInput)
document.getElementById("txtInputFromMin").addEventListener('input',handleInput)
document.getElementById("txtInputFromMin").addEventListener('propertychange',handleInput)
document.getElementById("txtInputToHr").addEventListener('input',handleInput)
document.getElementById("txtInputToHr").addEventListener('propertychange',handleInput)
document.getElementById("txtInputToMin").addEventListener('input',handleInput)
document.getElementById("txtInputToMin").addEventListener('propertychange',handleInput)

function handleInput(e){
    let text = e.target.value
    if(text.length <= 0){
        return
    }
    let i = text.length
    if(text[i-1].match(/[a-z]/i)){
       e.target.value = e.target.value.slice(0, -1)
    }
    if(i === 2){
        if(e.target.id === "txtInputFromHr"){
            if(parseInt(text) > 21 || parseInt(text) < 8){
                document.getElementById("disclaimerFromHr").innerText = text + " is not a valid hour"
                e.target.value = ""
                return;
            }
            document.getElementById("disclaimerFromHr").innerText = ""
            document.getElementById("txtInputFromMin").focus()
        }
        if(e.target.id === "txtInputFromMin"){
            if(parseInt(text) >= 60){
                document.getElementById("disclaimerFromMin").innerText = text + " is not a valid number of minutes"
                e.target.value = ""
                return;
            }
            document.getElementById("disclaimerFromMin").innerText = ""
            document.getElementById("txtInputToHr").focus()
        }
        if(e.target.id === "txtInputToHr"){
            if(parseInt(text) > 21 || parseInt(text) < 8){
                document.getElementById("disclaimerToHr").innerText = text + " is not a valid hour"
                e.target.value = ""
                return;
            }
            document.getElementById("disclaimerToHr").innerText = ""
            document.getElementById("txtInputToMin").focus()
        }
        if(e.target.id === "txtInputToMin"){
            if(parseInt(text) >= 60){
                document.getElementById("disclaimerToMin").innerText = text + " is not a valid hour"
                e.target.value = ""
                return;
            }
            document.getElementById("disclaimerToMin").innerText = ""
            document.getElementById("txtInputToMin").focus()
        }
    }
    if(i === 3){
        e.target.value = e.target.value.slice(0, -1)
    }
}

document.getElementById("btnEventSubmit").addEventListener("click", submitEvent)

function submitEvent(){
    if(izbranDen === -1){
        return
    }

    let hour1 = parseInt(document.getElementById("txtInputFromHr").value)
    let min1 = parseInt(document.getElementById("txtInputFromMin").value)
    let hour2 = parseInt(document.getElementById("txtInputToHr").value)
    let min2 = parseInt(document.getElementById("txtInputToMin").value)
    let text = document.getElementById("txtInputLabel").value
    console.log(hour1,min1,hour2,min2,izbranDen)
    drawEvent(firstColumRecWidth + (rectWidth*izbranDen),timeToPlaceInTable(hour1,min1,hour2,min2,0),rectWidth,timeToPlaceInTable(hour1,min1,hour2,min2,1))
    labelCenterOfRect(text,firstColumRecWidth + (rectWidth*izbranDen),timeToPlaceInTable(hour1,min1,hour2,min2,0),rectWidth,timeToPlaceInTable(hour1,min1,hour2,min2,1),25)
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

    //drawEvent(firstColumRecWidth,timeToPlaceInTable(13,0,15,0,0),rectWidth,timeToPlaceInTable(13,0,15,0,1))
    //labelCenterOfRect("Mat 1",firstColumRecWidth,timeToPlaceInTable(13,0,15,0,0),rectWidth,timeToPlaceInTable(13,0,15,0,1),25)
}