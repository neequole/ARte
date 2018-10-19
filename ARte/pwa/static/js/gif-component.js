AFRAME.registerComponent('gif', {
    schema: {
        src: { type: 'string', default: 'aaa' },
        autoplay: { type: 'bool', default: true }
    },

    init: function () {
        this.canvas = document.createElement('canvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.loadGIF(this.data.src, this);
    },


    loadGIF: function (src, t) {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", src, true);
	    oReq.responseType = "arraybuffer";
	    oReq.onload = function (oEvent) {
	        var arrayBuffer = oReq.response; // Note: not oReq.responseText
	        if (arrayBuffer) {
                var gif = new GIF(arrayBuffer);

                var frames = gif.decompressFrames(true);
                
                // console.log('frames ' + frames)

                // console.log(t.canvas)

	            t.canvas.width = frames[0].dims.width;
                t.canvas.height = frames[0].dims.height;

                // var frameIndex = 0;

                for (i=0; i<frames.length; i++) {
                    t.renderFrame(frames[i]);
                }
            }
        };

	    oReq.send(null);	
    },

    renderGIF: function (frames) {
        
    },

    renderFrame : function (frame) {
        var start = new Date().getTime();
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawPatch(frame);

        var end = new Date().getTime();
        var diff = end - start;

        setTimeout(function () {}, Math.max(0, Math.floor(frame.delay - diff)));
    },


    drawPatch : function(frame) {
        var tmpCanvas = document.createElement('canvas');
        var tmpCtx = tmpCanvas.getContext('2d');

        var dims = frame.dims;

        var frameImageData = tmpCtx.createImageData(dims.width, dims.height);
        frameImageData.data.set(frame.patch)

        tmpCtx.putImageData(frameImageData, 0, 0);

        this.canvasContext.drawImage(tmpCanvas, dims.left, dims.top)
    }
}); 