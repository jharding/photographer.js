Photographer.js
===============

__HTML5 Apps Shouldn't Require Flash__

For a long time (too long), Flash was required if a web app wanted to capture images through a user's webcam. Things are changing though and bleeding edge browsers now allow access to media devices (video and audio input) through the WebRTC API. Photographer.js is a library built to help abstract away the WebRTC API and make capturing photos in a web app dead simple. 

Downloads
---------

* [Development Version (0.0.2)](https://raw.github.com/jharding/photographer.js/master/photographer.js)
* [Production Version (0.0.2)](https://raw.github.com/jharding/photographer.js/master/photographer.min.js)

API
---

### Photographer(config)

```javascript
  var photographer = new Photographer({ 
    container: element
  });
```

The constructor function. It takes one argument, an object containing configuration details. There are 5 configuration properties:

* `container`(DOM element, **required**) - The DOM element the `Photographer` instance will display the live preview video. If this property isn't provided, an error will be thrown.

* `flash`(function, optional, `null` by default) - Before a `Photographer` instance captures an image, it'll call this function if provided. `flash` will have one argument passed to it, the `container` element.

* `imgFormat`(string, optional, `png` by default) - The preferred image format of the captured images.

* `imgWidth`(number, optional, width of `container` by default) - The preferred width of the capture images.

* `imgHeight`(number, optional, height of `container` by default) - The preferred height of the capture images.

### Photographer#start()

```javascript
  photographer.start();
```

If the browser supports `navigator.getUserMedia`, this method will return `true` and start piping the video stream from the user's camera device to the live preview video. If the browser doesn't support `navigator.getUserMedia`, `false` will be returned. This method will also throw an error if `navigator.getUserMedia` results in an error.

### Photographer#stop()

```javascript
  photographer.stop();
```

If the browser supports `navigator.getUserMedia`, this method will stop the video stream from the user's camera device and return `true`. If the browser doesn't support `navigator.getUserMedia`, `false` will be returned.

### Photographer#takePhoto()

```javascript
  var photo = photographer.takePhoto();
```

If the browser supports `navigator.getUserMedia` and calling `photographer.start()` was successful, `photographer.takePhoto()` will capture an image and return a photo object (see below for more info on the photo object). If a `flash` function was configured, that function will get called right before the image is captured.

If the browser doesn't support `navigator.getUserMedia`, this method will return `false`.

The photo object `photographer.takePhoto` returns contains the following properties: 

* `src`(string) - The base64 encoding of the captured image.

* `format`(string) - The format the image was captured as. 

* `width`(number) - The width of the captured image.

* `height`(number) - The height of the captured image.

### Photographer#getPhotos()

```javascript
  var photos = photographer.getPhotos();
```

Each `Photographer` instance stores an array of all of the photos it has taken. `photographer.getPhotos()` will return a copy of that array.

Example Usage
-------------

```html
<html>
  <head>
    <!-- load Photographer.js -->
    <script src='photographer.js'></script>
  </head>
  <body>
    <!-- this element will contain the video element Photographer.js
         pipes the webcam video stream to -->
    <div id='photobooth' style='width: 640px; height: 480px;'></div>

    <!-- when this button is clicked, a photo will be captured -->
    <button id='camera-click'>Take Photo</button>

    <script>
      // DOM references
      var body = document.getElementsByTagName('body')[0];
      var photobooth = document.getElementById('photobooth');
      var cameraClickBtn = document.getElementById('camera-click');

      // this function will get called right before Photographer.js
      // captures a photo. you can use it to provide a custom visual
      // cue to the user that their photo is about to be taken
      var flash = function(container) {
        alert('Say cheese!');
      };

      // create a Photographer instance  
      var photographer = new Photographer({
        flash: flash,
        container: photobooth
      });

      photographer.start();

      // when the user clicks on the 'Take Photo' button, capture their
      // image and append that image to the body
      cameraClickBtn.onclick = function() {
        var photo = photographer.takePhoto();

        // create the img element to be appended
        var img = new Image();
        img.src = photo.src;
        img.width = photo.width;
        img.height = photo.height;

        // add the image to the body
        body.appendChild(img);
      };
    </script>
  </body>
</html>
```

Supported Browsers
------------------

* Opera 12+
* Chrome
* Firefox Nightly

If all goes to plan, [full WebRTC support should be available in Firefox 18](https://hacks.mozilla.org/2012/09/full-webrtc-support-is-soon-coming-to-a-web-browser-near-you/).

License
-------

Copyright (c) 2012 Jake Harding  
Licensed under the MIT license.
