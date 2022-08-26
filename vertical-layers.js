let show_clouds = true;
let textured_buildings = true;
let soft_edges = true;

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


function preload() {
  palettes = loadJSON('assets/palettes.json');
}

function setup() {
  createCanvas(700, 700);
  colorMode(RGB);
  max_height = height*0.8;
  noLoop();
  strokeCap(SQUARE);
  noiseDetail(2,0.65);
  
  
  groups[0] = 0;
  groups[1] = width/3;
  groups[2] = (width/3)*2;
  groups[3] = (width);
  groups.push(width);

  
  palette = palettes[int(random(0,199))];
}

function draw() {
  let bgcol = hexToRGB(random(palette), 255);
  background(bgcol);
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
      
      let col = hexToRGB(random(palette), random(100,180));
      
      if (textured_buildings) {
        strokeWeight(1);
        for (let x = current_width; x < current_width + stroke_width; x++)
        {
          for (let y = height; y > (soft_edges ? h*random(0.6,1.0) : h); y--)
          {
            let alpha = random(100,180);
            let n = noise(x, y);
            alpha *= n;
            col.setAlpha(alpha);
            stroke(col);
            point(x,y);
          }
        }
      }
      else {
        strokeWeight(stroke_width);
        do {
          let alpha = random(100,180);
          let n = noise(stroke_width, h);
          alpha *= n;
          col = hexToRGB(random(palette), alpha);
          stroke(col);
        } while (col == bgcol)
      }
      line(current_width, height, current_width, h);
      points.push(new p5.Vector(current_width, h));
      current_width += stroke_width;
    }
  
  if (show_clouds) {
    strokeWeight(2);
    fill(0,0,0,0);
    bezier(0, avgheights[0]/random(1.5,2), width*0.33, avgheights[1]-random(avgheights[1]), width*0.66, avgheights[2]-random(avgheights[2]), width, avgheights[3]/random(1.5,2));
    avgheights = [];
  }
  
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