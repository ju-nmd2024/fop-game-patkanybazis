function setup() {
  createCanvas(800, 500);
}

let x = 400;
let y = 395;
let speed = 1;

function star(x,y,s) {
  fill(255);
  noStroke();
  triangle(x , y  , x + 5 * s, y - 20*s, x + 10*s , y );
  triangle(x, y , x + 5* s, y + 20* s, x + 10* s , y );
  triangle(x + 5 * s, y - 5 * s, x - 10 * s, y , x + 5 * s, y + 5 * s );
  triangle(x + 5 * s, y - 5 * s, x + 20 * s, y , x + 5 * s, y + 5 * s );
  }
  
  
  
  function character(x,y,s) {
  
      // jetpack bag
      noStroke();
      fill(105,105,105);
      rect(x - 45 * s , y - 50 * s, 90 * s, 100 * s, 10 * s);
       
      //left mini rocket
      noStroke();
      fill(128,128,128);
      rect(x - 85 * s , y - 50 * s, 40 * s, 100 * s, 10 * s);
      
      fill(255,0,0);
      triangle(x - 85 * s, y - 43 * s, x - 65 * s, y - 90 * s, x - 45 * s,y - 43 * s);
      rect(x - 85 * s, y, 40 * s , 10 * s ); //didn'T work  (y) * s removed for moving
      rect(x - 85 * s, y + 20 * s, 40 * s, 10 * s );
      
      
      //right mini rocket
      noStroke();
      fill(128,128,128);
      rect(x + 45 * s, y - 50 * s, 40 * s, 100 * s, 10 * s);
      
      fill(255,0,0);
      triangle(x + 85 * s, y - 43 * s, x + 65 * s, y - 90 * s, x + 45 * s,y - 43 * s);
      rect(x + 45 * s, y, 40 * s, 10 * s );  
      rect(x + 45 * s, y + 20 * s, 40 * s, 10 * s );
      
       //tail
       fill(34,34,34);
       noStroke();
       ellipse(x + 30 * s, y + 70 * s, 35 * s, 35 * s);
       ellipse(x + 40 * s, y + 90 * s, 25 * s, 25 * s);
       ellipse(x + 55 * s, y + 70 * s, 35 * s, 35  * s);
       ellipse(x + 60 * s, y + 95 * s, 35 * s, 35 * s);
       ellipse(x + 78 * s, y + 78 * s, 35 * s, 35 * s);
       ellipse(x + 80 * s, y + 100 * s, 35 * s, 35 * s);
       ellipse(x + 100 * s, y + 80 * s, 35 * s, 35 * s);
       ellipse(x + 100 * s, y + 100 * s, 35 * s, 35 * s);
       ellipse(x + 120 * s, y + 70 * s, 35 * s, 35 * s);
       ellipse(x + 125 * s, y + 95 * s, 35 * s, 35 * s);
       ellipse(x + 135 * s, y + 60 * s, 30 * s, 30 * s);
       ellipse(x + 145 * s, y + 70* s, 30 * s, 30 * s);
       ellipse(x + 145 * s, y + 85 * s, 30 * s, 30 * s);
       ellipse(x + 150 * s, y + 53 * s, 30 * s, 30 * s);
       ellipse(x + 158 * s, y + 68 * s, 30 * s, 30 * s);
       ellipse(x + 164 * s, y + 52 * s, 20 * s, 20 * s);
      
      
      
      
      ////////////////////////////////////////////////
       
      //body
      noStroke();
      fill(220,220,220);
      ellipse(x, y, 60* s, 120* s);
      
      //right arm base
      push();
      translate(x,y);
      rotate(2);
      
      noStroke();
      fill(255);
      rect(-50* s, -60* s, 30* s, 60* s, 15* s);
      pop();
      
      //left arm base
      push();
      translate(x,y);
      rotate(1.2);
      
      noStroke();
      fill(255);
      rect(-50* s, 0* s, 30* s, 60* s, 15* s);
      pop();
      
      //left strap
      noStroke();
      fill(128,128,128);
      rect(x - 30 * s , y - 45 * s, 20 * s, 70 * s, 15 * s);
      
      //right strap
      noStroke();
      fill(128,128,128);
      rect(x + 10 * s, y - 45 * s, 20 * s, 70 * s, 15 * s);
      
       //left arm top
       push();
       translate(x,y);
       rotate(1.5);
       
       noStroke();
       fill(0);
       rect(-35 * s, 10 * s, 30 * s, 60* s, 15* s);
       fill(255);
       rect(-35* s,30* s, 30* s, 40* s, 15* s); //used 2 rectangles to show the hand
       rect(-35* s, 30* s, 30* s, 20* s);
       pop();
       
      //right arm top
       push();
       translate(x,y);
       rotate(1.7);
       
       noStroke();
       fill(0);
       rect(-35* s,-70* s, 30* s, 60* s, 15* s);
       fill(255);
       rect(-35* s,-70* s, 30* s, 40* s, 15* s); //used 2 rectangles to show the hand
       rect(-35* s,-50* s, 30* s, 20* s);
       pop();
       
      
      //right leg
      noStroke();
      fill(255);
      rect(x + 5* s, y + 30* s, 30* s, 60* s, 15* s);
      fill(0); //used 2 rectangles to show the foot
      rect(x + 5* s, y + 60* s, 30* s, 30* s, 15* s);
      rect(x + 5* s, y + 55* s, 30* s, 20* s);
      
      //left leg 
      noStroke();
      fill(255);
      rect(x - 35* s, y + 30* s, 30* s, 60* s, 15* s);
      fill(0); //used 2 rectangles to show the foot
      rect(x - 35* s, y + 60* s, 30* s, 30* s, 15* s);
      rect(x - 35* s, y + 55* s, 30* s, 20* s);
      
      
      //head
         //head base
         stroke(0,0,0);
         strokeWeight(4);
         fill(0);
         ellipse(x, y - 80 * s, 120 * s , 90 * s);
             
         //left ear
         beginShape();
         vertex(x-60* s, y - 85* s);
         bezierVertex(x - 60 * s, y - 85 * s, x - 50 * s, y - 200 * s, x - 10 * s, y - 125 * s);
         endShape();
             
         //right ear
         beginShape();
         vertex(x+60* s, y-75* s);
         bezierVertex(x + 60 * s, y - 95 * s, x + 50 * s, y - 200 * s, x + 10 * s, y - 125 * s);
         endShape();
      
      
      
      //eyes
      
       // left eye base 
       fill(255,255,0);
       noStroke();
       ellipse(x - 25 * s, y - 80 * s, 45 * s , 45 * s);
       
       
       //left eye pupil
       fill(0,0,0);
       noStroke();
       ellipse(x - 25 * s, y - 80 * s, 20 * s , 35 * s);
      
        //right eye base 
        fill(255,255,0);
        noStroke();
        ellipse(x + 25 * s, y - 80 * s, 45 * s , 45 * s);
        
        
        //right eye pupil
        fill(0,0,0);
        noStroke();
        ellipse(x + 25 * s, y - 80 * s, 20 * s , 35 * s);
      
      
      
      
      
      
      
      //helmet
      stroke(167, 199, 231);
      strokeWeight(6*s);
      fill(70, 130, 180, 40);
      ellipse(x , y - 100 * s, 150 * s, 150 * s);
      }
      
    

function draw() {
  background(25, 25, 112);

  
  //moon at the bottom
    noStroke();
      //moon base
      fill(245,245,245);
      ellipse(400,900, 1000,1000);

      //holes
    push();
    translate(230, 470);
    rotate(2.9);
      fill(192,192,192);
      ellipse(0, 0, 90, 60);
    pop();

    push();
    translate(400, 500);
    rotate();
      fill(192,192,192);
      ellipse(0, 0, 90, 70);
    pop();

    push();
    translate(580, 480);
    rotate(0.3);
      fill(192,192,192);
      ellipse(0,0, 90, 60);
    pop();

    //stars
    star(220,300,1.2);
    star(100,450,1);
    star(650,90,1.3);
    star(750,340,1.2);
    star(80,50,0.8);
    star(560,250,1.6);
    star(250,100,0.4);
    star(720,220,0.4);
    star(50,230,0.4);
    star(310,415,0.4);
    star(510,60,0.4);

    character(x, y, 0.5);

  
    if (y > 100) {
        y = y - speed;
    }
   


  
 


}
