let showBlocks = false;
let showGrid = true;
let showFlowDirection = true;

let isize = 20;

let _scale = 40;
let _rows = 0;
let _cols = 0;
let _maxspeed = 10;
let flowfield = [];
let _particlecount = 500;
let particles = [];

function setup() {
  createCanvas(600, 600);
  colorMode(RGB);
  angleMode(RADIANS);
  rows = floor(height / _scale)
  cols = floor(width / _scale);
  frameRate(10);
  noiseDetail(10,0.5);
  
  createFlowField();
  for (let i = 0; i < _particlecount; i++) {
    createParticle();
  }
  
  //noLoop();
}

function draw() {
  background(0);
  let counter = 0;
   for (let y = 0; y <= rows; y++) {
  for (let x = 0; x <= cols; x++) {
   
      let direction = flowfield[x + y * _scale].heading();
      
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
        stroke(255*flowfield[x + y * _scale].mag(),0,0);
        let x2 = cos(direction)* isize + scaledx;
        let y2 = sin(direction)* isize + scaledy;
        line(scaledx,scaledy,x2,y2);
        pop();
      } 
    }
  }
  
  //if (keyIsPressed === true) {
  
  push()
  stroke(255);
  strokeWeight(5);

  particles.forEach(particle => {
    let x = floor(particle.position.x / _scale);
    let y = floor(particle.position.y / _scale);

    flow = flowfield[x + y * _scale];
    //console.debug("x: " + x + " - y:" + y + " - flow:" + flow);
    particle.acceleration.add(flow);
    //console.debug("acc: " + particle.acceleration + " - vel: " + particle.velocity);
    particle.velocity.add(particle.acceleration);
    particle.velocity.limit(_maxspeed);
    particle.position.add(particle.velocity);
    particle.acceleration.mult(0);
    edgeCheck(particle);
    point(particle.position.x, particle.position.y);
  })
  
  pop();
 // }
}

function createFlowField() {
  let counter = 0;
  for (let y = 0; y <= rows; y++) {
  for (let x = 0; x <= cols; x++) {
    
      let dir = noise(x/(_scale/2),y/(_scale/2));
      let vec = p5.Vector.fromAngle(TWO_PI*dir, random(0.1,1));
      flowfield[x + y * _scale] = vec;
      //console.debug(flowfield[x+y*_scale].heading());     
    }
  }
}

function createParticle() {
  let particle = {};
  particle.position = new p5.Vector(random(width), random(height));
  particle.velocity = new p5.Vector(0,0);
  particle.acceleration = new p5.Vector(0,0);
  
  particles.push(particle);
}

function edgeCheck(particle) {  
  if (particle.position.x < 0)
    particle.position.x = width;
  else if (particle.position.x > width)
    particle.position.x = 0;
  
  if (particle.position.y < 0)
    particle.position.y = height;
  else if (particle.position.y > height)
    particle.position.y = 0;
  
}