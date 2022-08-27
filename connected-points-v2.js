let points = []
let fps = 60;
let move_size = 100;
let max_z = 300;
let max_points = 100;
let max_lines = 1;
let min_speed = -0.7;
let max_speed = 0.7;
let orbit_radius = 610.0;
let cam = {};
let world_width = 0;
let world_height = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  frameRate(fps);
  cam = createCamera();

  world_width = 300;
  world_height = world_width * (width/height);
  
  for (let i = 0; i < max_points; i++)
  {
    let p = createPoint();
    points[i] = p;
  }
  
  for (let i = 0; i < points.length; i++)
    pair(points[i]);
}

function draw() {
  background(0);
  stroke(255)
  translate(0,0,0);
  
  let x = cos(frameCount/TWO_PI/10) * orbit_radius;
  let z = sin(frameCount/TWO_PI/10) * orbit_radius;

  cam.setPosition(x, 0, z);
  cam.lookAt(0,0,0);
  
  
  for (let i = 0; i < points.length; i++)
  {
    let p = points[i];
    p.position.add(cos(frameCount/TWO_PI/6)*p.speed, sin(frameCount/TWO_PI/6)*p.speed, sin(frameCount/TWO_PI/6)*p.speed);
    
    push();
    translate(p.position);
    sphere(random(1));
    pop();
    
    stroke(255);
    for (let j  = 0; j < p.pair.length; j++) {
      let pair = p.pair[j];
      line(p.position.x, p.position.y, p.position.z, pair.position.x, pair.position.y, pair.position.z);
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
  p.pair = [];
  
  return p;
}

function pair(point) {
  point.in_motion = true;
  point.pair[0] = {};
  point.pair[0].position = new p5.Vector(10000,10000,10000);
  point.pair[1] = {};
  point.pair[1].position = new p5.Vector(10000,10000,10000);
  point.pair[2] = {};
  point.pair[2].position = new p5.Vector(10000,10000,10000);
  
  for (let i = 0; i < points.length; i++)
  {
      let testpoint = points[i];
      let dist = point.position.dist(testpoint.position);
  
    if (dist > 0)
      {
    for (let j = 0; j < point.pair.length; j++)
      {
        if (dist < point.pair[j].position.dist(point.position) )
        {
          point.pair[j] = testpoint;
        }
      }
      }
  }
}