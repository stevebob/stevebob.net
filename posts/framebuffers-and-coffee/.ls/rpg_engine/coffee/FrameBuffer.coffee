class FrameBuffer
  constructor: ->
    
    # create the unique html id
    id = "framebuffer" + FrameBuffer.globalCount

    # create a new canvas element
    @canvas = ($ "<canvas/>", id: id)[0]

    # get the 2d context for drawing
    @ctx = @canvas.getContext '2d'

    # increment the count
    FrameBuffer.globalCount++

  # used to create unique names for frame buffers
  @globalCount: 0

  test: ->
    @ctx.fillRect 0, 0, 100, 100
    @ctx.fill()
