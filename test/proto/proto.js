var canvas_bg = document.getElementById('background');
var ctx_bg = canvas_bg.getContext('2d');

var canvas_fg = document.getElementById('foreground');
var ctx_fg = canvas_fg.getContext('2d');

var width = 512;
var height = 512;

function imageLoad (img, canvas) {
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
}

var bg = new Image();
bg.src = 'back.png';
bg.onload = imageLoad(bg, canvas_bg);

var fg = new Image();
fg.src = 'fore.png';
fg.onload = imageLoad(fg, canvas_fg);

var fgData = ctx_fg.getImageData(0, 0, width, height);
var data = fgData.data;

console.log(data);

/*
var isPress = false;
var old = null;
canvas.addEventListener('mousedown', function (e){
  isPress = true;
  old = {x: e.offsetX, y: e.offsetY};
});
canvas.addEventListener('mousemove', function (e){
  if (isPress) {
    var x = e.offsetX;
    var y = e.offsetY;
    ctx.globalCompositeOperation = 'destination-out';

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();

    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(old.x, old.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    old = {x: x, y: y};

  }
});
canvas.addEventListener('mouseup', function (e){
  isPress = false;
});
*/