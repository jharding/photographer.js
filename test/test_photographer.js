describe('Photographer.js', function() {

  // reference to original objects
  var _URL = window.URL;
  var _getUserMedia = navigator.getUserMedia;

  // test data
  var imgDataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8';

  // reference to instantiated object
  var photographer = null;

  it('should exist in global namespace as Photographer', function() {
    expect(window.Photographer).toBeDefined();
  });

  describe('when initalized with no container element', function() {
    it('should throw an error', function() {
      expect(function () { var p = new Photographer(); }).toThrow();
    });
  });

  describe('when getUserMedia is not available', function() {
    beforeEach(function() {
      navigator.getUserMedia = null;

      var container = document.createElement('div');
      photographer = new Photographer({ container: container });
    });

    it('should return false when start is called', function() {
      expect(photographer.start()).toEqual(false);
    });

    it('should return false when stop is called', function() {
      expect(photographer.stop()).toEqual(false);
    });

    it('should return false when takePhoto is called', function() {
      expect(photographer.takePhoto()).toEqual(false);
    });

    it('should return an empty array when getPhotos is called', function() {
      expect(photographer.getPhotos()).toEqual([]);
    });
  });

  describe('when getUserMedia is available but broken', function() {
    beforeEach(function() {
      navigator.getUserMedia = function (opts, onSuccess, onError) {
        onError('BROKEN!');
      };

      var container = document.createElement('div');
      photographer = new Photographer({ container: container });
    });

    it('should throw error when start is called', function() {
      expect(function() { photographer.start(); }).toThrow();
    });
  });

  describe('when getUserMedia is available and working', function() {
    var stream = 'http://localhost/';

    beforeEach(function() {
      navigator.getUserMedia = function (opts, onSuccess, onError) {
        onSuccess(stream);
      };

      var container = document.createElement('div');
      photographer = new Photographer({ container: container });
    });

    describe('when start is called with createObjectURL available', function() {
      beforeEach(function() {
        window.URL = { createObjectURL: function() {} };
        spyOn(window.URL, 'createObjectURL');

        photographer.start();
      });

      it('should set video src to object URL', function() {
        expect(window.URL.createObjectURL).toHaveBeenCalled();
      });
    });

    describe('when start is called without createObjectURL available', function() {
      beforeEach(function() {
        window.URL = null;
        photographer.start();
      });

      it('should set video src to stream when start is called', function() {
        expect(photographer._video.src).toEqual(stream);
      });
    });

    describe('when stopped is called', function() {
      it('should end video stream when stopped is called', function() {
        // mock out stream
        var ref = photographer._stream = { stop: function() {} };
        spyOn(photographer._stream, 'stop');

        photographer.stop();
        expect(ref.stop).toHaveBeenCalled();
        expect(photographer._stream).toBeUndefined();
      });
    });

    describe('when takePhoto is called', function() {
      beforeEach(function() {
        photographer._config.flash = jasmine.createSpy('flash');
        photographer._canvas.toDataURL = function() { return imgDataURL; };

        photographer.takePhoto();
      });


      it('should call flash when takePhoto is called', function() {
        expect(photographer._config.flash).toHaveBeenCalled();
      });
    });
  });
});
