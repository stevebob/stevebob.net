
$ ->
  ImageLoader.loadAsync [
    "http://stevebob.net/rss.png",
    "http://stevebob.net/facebook.png",
    "http://stevebob.net/twitter.png"
  ], (images) ->
    
    canvas = document.getElementById 'screen'
    ctx = canvas.getContext '2d'
    fb = new FrameBuffer
    
    fb.ctx.drawImage images[0], 0, 0
    fb.ctx.drawImage images[1], 20, 20
    fb.ctx.drawImage images[2], 40, 40
    
    
    ctx.drawImage fb.canvas, 0, 0
    
