const FIRST_COLUM_REC_WIDTH_OFFSET = 20
const FIRST_ROW_REC_HEIGHT_OFFSET = 20

function labelCenterOfRect(text, rectX, rectY, rw, rh, fontSize, ctx){
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = fontSize + "px Arial"
    ctx.fillText(text,rectX+(rw/2), rectY+(rh/2))
}

function onLoad(){
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    let canvasHeight = canvas.height
    let canvasWidth = canvas.width
    let rectHeight = canvasHeight/14
    let rectWidth = canvasWidth/5
    let firstColumRecWidth = rectWidth/2 + FIRST_COLUM_REC_WIDTH_OFFSET
    let firstRowRecHeight = rectHeight + FIRST_ROW_REC_HEIGHT_OFFSET

    //this it only for top left rect
    ctx.beginPath()
    ctx.rect(0,0,firstColumRecWidth,firstRowRecHeight)
    ctx.stroke()

    canvasHeight -= firstRowRecHeight//we take out the first row rect height from the canvas height so that we know how much height we have left
    rectHeight = canvasHeight/13 //we make a new rect height from the canvas size we have left
    //

    //this is for the first row of rectangles
    for(let i = firstRowRecHeight;i < canvas.height;i+=rectHeight){
        ctx.beginPath()
        ctx.rect(0,i,firstColumRecWidth,rectHeight)
        ctx.stroke()
    }
    canvasWidth-=firstColumRecWidth//we take out the first col rect width from the canvas width so that we know how much width we have left
    rectWidth = canvasWidth/5 // we make a new rect width from the canvas we have left
    //

    //this is for the first colum of rectangles
    for(let i = firstColumRecWidth;i < canvas.width;i+=rectWidth){
        ctx.beginPath()
        ctx.rect(i,0,rectWidth,firstRowRecHeight)
        ctx.stroke()
    }
    labelCenterOfRect("Ponedelnik",firstColumRecWidth,0,rectWidth,firstRowRecHeight,25,ctx)
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