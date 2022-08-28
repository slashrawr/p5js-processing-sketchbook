let showBlocks = false;
let showGrid = false;
let showFlowDirection = true;

let isize = 20;

let _scale = 40;
let _rows = 0;
let _cols = 0;
let flowfield = [];

let p ={};

function setup() {
  createCanvas(600, 600);
  colorMode(RGB);
  angleMode(RADIANS);
  rows = floor(height / _scale)
  cols = floor(width / _scale);
  frameRate(10);
  noiseDetail(10,0.5);
  
  createFlowField();
  p = new p5.Vector(width/2, height/2);
  
  noLoop();
}

function draw() {
  //background(220);
  let counter = 0;
  
  for (let x = 0; x <= cols; x++) {
    for (let y = 0; y <= rows; y++) {
      let direction = flowfield[counter].heading()/TWO_PI;
      
      //console.debug(direction);
      
      let scaledx = x*_scale;
      let scaledy = y*_scale;
      let scaledx1 = (x+1)*_scale;
      let scaledy1 = (y+1)*_scale;

      fill(direction*255);
      
      if (showBlocks) {
        rect(scaledx, scaledy,scaledx1,scaledy1);
      }
      
      if (showGrid) {
        stroke(255);
        line(scaledx, scaledy, scaledx, width);
        line(scaledx, scaledy, height, scaledy);
      }
        
      if (showFlowDirection) {
        push();
        stroke(255,0,0);
        let x2 = sin(TWO_PI*direction)* isize + scaledx;
        let y2 = cos(TWO_PI*direction)* isize + scaledy;
        line(scaledx,scaledy,x2,y2);
        pop();
      } 
      
      counter++;
    }
  }
}

function createFlowField() {
  let counter = 0;
  
  for (let x = 0; x <= cols; x++) {
    for (let y = 0; y <= rows; y++) {
      let dir = noise(x/(_scale/2),y/(_scale/2));
      flowfield[counter] = p5.Vector.fromAngle(TWO_PI*dir);
      console.debug(flowfield[counter]);
      counter++;
      
    }
  }
}