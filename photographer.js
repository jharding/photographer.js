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

  // Photographer
  // ------------

  // default configurations
  var defaults = {
    flash: null,
    container: null,
    imgWidth: null,
    imgHeight: null
  };

  var Photographer = function(config) {
    this._config = extend(defaults, config);

    this._stream = null;

    this._photos = [];
    this._latestPhoto = null;

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
  };

  Photographer.prototype.start = function() {
    var that = this;

    // getUserMedia worked :)
    var pipeStreamToVideo = function(stream) {
      that._stream = stream;

      window.URL ? that._video.src = window.URL.createObjectURL(stream) :
                   that._video.src = stream;
    };

    // getUserMedia failed :(
    var handleError = function(error) {
      console.error(error);
    };

    navigator.getUserMedia({ video: true }, pipeStreamToVideo, handleError);
  };

  Photographer.prototype.stop = function() {
    this._stream && this._stream.stop();

    delete this._stream;
  };

  Photographer.prototype.takePhoto = function() {
    // if flash function is present, call it
    this._config.flash && this._config.flash(this._container);

    this._context.drawImage(this._video, 0, 0, this._config.imgWidth,
                            this._config.imgHeight);

    this._latestPhoto = this._canvas.toDataURL('image/png');
    this._photos.push(this._latestPhoto);
  };

  Photographer.prototype.getPhotos = function() {
    // return a copy of the photos array
    return this._photos.slice(0);
  };

  Photographer.prototype.getLatestPhoto = function() {
    return this._latestPhoto;
  };

  // expose globally
  window.Photographer = Photographer;

  // helper functions
  // ----------------

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
