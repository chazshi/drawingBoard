var canvasWidth = Math.min(800, $(window).width() - 20);
var canvasHeight = canvasWidth;
var isMouseDown = false;

var lineColorSet = $('.colorSelector input').val();; //颜色
var lineWidthSet = lineWidthSet = $('.sizeValue').val(); //粗细


//上一次鼠标位置
var lastLoc = {
        x: 0,
        y: 0
    }
    //上一次时间戳
var lastTimestamp = 0;
//上一次线宽	//调控笔画
var lastLineWidth = -1;

var canvas = document.getElementById('canvas');

function beginStroke(point) {
    isMouseDown = true;
    lastLoc = windowPosToCanvasPos(point.x, point.y);
    lastTimestamp = new Date().getTime();
}

function endStroke() {
    isMouseDown = false;
}

function moveStroke(point) {
    //console.log("mouse move");
    var curLoc = windowPosToCanvasPos(point.x, point.y);
    var curTimestamp = new Date().getTime();

    var tempDis = calcDistance(curLoc, lastLoc); //距离
    var tempTime = curTimestamp - lastTimestamp; //时间

    var lineWidthControl = calcLineWidth(tempDis, tempTime, lineWidthSet);

    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x, curLoc.y);
    context.lineWidth = lineWidthControl;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = lineColorSet;
    context.stroke();

    lastLoc = curLoc;
    lastTimestamp = curTimestamp;
    lastLineWidth = lineWidthControl;
}

canvas.onmousedown = function(e) {
    e.stopPropagation();
    e.preventDefault();
    beginStroke({ x: e.clientX, y: e.clientY });
}
canvas.onmouseup = function(e) {
    e.stopPropagation();
    e.preventDefault();
    endStroke();
}
canvas.onmouseout = function(e) {
    e.stopPropagation();
    e.preventDefault();
    endStroke();
}
canvas.onmousemove = function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (isMouseDown) {
        moveStroke({ x: e.clientX, y: e.clientY });
    }
}
canvas.addEventListener('touchstart', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({ x: touch.pageX, y: touch.pageY });
});
canvas.addEventListener('touchmove', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    if (isMouseDown) {
    	touch = e.touches[0];
    	moveStroke({ x: touch.pageX, y: touch.pageY });
    }
});
canvas.addEventListener('touchend', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    endStroke();
});

canvas.width = canvasWidth; //这里写也可以
canvas.height = canvasHeight;
$("#controller").css("width", canvasWidth + "px")

if (canvas.getContext('2d')) {
    var context = canvas.getContext('2d');

    drawMiGrid(); //画米字格


    /*
    //开始绘制1	//画渐变线
    context.beginPath();
    context.moveTo(100,200);
    context.lineTo(400,500);
    context.lineTo(100,500);s
    context.lineTo(100,200);
    context.closePath();
    context.lineWidth = 5;
    //配置渐变笔触，参数：x0,y0,x1,y1
    var gradient=context.createLinearGradient(100,100,500,500);	
    gradient.addColorStop("0","magenta");
    gradient.addColorStop("0.5","blue");
    gradient.addColorStop("1.0","red");
    context.strokeStyle=gradient;	// 用渐变进行填充
    context.stroke();	//画线

    //开始绘制2	//画线
    context.beginPath();
    context.moveTo(500,200);
    context.lineTo(800,200);
    context.lineTo(500,500);
    context.lineTo(500,200);
    context.closePath();
    context.lineWidth = 5;
    //	黑色笔触
    context.strokeStyle = '#000';	
    context.stroke();	//画线
	
    //开始绘制3	//填充
    context.fillStyle = 'rgb(222,222,222)';
    context.fill();	//填充

    //开始绘制4	画文字
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = '#0ff';	//	红色笔触
    context.font="120pt Verdana";	//配置字体
    context.strokeText("李雪飞",100,150);	//画文字
    context.closePath();
    context.stroke();	//画线
	
    //开始绘制5	绘制七巧板
    var sevenArrays = [
    	{point:[{x:1000,y:200},{x:1600,y:200},{x:1300,y:500},{x:1000,y:200}],color:'#CBF162'},
    	{point:[{x:1600,y:200},{x:1600,y:500},{x:1450,y:650},{x:1450,y:350},{x:1600,y:200}],color:'#FF5062'},
    	{point:[{x:1450,y:350},{x:1450,y:650},{x:1300,y:500},{x:1450,y:350}],color:'#FDEA11'},
    	{point:[{x:1600,y:500},{x:1600,y:800},{x:1300,y:800},{x:1600,y:500}],color:'#FCC520'},
    	{point:[{x:1300,y:500},{x:1450,y:650},{x:1300,y:800},{x:1150,y:650},{x:1300,y:500}],color:'#A499C0'},
    	{point:[{x:1150,y:650},{x:1300,y:800},{x:1000,y:800},{x:1150,y:650}],color:'#FE9CCE'},
    	{point:[{x:1000,y:200},{x:1300,y:500},{x:1000,y:800},{x:1000,y:200}],color:'#61B7D1'}
    ];
    for (var i = 0; i < sevenArrays.length; i++) {
    	drawPath(sevenArrays[i],context);	//路径
    }
    function drawPath(sevenArray,ctx) {
    	ctx.beginPath();
    	ctx.moveTo(sevenArray.point[0].x,sevenArray.point[0].y);
    	for (var i = 1; i < sevenArray.point.length; i++) {
    		ctx.lineTo(sevenArray.point[i].x,sevenArray.point[i].y);
    	}
    	ctx.closePath();
    	ctx.fillStyle = sevenArray.color;
    	ctx.fill();	//填充
    	// ctx.lineWidth = .5;
    	// ctx.strokeStyle = '#000';//sevenArray.color;
    	// ctx.stroke();	//画线
    }
	
    //开始绘制6	绘制弧和圆
    context.beginPath();
    context.arc(250,800,150,0,1.5*Math.PI,false);	//参数列表：centerx弧心x,centery弧心y,radius半径,startingAngle起始弧度,endingAngle结束弧度,anticlockwise=false逆时针吗
    context.closePath();	//closePath会自动封闭图形，若不希望图形封闭可以光写beginPath不写closePath，对fill没用
    context.strokeStyle = '#f00';
    context.stroke();
	
    //开始绘制7	绘制时钟

    */

} else {
    alert("当前浏览器不支持Canvas，请更换浏览器后再试。");
}

function drawMiGrid() {
    context.save(); //保存之前的状态设置
    //绘制米字格		
    context.beginPath();
    context.moveTo(3, 3);
    context.lineTo(canvasWidth - 3, 3);
    context.lineTo(canvasWidth - 3, canvasHeight - 3);
    context.lineTo(3, canvasHeight - 3);
    context.lineTo(3, 3);
    context.closePath();

    context.lineWidth = 6;
    context.strokeStyle = "rgb(230,11,9)"; //	红色笔触
    context.stroke(); //画线

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvasWidth, canvasHeight);

    context.moveTo(canvasWidth, 0);
    context.lineTo(0, canvasHeight);

    context.moveTo(canvasWidth / 2, 0);
    context.lineTo(canvasWidth / 2, canvasHeight);

    context.moveTo(0, canvasHeight / 2);
    context.lineTo(canvasWidth, canvasHeight / 2);
    context.closePath();

    context.lineWidth = 1;
    context.stroke(); //画线
    context.restore(); //恢复之前的状态设置
}

function windowPosToCanvasPos(x, y) {
    var bbox = canvas.getBoundingClientRect(); //返回与页面上下左右的距离
    return {
        x: Math.round(x - bbox.left),
        y: Math.round(y - bbox.top)
    }
}

function calcDistance(loc1, loc2) {
    var distanceX = loc1.x - loc2.x;
    var distanceY = loc1.y - loc2.y;
    return Math.sqrt(distanceX * distanceX + distanceY * distanceY)
}

var speedMax = 10;
var speedMin = 0.1;
var lineWidthMin = 1;

function calcLineWidth(tempDis, tempTime, lineWidth) {
    var tempSpeed = tempDis / tempTime; //计算画笔速度

    var resultLineWidth;
    if (tempSpeed <= speedMin) {
        resultLineWidth = lineWidth;
    } else if (tempSpeed >= speedMax) {
        resultLineWidth = lineWidthMin;
    } else {
        resultLineWidth = lineWidth - (tempSpeed - speedMin) / (speedMax - speedMin) * (lineWidth - lineWidthMin);
    }

    if (lastLineWidth == -1) {
        return resultLineWidth;
    } else {
        return lastLineWidth * 2 / 3 + resultLineWidth * 1 / 3;
    }


}

function onClearBtnClick() {

    context.clearRect(0, 0, canvas.width, canvas.height); //context的clearRect方法
    drawMiGrid();
}

function setColor() {

    lineColorSet = $('.colorSelector input').val();
}

function setLineWidth() {

    lineWidthSet = $('input.sizeValue').val();
}
