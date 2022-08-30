let showBlocks = false;
let showGrid = false;
let showFlowDirection = false;

let seed = 134536;
let animationlength = 5;

let isize = 20;
let _scale = 40;
let _rows = 0;
let _cols = 0;
let _maxspeed = 4;
let _flowfield = [];
let _particlecount = 500;
let particles = [];
let palettes = [];
let palette = {};

function preload() {
  palettes = loadJSON('assets/palettes.json');
}

function setup() {
  createCanvas(700, 700);
  randomSeed(seed);
  noiseSeed(seed);
  colorMode(RGB);
  angleMode(RADIANS);
  strokeCap(ROUND);
  palette = palettes[int(random(0,199))];
  rows = floor(height / _scale)
  cols = floor(width / _scale);
  frameRate(30);
  noiseDetail(4,0.5);
  
  createFlowField();
  for (let i = 0; i < _particlecount; i++) {
    createParticle();
  }
  
  //noLoop();
}

function draw() {
  //background(0);
  //let counter = 0;
   
  for (let x = 0; x <= cols; x++) {
   for (let y = 0; y <= rows; y++) {
      let direction = _flowfield[x + y * _scale].heading();
      
      //console.debug(direction);
      
      let scaledx = x*_scale;
      let scaledy = y*_scale;
      let scaledx1 = (x+1)*_scale;
      let scaledy1 = (y+1)*_scale;

      if (showBlocks) {
        fill(255/direction);
        rect(scaledx, scaledy,scaledx1,scaledy1);
      }
      
      if (showGrid) {
        stroke(255);
        line(scaledx, scaledy, scaledx, width);
        line(scaledx, scaledy, height, scaledy);
      }
        
      if (showFlowDirection) {
        push();
        strokeWeight(2);
        stroke(255,0,0);
        let x2 = cos(direction)* isize + scaledx;
        let y2 = sin(direction)* isize + scaledy;
        line(scaledx,scaledy,x2,y2);
        pop();
      } 
    }
  }
  
  push()
  stroke(255, 80);
  strokeWeight(2);

  particles.forEach(particle => {
    let x = floor(particle.position.x / _scale);
    let y = floor(particle.position.y / _scale);

    flow = _flowfield[x + y * _scale];
    particle.previousposition = particle.position.copy();
    particle.acceleration.add(flow);
    particle.velocity.add(particle.acceleration);
    particle.velocity.limit(_maxspeed);
    particle.position.add(particle.velocity);
    particle.acceleration.mult(0);
    edgeCheck(particle);
    stroke(particle.colour);
    point(particle.position.x, particle.position.y);
    line(particle.previousposition.x, particle.previousposition.y, particle.position.x, particle.position.y);
  })
  
  pop();
  
  if (frameCount >= 30*animationlength)
    noLoop();
}

function createFlowField() {
  let counter = 0;
  
  for (let x = 0; x <= cols; x++) {
    for (let y = 0; y <= rows; y++) {
      let dir = noise(x/(_scale/2),y/(_scale/2));
      let vec = p5.Vector.fromAngle(TWO_PI*dir, random(0.1,1));
      _flowfield[x + y * _scale] = vec;  
    }
  }
}

function createParticle() {
  let particle = {};
  particle.position = new p5.Vector(random(width), random(height));
  particle.velocity = new p5.Vector(0,0);
  particle.acceleration = new p5.Vector(0,0);
  particle.previousposition = particle.position.copy();
  particle.colour = hexToRGB(random(palette), random(50,120));
  
  particles.push(particle);
}

function edgeCheck(particle) {  
  if (particle.position.x < 0) {
    particle.position.x = width;
    particle.previousposition = particle.position.copy();
  }
  else if (particle.position.x > width) {
    particle.position.x = 0;
    particle.previousposition = particle.position.copy();
  }
    
  
  if (particle.position.y < 0) {
    particle.position.y = height;
    particle.previousposition = particle.position.copy();
  }
  else if (particle.position.y > height) {
    particle.position.y = 0;
    particle.previousposition = particle.position.copy();
  }
}

function hexToRGB(hexColour, alpha) {
  var aRgbHex = hexColour.replace("#","").match(/.{1,2}/g);
  var aRgb = [
            parseInt(aRgbHex[0], 16),
            parseInt(aRgbHex[1], 16),
            parseInt(aRgbHex[2], 16)
        ];
  let colour = color(aRgb[0], aRgb[1], aRgb[2], alpha);
  return colour;
}