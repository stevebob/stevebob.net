// Generated by CoffeeScript 1.4.0
var FrameBuffer;

FrameBuffer = (function() {

  function FrameBuffer() {
    var id;
    id = "framebuffer" + FrameBuffer.globalCount;
    this.canvasArr = $("<canvas/>", {
      id: id
    });
    this.canvas = this.canvasArr[0];
    this.canvas.width = 300;
    this.canvas.height = 300;
    this.ctx = this.canvas.getContext('2d');
    FrameBuffer.globalCount++;
  }

  FrameBuffer.globalCount = 0;

  return FrameBuffer;

})();
