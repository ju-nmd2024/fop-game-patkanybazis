let speed;                // the speed of the object
let a;                    // the acceleration of the rocket (really the strength of the rocket)
let g;                    // gravitational constant (really the strength of gravity)

/**
 *
 * @type {{level: number, consumption: number}}
 */
let fuel = {};            // fuel data (level, consumption)
let fatal_v;              // the fatal landing velocity

let land_v;               // landing velocity
let score;                // final score
let highScore;            // the highest score (I got it entirely from the snake p5.js example)
let bounce;               // the degree of bouncing from the ceiling



/**
 *
 * @type {{number: number, size: {small: {min: number, max: number}, big: {min: number, max: number}}, big_probability: number, speed: {measure: number, fluctuation: number}, collection: Star[]}}
 */
let stars = {};
/**
 *
 * @type {Character}
 */
let kitty;

/**
 *
 * @type {{x: number, y: number, died: boolean}}
 */
let kittyBase = {};

/**
 *
 * @type {{ground: number, ceiling: number}}
 */
let border = {}
/**
 *
 * @type {{name: string, screens: object}}
 */
let screen = {};


function setup() {
    createCanvas(900,600);
    frameRate(30)

    border = {
        ground: height - 100,
        ceiling: 95
    }

    // I just set the game settings/behaviour up here
    // it is important to specify EVERYTHING here
    // because we call this function when the user
    // wants to reload the game to reset everything
    g = 0.15
    a = 0.1

    fuel.consumption = 0.5;
    fatal_v = 1.2;
    bounce = 10; //boink

    highScore = getItem('space kitty high score');
    if (highScore === null) {
        highScore = 0;
    }

    screen = {
        name: "menu",
        screens: {
            menu: () => {
                background_elements();
                kitty.flame = true;
                kitty.y = kittyBase.y + Math.sin(millis() / 1000 * 2) * 15;
                kitty.draw()

                push()
                fill("white")
                noStroke()
                textAlign("center", "center")
                textFont("ArcadeClassic")
                textSize(100)
                textStyle("bold")
                text("Space   Kitty", width/2, height/2 - 200)
                pop()

                push()
                fill("white")
                noStroke()
                textAlign("center", "center")
                textFont("ArcadeClassic")
                textSize(20)
                textStyle("bold")
                textAlign("center", "center")
                text("Made   by", width / 2, 385)
                pop()

                push()
                fill("white")
                noStroke()
                textAlign("center", "center")
                textFont("ArcadeClassic")
                textSize(30)
                textAlign("center", "center")
                text("Adrienn   Ratonyi", width / 2, 415)
                pop()

                push()
                fill("white")
                noStroke()
                textAlign("center", "center")
                textFont("ArcadeClassic")
                textSize(18)
                textAlign("center", "center")
                text("Jonkoping University\n2024", width / 2, 460)
                pop()

                push()
                fill("white")
                noStroke()
                textAlign("center", "center")
                textFont("ArcadeClassic")
                textSize(25)
                textAlign("center", "center")
                if (Math.floor(millis() / (1000 / 2)) % 2 === 0) {
                    text("Press   SPACE   to   play", width / 2, height/2 - 140)
                }
                pop()
            },
            game: () => {
                background_elements();
                kitty.draw();

                if (kitty.y >= border.ceiling && kitty.y < border.ground) { //if this is true, the game is on
                    if (kitty.y === border.ceiling) { // checks if the kitty is on the ceiling
                        speed = bounce*g; // if it is, then boink
                    }
                    if (keyIsDown(32)) { // if the space key is pressed, the rocket accelerates
                        if (kitty.y !== border.ceiling) speed -= a; // without the if, the speed would be (minus) *a* when kitty touches the top
                        fuel.level -= fuel.consumption; // this really just lowers the fuel level
                    } else {
                        speed += g; // the free fall formula v = g * t, but since t (the time between frames) is constant, this will work eventually (don't ask why, I'm not a physics girly)
                    }
                    kitty.y += (speed > 0 ? 1 : -1) * speed**2; // as, when we take the square of a real number, will be positive, but we want to maintain the polarity, so I multiply it by 1 if it is positive or -1 if it is negative (just type "how does distance change during free fall relative to speed?" into ChatGPT, and it will tell you why we need the square of the speed)
                } else if (kitty.y === border.ground) {
                    land_v = Math.floor(speed * 100) / 100; // eventually, this way, I get rounding with 2 decimal points
                    if (land_v <= fatal_v) {
                        score = Math.floor(fuel.level + 1000/land_v); // I wanted to take the remaining fuel into account for the score
                        kittyBase.died = false;
                    } else {
                        score = 0;
                        kittyBase.died = true;
                    }
                    highScore = max(score, highScore); // here, we see if our score or the high score is bigger...
                    storeItem('space kitty high score', highScore); // ...and we save the bigger one into the browser's storage
                    screen.name = "gameOver";
                }
                // in case kitty goes over the top or below the ground, we need to correct it by pulling it back
                if (kitty.y < border.ceiling) {
                    kitty.y = border.ceiling;
                } else if (kitty.y > border.ground) {
                    kitty.y = border.ground;
                }
            },
            gameOver: () => {
                background_elements();
                kitty.draw();

                push()
                fill("white")
                textFont("ArcadeClassic")
                textSize(50)
                textStyle("bold")
                textAlign("center", "center")
                text("Game Over", width / 2, 150)
                pop()

                if (kittyBase.died) {
                    push()
                    fill("white")
                    textFont("ArcadeClassic")
                    textSize(35)
                    // textStyle("bold")
                    textAlign("center", "center")
                    text("Kitty didn't survive\nthe landing 😭", width / 2, 225)
                    pop()
                } else {
                    push()
                    fill("white")
                    textFont("ArcadeClassic")
                    textSize(35)
                    textStyle("bold")
                    textAlign("center", "center")
                    text("Score", width / 2, 225)
                    pop()

                    push()
                    fill("white")
                    textFont("ArcadeClassic")
                    textSize(25)
                    textAlign("center", "center")
                    text(score, width / 2, 255)
                    pop()

                    push()
                    fill("white")
                    textFont("ArcadeClassic")
                    textSize(25)
                    textStyle("bold")
                    textAlign("center", "center")
                    text("High Score", width / 2, 300)
                    pop()
                }
            }
        }
    }

    stars = {
        number: 300,
        size: {
            small: {
                min: 1,
                max: 4
            },
            big: {
                min: 6,
                max: 10
            }
        },
        big_probability: 150, // 1 in 150 stars will be big
        speed: {
            measure: 1.5,      // how fast the stars appear and disappear
            fluctuation: 0.5  // how faster the speed can be (to make the animation more dynamic)
        },
        collection: []  // the collection of stars
    }

    kittyBase = {
        x: width/2,
        y: (border.ground + border.ceiling) / 2,
        died: null
    }

    resetSettings()

    for (let i = 0; i < stars.number; i++) {
        let star_options = Star.generate(true);
        stars.collection.push(new Star(star_options.x, star_options.y, star_options.size, star_options.alpha, star_options.speed));
    }
}

function resetSettings() {
    kitty = new Character(kittyBase.x, kittyBase.y, 0.35, "normal", "normal");
}



function draw() {
    screen.screens[screen.name]();
}


function background_elements() {
    background(25, 25, 112);
    Star.display();
    moon();

    function moon() {
        noStroke();
        //moon base
        fill(245,245,245);
        ellipse(width / 2, height + 400, 1000, 1000);

        //holes
        push();
        translate(width / 2 - 170, height - 30);
        rotate(2.9);
        fill(192,192,192);
        ellipse(0, 0, 90, 60);
        pop();

        push();
        translate(width / 2, height);
        rotate();
        fill(192,192,192);
        ellipse(0, 0, 90, 70);
        pop();

        push();
        translate(width / 2 + 180, height - 20);
        rotate(0.3);
        fill(192,192,192);
        ellipse(0,0, 90, 60);
        pop();



    }
}

// here, I handle the key-presses
// since every key is for different things
// in different modes/screens, I need to
// specify which key does what in which screen
function keyPressed() {
    switch (keyCode) {
        case 32: // SPACE
            switch (screen.name) {
                // like in the menu, if I press SPACE, it will change the screen to "game"
                case "menu":
                    screen.name = "game";
                    break;
            }
            break;
        case 82: // R
            switch (screen.name) {
                case "gameOver":
                    screen.name = "game"
                    resetSettings() // as we know, it resets the values
                    break;
                case "game":
                    resetSettings()
                    break;
            }
            break;
        case 77: // M
            switch (screen.name) {
                case "gameOver":
                case "game":
                    screen.name = "menu"
                    resetSettings()
                    break;
            }
            break;
    }
}

/**
 *
 * @param min
 * @param max
 * @param whole
 * @returns {*|number}
 */
function randomRange(min, max, whole = false) {
    const random_number = Math.random() * (max - min) + min;
    if (whole) {
        return Math.floor(random_number);
    } else {
        return random_number;
    }
}

class Star {
    constructor (x, y, size, alpha, speed) {
        this.x = x;
        this.y = y;
        this.size = size *= 0.05 // the star is just too big now, that's why I reduce it (by default);
        this.alpha = alpha;
        this.speed = speed;
    }


    draw() {
        push()
        noStroke();
        triangle(this.x , this.y  , this.x + 5 * this.size, this.y - 20*this.size, this.x + 10*this.size , this.y );
        triangle(this.x, this.y , this.x + 5* this.size, this.y + 20* this.size, this.x + 10* this.size , this.y );
        triangle(this.x + 5 * this.size, this.y - 5 * this.size, this.x - 10 * this.size, this.y , this.x + 5 * this.size, this.y + 5 * this.size );
        triangle(this.x + 5 * this.size, this.y - 5 * this.size, this.x + 20 * this.size, this.y , this.x + 5 * this.size, this.y + 5 * this.size );
        pop()
    }

    /**
     * Generates the settings for a star
     * @param base
     * @returns {{size: (*|number), alpha: (number|number), x: (*|number), y: (*|number), speed: *}}
     */
    static generate(base = false) {
        return {
            x: randomRange(0, width, true),
            y: randomRange(0, height, true),
            alpha: base ? randomRange(0, 180 * 100, true) / 100 : 0,
            size: randomRange(0, stars.big_probability, true) === 0 ? randomRange(stars.size.big.min, stars.size.big.max) : randomRange(stars.size.small.min, stars.size.small.max),
            speed: stars.speed.measure + randomRange(0, stars.speed.fluctuation)
        }
    }

    static display() {
        for (let i = 0; i < stars.number; i++) {
            if (Math.round(stars.collection[i].alpha) >= 180) { // as the sine of a degree is positive between 0 and 180, we reset it when it reaches 180 (note: the rounding is because sometimes the results are a bit off for no reason)
                let star_options = Star.generate();
                stars.collection[i] = new Star(star_options.x, star_options.y, star_options.size, star_options.alpha, star_options.speed);
            } else {
                stars.collection[i].alpha += stars.collection[i].speed;
            }
            push()
            noStroke()
            fill(255, 255, 255, Math.sin(stars.collection[i].alpha * Math.PI/180) * 255) // here, we have to convert degrees to radians...
            stars.collection[i].draw();
            pop()
            // console.log(`x: ${stars.collection[1].x}, y: ${stars.collection[1].y}, size: ${stars.collection[1].size}, alpha: ${stars.collection[1].alpha}, speed: ${stars.collection[1].speed}`)
        }

    }



}

class Character {
    constructor(x, y, size, arm, eye, flame = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.arm = arm;
        this.eye = eye;
        this.flame = flame;
    }

    draw () {
        push()
        translate(0, -32)

        // jetpack bag
        noStroke();
        fill(105,105,105);
        rect(this.x - 45 * this.size , this.y - 50 * this.size, 90 * this.size, 100 * this.size, 10 * this.size);

        //left mini rocket
        noStroke();
        fill(128,128,128);
        rect(this.x - 85 * this.size , this.y - 50 * this.size, 40 * this.size, 100 * this.size, 0, 0,10 * this.size, 10 * this.size);

        fill(255,0,0);
        triangle(this.x - 85 * this.size, this.y - 43 * this.size, this.x - 65 * this.size, this.y - 90 * this.size, this.x - 45 * this.size,this.y - 43 * this.size);
        rect(this.x - 85 * this.size, this.y, 40 * this.size , 10 * this.size ); //didn'T work  (y) * s removed for moving
        rect(this.x - 85 * this.size, this.y + 20 * this.size, 40 * this.size, 10 * this.size );


        //right mini rocket
        noStroke();
        fill(128,128,128);
        rect(this.x + 45 * this.size, this.y - 50 * this.size, 40 * this.size, 100 * this.size, 0, 0,10 * this.size, 10 * this.size);

        fill(255,0,0);
        triangle(this.x + 85 * this.size, this.y - 43 * this.size, this.x + 65 * this.size, this.y - 90 * this.size, this.x + 45 * this.size,this.y - 43 * this.size);
        rect(this.x + 45 * this.size, this.y, 40 * this.size, 10 * this.size );
        rect(this.x + 45 * this.size, this.y + 20 * this.size, 40 * this.size, 10 * this.size );

        //tail
        fill(34,34,34);
        noStroke();
        ellipse(this.x + 30 * this.size, this.y + 70 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 40 * this.size, this.y + 90 * this.size, 25 * this.size, 25 * this.size);
        ellipse(this.x + 55 * this.size, this.y + 70 * this.size, 35 * this.size, 35  * this.size);
        ellipse(this.x + 60 * this.size, this.y + 95 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 78 * this.size, this.y + 78 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 80 * this.size, this.y + 100 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 100 * this.size, this.y + 80 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 100 * this.size, this.y + 100 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 120 * this.size, this.y + 70 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 125 * this.size, this.y + 95 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 135 * this.size, this.y + 60 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 145 * this.size, this.y + 70* this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 145 * this.size, this.y + 85 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 150 * this.size, this.y + 53 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 158 * this.size, this.y + 68 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 164 * this.size, this.y + 52 * this.size, 20 * this.size, 20 * this.size);




        ////////////////////////////////////////////////

        //body
        noStroke();
        fill(220,220,220);
        ellipse(this.x, this.y, 60* this.size, 120* this.size);

        switch (this.arm) {
            case "normal":
                break;
            case "happy":
                break;
            case "dead":
                break;
        }

        //right arm base
        push();
        translate(this.x,this.y);
        rotate(2);

        noStroke();
        fill(255);
        rect(-50* this.size, -60* this.size, 30* this.size, 60* this.size, 15* this.size);
        pop();

        //left arm base
        push();
        translate(this.x,this.y);
        rotate(1.2);

        noStroke();
        fill(255);
        rect(-50* this.size, 0* this.size, 30* this.size, 60* this.size, 15* this.size);
        pop();

        //left strap
        noStroke();
        fill(128,128,128);
        rect(this.x - 30 * this.size , this.y - 45 * this.size, 20 * this.size, 70 * this.size, 15 * this.size);

        //right strap
        noStroke();
        fill(128,128,128);
        rect(this.x + 10 * this.size, this.y - 45 * this.size, 20 * this.size, 70 * this.size, 15 * this.size);

        //left arm top
        push();
        translate(this.x,this.y);
        rotate(1.5);

        noStroke();
        fill(0);
        rect(-35 * this.size, 10 * this.size, 30 * this.size, 60* this.size, 15* this.size);
        fill(255);
        rect(-35* this.size,30* this.size, 30* this.size, 40* this.size, 15* this.size); //used 2 rectangles to show the hand
        rect(-35* this.size, 30* this.size, 30* this.size, 20* this.size);
        pop();

        //right arm top
        push();
        translate(this.x,this.y);
        rotate(1.7);

        noStroke();
        fill(0);
        rect(-35* this.size,-70* this.size, 30* this.size, 60* this.size, 15* this.size);
        fill(255);
        rect(-35* this.size,-70* this.size, 30* this.size, 40* this.size, 15* this.size); //used 2 rectangles to show the hand
        rect(-35* this.size,-50* this.size, 30* this.size, 20* this.size);
        pop();


        //right leg
        noStroke();
        fill(255);
        rect(this.x + 5* this.size, this.y + 30* this.size, 30* this.size, 60* this.size, 15* this.size);
        fill(0); //used 2 rectangles to show the foot
        rect(this.x + 5* this.size, this.y + 60* this.size, 30* this.size, 30* this.size, 15* this.size);
        rect(this.x + 5* this.size, this.y + 55* this.size, 30* this.size, 20* this.size);

        //left leg
        noStroke();
        fill(255);
        rect(this.x - 35* this.size, this.y + 30* this.size, 30* this.size, 60* this.size, 15* this.size);
        fill(0); //used 2 rectangles to show the foot
        rect(this.x - 35* this.size, this.y + 60* this.size, 30* this.size, 30* this.size, 15* this.size);
        rect(this.x - 35* this.size, this.y + 55* this.size, 30* this.size, 20* this.size);


        //head
        //head base
        stroke(0,0,0);
        strokeWeight(4);
        fill(0);
        ellipse(this.x, this.y - 80 * this.size, 120 * this.size , 90 * this.size);

        //left ear
        beginShape();
        vertex(this.x-60* this.size, this.y - 85* this.size);
        bezierVertex(this.x - 60 * this.size, this.y - 85 * this.size, this.x - 50 * this.size, this.y - 200 * this.size, this.x - 10 * this.size, this.y - 125 * this.size);
        endShape();

        //right ear
        beginShape();
        vertex(this.x+60* this.size, this.y-75* this.size);
        bezierVertex(this.x + 60 * this.size, this.y - 95 * this.size, this.x + 50 * this.size, this.y - 200 * this.size, this.x + 10 * this.size, this.y - 125 * this.size);
        endShape();



        //eyes

        switch (this.eye) {
            case "normal":
                break;
            case "happy":
                break;
            case "dead":
                break;
        }

        // left eye base
        fill(255,255,0);
        noStroke();
        ellipse(this.x - 25 * this.size, this.y - 80 * this.size, 45 * this.size , 45 * this.size);


        //left eye pupil
        fill(0,0,0);
        noStroke();
        ellipse(this.x - 25 * this.size, this.y - 80 * this.size, 20 * this.size , 35 * this.size);

        //right eye base
        fill(255,255,0);
        noStroke();
        ellipse(this.x + 25 * this.size, this.y - 80 * this.size, 45 * this.size , 45 * this.size);


        //right eye pupil
        fill(0,0,0);
        noStroke();
        ellipse(this.x + 25 * this.size, this.y - 80 * this.size, 20 * this.size , 35 * this.size);







        //helmet
        stroke(167, 199, 231);
        strokeWeight(6*this.size);
        fill(70, 130, 180, 40);
        ellipse(this.x , this.y - 100 * this.size, 150 * this.size, 150 * this.size);

        //flame
        if (this.flame) {
            push()
            noStroke()
            fill("orange")
            triangle(this.x - 77 * this.size,this.y + 48 * this.size,this.x - 53 * this.size,this.y + 48 * this.size,this.x - 65 * this.size,this.y + 85 * this.size)
            triangle(this.x + 53 * this.size,this.y + 48 * this.size,this.x + 77 * this.size,this.y + 48 * this.size,this.x + 65 * this.size,this.y + 85 * this.size)
            pop()
        }

        pop()
    }
}


