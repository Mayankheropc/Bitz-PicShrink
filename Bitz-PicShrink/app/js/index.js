// require to communicate with main.js file 
// ther will only me one main.js file and there can be any no. of renderer files
const { ipcRenderer } = require('electron')
// var ipc = require("electron").ipcRenderer;

const fse = require('fs-extra')
const path = require('path')
const os = require('os');
const { electron } = require('process');


const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customText = document.getElementById("custom-text");
const successText = document.getElementById("success-text")
const slider = document.getElementById("quality-slider")
const sliderOutputText = document.getElementById("slider-value")
const resizeBtn = document.getElementById("resize-button");
var outputPath = path.join(os.homedir(), 'Bitz-FileManager');
// var outputPath = "D:\\Downloads\\Bitz-PicShrink";


customBtn.addEventListener("click", function () {
    realFileBtn.click();
});

resizeBtn.disabled = true;
var file_path;
var img_quality;

realFileBtn.addEventListener("change", function () {
    if (realFileBtn.files.length > 0) {
        file_path = realFileBtn.files[0].path;
        file_name = path.basename(file_path);
        customText.innerHTML = file_name;
        resizeBtn.disabled = false;
        successText.innerHTML = '';
    }
    else {
        customText.innerHTML = "No image selected"
        resizeBtn.disabled = true;
        successText.innerHTML = '';
    }
});

// printing the output path where files will be stored
document.getElementById('output-path').innerText = outputPath;


slider.oninput = function(){
    var value = (this.value-this.min)/(this.max-this.min)*100;
    this.style.background = 'linear-gradient(to right, #6b8dff 0%, #ff2a5f ' + value + '%, #fff ' + value + '%, #fff 100%)';
    sliderOutputText.innerHTML = slider.value;
}

resizeBtn.addEventListener('click', e =>{
    e.preventDefault();

    file_path = realFileBtn.files[0].path;
    img_quality = slider.value;

    // sending the value of quality and file_path to the main process (main.js)
    // it can be obtained/catched by 'image:minimized' function
    ipcRenderer.send('image:minimized', {
        file_path,
        img_quality,
        outputPath,
    })
    
})



// On Done for printing success after execution
ipcRenderer.on('image:done', ()=> {
    successText.innerHTML = ('image resized to ' + img_quality + '% quality')
})