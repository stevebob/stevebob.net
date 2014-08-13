$ ->
  ImageLoader.loadAsync [
    "http://images.wikia.com/animalcrossing/images/a/ae/Mudkip.png"
  ], (images) ->
    # images is an array of Image objects passed to this callback   
    
    # connect to the main canvas
    canvas = document.getElementById 'screen'
    ctx = canvas.getContext '2d'

    # create a framebuffer
    fb = new FrameBuffer
    
    # draw a box
    fb.ctx.fillStyle="rgb(120, 170, 200)"
    fb.ctx.fillRect 2, 2, 212, 274
    fb.ctx.fill
    fb.ctx.lineWidth = 4
    fb.ctx.strokeStyle="rgb(50, 80, 200)"
    fb.ctx.strokeRect 2, 2, 212, 274
    ctx.stroke
   
    # draw some images on the framebuffer
    fb.ctx.drawImage images[0], 2, 2, 210, 272
    
    # copy the framebuffer onto the main canvas
    ctx.drawImage fb.canvas, 0, 0
    
