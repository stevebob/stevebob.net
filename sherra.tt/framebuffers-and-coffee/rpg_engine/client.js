// Generated by CoffeeScript 1.4.0

$(function() {
  return ImageLoader.loadAsync(["http://images.wikia.com/animalcrossing/images/a/ae/Mudkip.png"], function(images) {
    var canvas, ctx, fb;
    canvas = document.getElementById('screen');
    ctx = canvas.getContext('2d');
    fb = new FrameBuffer;
    fb.ctx.fillStyle = "rgb(120, 170, 200)";
    fb.ctx.fillRect(2, 2, 212, 274);
    fb.ctx.fill;
    fb.ctx.lineWidth = 4;
    fb.ctx.strokeStyle = "rgb(50, 80, 200)";
    fb.ctx.strokeRect(2, 2, 212, 274);
    ctx.stroke;
    fb.ctx.drawImage(images[0], 2, 2, 210, 272);
    return ctx.drawImage(fb.canvas, 0, 0);
  });
});