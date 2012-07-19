/*globals */

(function() {

  // cross-browser normalization
  // -------------

  window.URL = window.URL || window.webkitURL || window.mozURL ||
               window.msURL || window.oURL;

  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia ||
                           navigator.oGetUserMedia;

  // Photographer: say cheese!
  // ------------

  // default configurations
  var defaults = {
    flash: null,
    container: null,
    imgFormat: 'png',
    imgWidth: null,
    imgHeight: null
  };

  var Photographer = function(config) {
    this._config = extend(defaults, config);

    this._stream = null;

    this._photos = [];

    this._container = this._config.container;

    // dimensions of container element
    var width = this._container.clientWidth;
    var height = this._container.clientHeight;

    // if imgWidth and imgHeight weren't explicitly set,
    // inherit values from the dimensions of the container
    this._config.imgWidth || (this._config.imgWidth = width);
    this._config.imgHeight || (this._config.imgHeight = height);

    // video element is where the webcam stream
    // gets piped to for the live preview
    this._video = document.createElement('video');
    this._video.width = width;
    this._video.height = height;
    this._video.autoplay = true;
    this._container.appendChild(this._video);

    // canvas element is used to capture images
    this._canvas = document.createElement('canvas');
    this._canvas.width = this._config.imgWidth;
    this._canvas.height = this._config.imgHeight;

    this._context = this._canvas.getContext('2d');

    // if the browser doesn't support getUserMedia, override
    // some methods to return false immediately
    if (!navigator.getUserMedia) {
      this.start = this.stop = this.takePhoto = function() {
        return false;
      };
    }
  };

  // prototype alias
  var proto = Photographer.prototype;

  proto.start = function() {
    var that = this;

    // getUserMedia worked :)
    var pipeStreamToVideo = function(stream) {
      that._stream = stream;

      window.URL ? that._video.src = window.URL.createObjectURL(stream) :
                   that._video.src = stream;
    };

    // getUserMedia failed :(
    var handleError = function(error) {
      throw new Error(error);
    };

    navigator.getUserMedia({ video: true }, pipeStreamToVideo, handleError);

    return true;
  };

  proto.stop = function() {
    this._stream && this._stream.stop();
    delete this._stream;

    return true;
  };

  proto.takePhoto = function() {
    // if flash function is present, call it
    this._config.flash && this._config.flash(this._container);

    this._context.drawImage(this._video, 0, 0, this._config.imgWidth,
                            this._config.imgHeight);

    var src = this._canvas.toDataURL('image/' + this._config.imgFormat);
    var format = src.match(/^data:image\/(\w+);/)[1];

    var photo = {
      src: src,
      format: format,
      width: this._config.imgWidth,
      height: this._config.imgHeight
    };

    // push a copy of the latest photo into the photos array
    this._photos.push(extend(photo));

    return photo;
  };

  proto.getPhotos = function() {
    // return a copy of the photos array
    return this._photos.slice(0);
  };

  // if the browser doesn't support getUserMedia, override
  // some methods to return false immediately
  if (!navigator.getUserMedia) {
    proto.start = proto.stop = proto.takePhoto = function() {
      return false;
    };
  }

  // expose globally
  window.Photographer = Photographer;

  // helper functions
  // ----------------

  // shallow copies
  var extend = function(target, obj) {
    var extendedObj = {};

    for (var key in target) {
      if (target.hasOwnProperty(key)) {
        extendedObj[key] = target[key];
      }
    }

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        extendedObj[key] = obj[key];
      }
    }

    return extendedObj;
  };

})();
