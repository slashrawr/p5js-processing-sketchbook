let points = []
let fps = 30;
let max_z = 300;
let max_points = 200;
let max_lines = 1;
let min_speed = 0.01;
let max_speed = 0.1;
let orbit_radius = 610.0;
let cam = {};
let world_width = 0;
let world_height = 0;

function setup() {
  createCanvas(700, 700, WEBGL);
  frameRate(fps);
  cam = createCamera();

  world_width = 300;
  world_height = world_width * (width/height);
  
  for (let i = 0; i < max_points; i++)
  {
    let p = createPoint();
    points[i] = p;
  }
}

function draw() {
  background(0);
  stroke(255)
  translate(0,0,0);
  
  let x = cos(frameCount/TWO_PI/6) * orbit_radius;
  let z = sin(frameCount/TWO_PI/6) * orbit_radius;

  cam.setPosition(x, 0, z);
  cam.lookAt(0,0,0);
  
  for (let i = 0; i < points.length; i++)
  {
    let p = points[i];
    
    p.position = p5.Vector.lerp(p.position, p.destination, p.speed);
    
    if (p5.Vector.dist(p.position,p.destination) < 3)
    {
      p.speed = random(max_speed);
      p.line = random([true,false,false,false,false,false,false,false]);
      p.in_motion = false;
      p.destination = createVector(random(-world_width,world_width), random(-world_height,world_height), random(-max_z,max_z));
    }
  }
  
  for (let i = 0; i < points.length; i++)
  {
    let p = points[i];
    
    if (p.line == true && p.in_motion == false)
    {
      pair(p);
    }
    
    push();
    translate(p.position);
    sphere(2);
    pop();
  }
  
  for (let i = 0; i < points.length; i++)
  {
    let p = points[i];

    if (p.line == true && p.in_motion == true) {
      stroke(p.position.y, p.position.z, p.position.x);
      line(p.position.x, p.position.y, p.position.z, p.pair.position.x, p.pair.position.y, p.pair.position.z);
    }
  }
}

function createPoint() {
  let p = {};
  p.position = createVector(random(-world_width,world_width), random(-world_height,world_height), random(-max_z,max_z));
  p.destination = createVector(random(-world_width,world_width), random(-world_height,world_height), random(-max_z,max_z))
  p.speed = random(min_speed, max_speed);
  p.direction = createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI));
  p.line = random([true,false,false,false,false,false,false,false]);
  p.pair = {}
  return p;
}

function pair(point) {
  point.in_motion = true;
  point.pair = points[int(random(0,points.length-1))];
}