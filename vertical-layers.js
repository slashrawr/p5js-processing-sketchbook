let min_width = 20;
let max_width = 50;
let min_height = 100;
let max_height;
let layers = 3;
let palettes = [];
let palette = {};

function preload() {
  palettes = loadJSON('assets/palettes.json');
}

function setup() {
  createCanvas(500, 500);
  max_height = height*0.8;
  noLoop();
  strokeCap(SQUARE);
  
  palette = palettes[int(random(0,199))];
}

function draw() {
  background(255);
  
  for (let l = 0; l < layers; l++) {
    let current_width = 0;
    
    while (current_width < width) {
    let stroke_width = random(min_width,max_width);
    
    strokeWeight(stroke_width);
    
      let col = random(palette);
    colour = hexToRGB(col,random(0.3,0.6));
    stroke(colour);
    line(current_width, height, current_width, height-random(min_height, max_height))
    
    current_width += stroke_width;
    }
  }
}

function hexToRGB(h,alpha) {
  let r = 0, g = 0, b = 0;
  r = "0x" + h[1] + h[2];
  g = "0x" + h[3] + h[4];
  b = "0x" + h[5] + h[6];
  r = +(r / 255 * 100).toFixed(1);
  g = +(g / 255 * 100).toFixed(1);
  b = +(b / 255 * 100).toFixed(1);
  return "rgba(" + r + "%," + g + "%," + b + "%," + str(alpha) + ")";
}