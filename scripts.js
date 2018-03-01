const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        //then is a promise that has a fufillment and a rejection
        .then(localMediaStream => {
            console.log(localMediaStream);  
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
    
        .catch(err => {
            console.error(`Webcam access denied`, err);
        }); 
    
}

function paintToCanvas(){
    //getting height and width to use in the canvas 
    const width = video.videoWidth;
    const height = video.videoHeight; 
    canvas.width = width;
    canvas.height = height;
    console.log(width,height);
    
    return setInterval(() => {
        ctx.drawImage(video, 0,0, width, height);
        
        //get pixels out so we can manipulate them for "filters"
        let pixels = ctx.getImageData(0,0,width,height);
        //make effects
        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);
        
        //put pixels back
        ctx.putImageData(pixels,0,0);
                 
    }, 16);
}

function takePhoto(){
    //play the sound
    snap.currentTime = 0;
    snap.play(); 
    
    //take data out of canvas
    const data = canvas.toDataURL("image/jpeg");
    
    //creating link for photo taken 
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "pretty");
    link.innerHTML = `<img src="${data}" alt="Photobooth picture">`;
    strip.insertBefore(link, strip.firstChild); 
}

function redEffect(pixels) {
    //looping through every pixel in array for photo 
    for(let i=0; i<pixels.data.length; i+=4){

        pixels.data[i+ 0] = pixels.data[i+ 0] + 100;//RED
        pixels.data[i+ 1] =  pixels.data[i+ 1] - 50;//GREEN
        pixels.data[i+ 2] =  pixels.data[i+ 2] *0.5;//BLUE
    }
    
    return pixels; 
    
}

function rgbSplit(pixels){
    //looping through every pixel in array for photo 
    for(let i=0; i<pixels.data.length; i+=4){
        
        //pulling apart pixels and swapping one futher back in array with current one 
        pixels.data[i - 150] = pixels.data[i+ 0];//RED
        pixels.data[i + 100] =  pixels.data[i+ 1];//GREEN
        pixels.data[i - 150] =  pixels.data[i+ 2];//BLUE
    }
    
    return pixels; 
}

function greenScreen(pixels) {
  const levels = {};

  //grab all the sliders 
  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take out the alpha(transparency) pixel
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}


getVideo();

video.addEventListener("canplay", paintToCanvas);