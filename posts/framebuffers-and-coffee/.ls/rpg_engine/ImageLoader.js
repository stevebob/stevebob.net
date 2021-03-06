// Generated by CoffeeScript 1.4.0
var ImageLoader;

ImageLoader = (function() {

  function ImageLoader() {}

  ImageLoader.loadAsync = function(srcArray, callback) {
    var images, numLoaded, wait;
    images = srcArray.map(function() {
      return new Image;
    });
    numLoaded = 0;
    zipWith(images, srcArray, function(img, src) {
      img.onload = function() {
        return numLoaded++;
      };
      return img.src = src;
    });
    wait = function(period, retries) {
      if (numLoaded === images.length) {
        return callback(images);
      }
      if (retries === 0) {
        return console.log("timeout loading images");
      }
      console.log(".");
      return setTimeout(wait, period, retries - 1);
    };
    console.log("Loading images");
    return wait(100, 20);
  };

  return ImageLoader;

})();
