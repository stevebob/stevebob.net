class ImageLoader
  # srcArray: an array of strings representing the image sources
  # callback: a function to call on the array of Image objects once
  # they are loaded
  @loadAsync: (srcArray, callback) ->
    
    # create a blank image for each source
    images = srcArray.map -> new Image
    
    # maintain a count of how many images have loaded
    numLoaded = 0
    
    # load the images
    zipWith images, srcArray, (img, src) ->
      
      # when the image loads, increment the counter
      img.onload = -> numLoaded++

      # this actually loads the image
      img.src = src
    
    # this function sets itself to be called periodically to check
    # if all the images are loaded, and makes the callback with
    # the loaded images as its argument once they are loaded
    wait = (period, retries) ->
      if numLoaded == images.length
        return callback(images)

      if retries == 0
        return console.log "timeout loading images"

      console.log "."
      setTimeout wait, period, retries-1

    console.log "Loading images"
    wait 100, 20



