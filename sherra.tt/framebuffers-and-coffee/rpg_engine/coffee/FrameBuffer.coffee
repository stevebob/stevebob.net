class FrameBuffer
  constructor: ->
    
    # create the unique html id
    id = "framebuffer" + FrameBuffer.globalCount

    # create a new canvas element
    @canvasArr = ($ "<canvas/>", {id: id})
    @canvas = @canvasArr[0]
    @canvas.width = 300
    @canvas.height = 300

    # get the 2d context for drawing
    @ctx = @canvas.getContext '2d'

    # increment the count
    FrameBuffer.globalCount++

  # used to create unique names for frame buffers
  @globalCount: 0

