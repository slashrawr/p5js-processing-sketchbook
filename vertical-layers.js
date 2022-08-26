let min_width = 20;
let max_width = 50;
let min_height = 100;
let max_height;
let layers = 3;
let palettes = [];
let palette = {};
let points = [];
let groups = [];
let avgheights = [];
let segments = 3;

function preload() {
  palettes = loadJSON('assets/palettes.json');
}

function setup() {
  createCanvas(700, 700);
  max_height = height*0.8;
  noLoop();
  strokeCap(SQUARE);
  
  
  groups[0] = 0;
  groups[1] = width/3;
  groups[2] = (width/3)*2;
  groups.push(width);
  console.debug(groups);
  
  palette = palettes[int(random(0,199))];
}

function draw() {
  let bgcol = random(palette);
  background(hexToRGB(bgcol,1.0));
  points = [];
  
  for (let l = 0; l < layers; l++) {
    let current_width = 0;
    let groupcounter = 0;
    let counter = 0;
    let agg = 0;
    
    while (current_width < width) {
      let stroke_width = random(min_width,max_width);
      let h = height-random(min_height, max_height);
      
      if (current_width + stroke_width > groups[groupcounter]) {
        groupcounter++;
        if (counter == 0)
          avgheights[0] = h/2;
        else
          avgheights.push((agg/counter)/2);
        agg = h;
        counter = 1;
      }
      else {
        agg += h;
        counter++;
      }

      strokeWeight(stroke_width);
      let col = color(0);
      
      do {
        col = random(palette);
        colour = hexToRGB(col,random(0.3,0.6));
        stroke(colour);
      } while (col == bgcol)
      
      line(current_width, height, current_width, h);
      points.push(new p5.Vector(current_width, h));
      current_width += stroke_width;
    }
    
  strokeWeight(3);
  fill(0,0,0,0);
  bezier(0, avgheights[0]/random(1.5,2), width*0.33, avgheights[1]-random(avgheights[1]), width*0.66, avgheights[2]-random(avgheights[2]), width, avgheights[3]/random(1.5,2));
  
  avgheights = [];
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