// // user canvas
//var c = document.getElementById('c');
//var ctx = c.getContext('2d');


// gif patch canvas
var tempCanvas = document.createElement('canvas');
var tempCtx = tempCanvas.getContext('2d');
// full gif canvas
var gifCanvas = document.createElement('canvas');
var gifCtx = gifCanvas.getContext('2d');

// var url = document.getElementById('url');
// default gif
// url.value = '/demo/horses.gif';

// load the default gif
// loadGIF();
var gif;

// load a gif with the current input url value
function loadGIF(url, canvas){
	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";

	oReq.onload = function (oEvent) {
	    var arrayBuffer = oReq.response; // Note: not oReq.responseText
	    if (arrayBuffer) {
	        gif = new GIF(arrayBuffer);
	        var frames = gif.decompressFrames(true);
	        console.log(gif);
	        // render the gif
	        renderGIF(frames, canvas);
	    }
	};

	oReq.send(null);	
}

var playing = false;
var bEdgeDetect = false;
var bInvert = false;
var bGrayscale = false;
var pixelPercent = 100;
var loadedFrames;
var frameIndex;

function playpause(c, ctx){
    playing = !playing;
	if(playing){
        // console.log('CANVAS FILHA DA PUTA ' + c)
        // console.log('CONTEXTO FILHA DA PUTA ' + ctx)
        renderFrame(c, ctx);
        // console.log('CANVAS FILHA DA PUTA ' + c)
        // console.log('CONTEXTO FILHA DA PUTA ' + ctx)
	}
}

function renderGIF(frames, c){
    var ctx = c.getContext('2d');

	loadedFrames = frames;
	frameIndex = 0;

	c.width = frames[0].dims.width;
	c.height = frames[0].dims.height;

	gifCanvas.width = c.width;
	gifCanvas.height = c.height;

	if(!playing){
		playpause(c, ctx);
	}
}

var frameImageData;

function drawPatch(frame){
	var dims = frame.dims;
	
	if(!frameImageData || dims.width != frameImageData.width || dims.height != frameImageData.height){
		tempCanvas.width = dims.width;
		tempCanvas.height = dims.height;
		frameImageData = tempCtx.createImageData(dims.width, dims.height);	
	}
	
	// set the patch data as an override
	frameImageData.data.set(frame.patch);

	// draw the patch back over the canvas
	tempCtx.putImageData(frameImageData, 0, 0);

	gifCtx.drawImage(tempCanvas, dims.left, dims.top);
}


function manipulate(c, ctx){
    // console.log('CANVAS FILHA DA PUTA ' + c)
    // console.log('CONTEXTO FILHA DA PUTA ' + ctx)
	var imageData = gifCtx.getImageData(0, 0, gifCanvas.width, gifCanvas.height);
	var other = gifCtx.createImageData(gifCanvas.width, gifCanvas.height);

	// do pixelation
	var pixelsX = 5 + Math.floor(pixelPercent / 100 * (c.width - 5));
	var pixelsY = (pixelsX * c.height) / c.width;

	if(pixelPercent != 100){
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}

	ctx.putImageData(imageData, 0, 0);
	ctx.drawImage(c, 0, 0, c.width, c.height, 0, 0, pixelsX, pixelsY);
    ctx.drawImage(c, 0, 0, pixelsX, pixelsY, 0, 0, c.width, c.height);
    
    // console.log('CANVAS FILHA DA PUTA ' + c)
    // console.log('CONTEXTO FILHA DA PUTA ' + ctx)
}

function renderFrame(c, ctx){

    // console.log('CANVAS AAAAAAAAAA ' + c)
    // console.log('CONTEXTO AAAAAAAAAAAA ' + ctx)
	// get the frame
    var frame = loadedFrames[frameIndex];
    
    // console.log(frame)

	var start = new Date().getTime();

	gifCtx.clearRect(0, 0, c.width, c.height);

	// draw the patch
	drawPatch(frame);

	// perform manipulation
	manipulate(c, ctx);

	// update the frame index
	frameIndex++;
	if(frameIndex >= loadedFrames.length){
		frameIndex = 0;
	}

	var end = new Date().getTime();
	var diff = end - start;

	if(playing){
		// delay the next gif frame
		setTimeout(function(){
			// requestAnimationFrame(renderFrame);
            renderFrame(c, ctx);
            // console.log('CANVAS BBBB ' + c)
            // console.log('CONTEXTO BBB ' + ctx)
		}, Math.max(0, Math.floor(frame.delay - diff)));
	}
}