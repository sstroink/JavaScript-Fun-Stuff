//get elements
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");

//build functions
function togglePlay(){

    if(video.paused){
        video.play();
    }else{
        video.pause(); 
    }
}

//changes button to play or pause icon 
function updateButton(){
    const icon = this.paused ? '►' : '❚ ❚'; 
}

function skip(){
    console.log(this.dataset.skip); 
    video.currentTime += parseFloat(this.dataset.skip); 
}

function handleRangeUpdate(){
    video[this.name] = this.value;
}

function handleProgress(){
    const percent = (video.currentTime/ video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e){
    //calcs where along the bar it is in px. and how much adjust the video time based on that distance 
    //ex. if the player is 620px wide and click is at 310px then change to 50% duration. Calculated based on width of player! 
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; 
    video.currentTime = scrubTime;  //set the current time to where the scrub is set to 
    console.log(e); 
}

//hook up event listners
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);

toggle.addEventListener("click", togglePlay);

//multiple buttons so use forEach
skipButtons.forEach(button => button.addEventListener("click", skip)); 

ranges.forEach(range => range.addEventListener("change", handleRangeUpdate));
ranges.forEach(range => range.addEventListener("mousemove", handleRangeUpdate));

//flag for mouse being clicked 
let mousedown = false; 

progress.addEventListener("click" ,scrub);
//if mousedown is true then it will move on and call scrub, and will stop if mousedown is false
progress.addEventListener("mousemove" , (e) => mousedown && scrub(e));
//listen for mouse up/down and change flag variable appropriately 
progress.addEventListener("mousedown", () => mousedown = true);
progress.addEventListener("mouseup" , () => mousedown = false);