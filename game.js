/**
 *
 * @type {{size: {width: number, height: number}}}
 */
let canvas = {};
/**
 * the speed of the object
 * @type {number}
 */
let speed;

/**
 * the acceleration of the rocket (really the strength of the rocket)
 * @type {number}
 */
let a;

/**
 * gravitational constant (really the strength of gravity)
 * @type {number}
 */
let g;

/**
 * the fuel data (level, consumption)
 * @type {{level: number, consumption: number}}
 */
let fuel = {};

/**
 * the fatal landing velocity
 * @type {number}
 */
let fatal_v;

/**
 * the landing velocity
 * @type {number}
 */
let land_v;

/**
 * final score
 * @type {number}
 */
let score;

/**
 * the highest score (I got it entirely from the snake p5.js example)
 * @type {number}
 */
let highScore;

/**
 * the degree of bouncing from the ceiling
 * @type {number}
 */
let bounce;

/**
 * the two bars in the corners
 * @type {{fuel: Bar, speed: Bar}}
 */
let bars = {};

/**
 *  the stars in the background
 * @type {{number: number, size: {small: {min: number, max: number}, big: {min: number, max: number}}, big_probability: number, speed: {measure: number, fluctuation: number}, collection: Star[]}}
 */
let stars = {};

/**
 *  the character of my game
 * @type {Character}
 */
let kitty;

/**
 * the base settings of kitty
 * @type {{x: number, y: number, died: boolean}}
 */
let kittyBase = {};

/**
 *  the borders of the canvas
 * @type {{ground: number, ceiling: number}}
 */
let border = {};

/**
 *  the different screens of the game
 * @type {{name: string, screens: object}}
 */
let screen = {};

function setup() {
    canvas = {
        size: {
            width: 900,
            height: 600
        }
    };

    createCanvas(windowWidth, windowHeight);
    frameRate(30); // the plugin uses 30 fps, p5.js editor uses 60, but I want my fps to be stable everywhere

    border = {
        ground: canvas.size.height - 100,
        ceiling: 95
    };

    // initialising values
    g = 0.15;
    a = 0.1;

    fuel.consumption = 0.5;
    fatal_v = 1.2; //if it is over the value then kitty dies :(
    bounce = 10; //boink

    highScore = getItem('space kitty high score'); //gets the highscore from the browser's storage


    screen.name = "menu"; //sets the default screen to menu

    stars = {
        number: 400,
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
            measure: 1.5,
            fluctuation: 0.5
        },
        collection: []  // the collection of stars
    };
    // the values kitty resets to
    kittyBase = {
        x: canvas.size.width / 2,
        y: (border.ground + border.ceiling) / 2,
        died: null
    };
    // here, I generate the bars
    bars = {
        fuel: new Bar("Fuel", 25, 40, "rainbow_gr", 100, 1, [5, 10, 25, 50, 75]),
        speed: new Bar("Speed", canvas.size.width - 225, 40, "rainbow_rg", 60, 1, [fatal_v * 10, 30]) // fatal_v helps indicate the point in speed that is still safe for landing, and we need absolute values for speed as it can be negative in this project
    };

    resetSettings();
    setGameScreens();


    // generating the first stars
    for (let i = 0; i < stars.number; i++) {
        stars.collection.push(new Star().generate(true));
    }

}

/**
 * Resets the base values of the game to prepare for the start of a new game
 */
function resetSettings() {
    kitty = new Character(kittyBase.x, kittyBase.y, 0.35, "normal");
    fuel.level = 100; //100=full tank
    speed = -2; //initial speed, kitty bounces up a bit at the start of the game

}

/**
 * Blinking display of elements
 * @param milliseconds {number} the time between cycles in milliseconds
 * @param every {number} in every what cycle the function is executed
 * @param todo {function} the function to be executed
 */
function blink(milliseconds, every, todo) {
    if (Math.floor(millis() / milliseconds) % every === 0) {
        todo();
    }
}

function draw() {
    background_elements();
    translate(((windowWidth - canvas.size.width) / 2), 0); // to centre the canvas
    push();
    // console.log(`${((windowWidth - canvas.size.width) / 2)}\n${windowWidth}\n${canvas.size.width}`)
    translate(canvas.size.width / 2, 0); // to scale from the centre (idk why it doesn't need the y)
    scale(windowHeight / canvas.size.height);
    translate(-canvas.size.width / 2, 0); // reverting the translation for the "scaling"
    screen.screens[screen.name]();
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

/**
 * Sets the screens of the game
 */
function setGameScreens() {
    screen.screens = {
        menu: () => { //another way to declare a function
            kitty.flame = true; // as kitty is flying in the menu, the flame has to be on
            kitty.y = kittyBase.y + Math.sin(millis() / 1000 * 2) * 15; // this gives kitty that up and down motion
            kitty.draw();
            moon();

            // title
            push();
            fill("white");
            noStroke();
            textAlign("center", "center");
            textFont("ArcadeClassic");
            textSize(100);
            textStyle("bold");
            text("Space   Kitty", canvas.size.width / 2, canvas.size.height / 2 - 200);
            pop();

            // made by
            push();
            fill("white");
            noStroke();
            textAlign("center", "center");
            textFont("ArcadeClassic");
            textSize(20);
            textStyle("bold");
            textAlign("center", "center");
            text("Made   by", canvas.size.width / 2, 385);
            pop();

            //author/creator
            push();
            fill("white");
            noStroke();
            textAlign("center", "center");
            textFont("ArcadeClassic");
            textSize(30);
            textAlign("center", "center");
            text("Adrienn   Ratonyi", canvas.size.width / 2, 415);
            pop();

            // place and year
            push();
            fill("white");
            noStroke();
            textAlign("center", "center");
            textFont("ArcadeClassic");
            textSize(18);
            textAlign("center", "center");
            text("Jonkoping   University\n2024", canvas.size.width / 2, 460);
            pop();

            // instruction
            push();
            fill("white");
            noStroke();
            textAlign("center", "center");
            textFont("ArcadeClassic");
            textSize(25);
            textAlign("center", "center");
            blink(500, 2, () => {
                text("Press   SPACE   to   play", canvas.size.width / 2, canvas.size.height / 2 - 140);
            });
            pop();
        },
        game: () => {
            dialDisplays();
            kitty.flame = keyIsDown(32) && fuel.level > 0;
            kitty.draw();
            moon();


            if (kitty.y >= border.ceiling && kitty.y < border.ground) {
                if (kitty.y === border.ceiling) {
                    speed = bounce * g;
                }

                if (keyIsDown(32) && fuel.level > 0) {
                    if (kitty.y !== border.ceiling) speed -= a; // without the if, the speed would be (minus) *a* when kitty touches the top (which is a problem when bounce is set to 0, as than the speed would be -a if the rocket is on)
                    fuel.level -= fuel.consumption;
                } else {
                    speed += g; // the free fall formula v = g * t, but since t (or delta t) (the time between frames) is constant, changing this every frame will replace it (don't ask why, I'm not a physics girly)
                }

                if (speed > 0) {
                    kitty.y += speed ** 2; // as, when we take the square of a real number, it will be positive, but we want to maintain the polarity of the value, so I increase the position if it is positive and decrease the position if it is negative (just type "how does distance change during free fall relative to speed?" into ChatGPT, and it will tell you why we need the square of the speed, but it's because d=v^2/2g, but since g is constant, we don't bother with it)
                } else {
                    kitty.y -= speed ** 2;
                }
            } else if (kitty.y === border.ground) {
                land_v = Math.floor(speed * 100) / 100;
                if (land_v <= fatal_v) {
                    score = Math.floor((fuel.level + 1000 / land_v));
                    kittyBase.died = false;
                } else {
                    score = 0;
                    kittyBase.died = true;
                }
                highScore = max(score, highScore);
                storeItem('space kitty high score', highScore);
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
            dialDisplays();
            kitty.flame = false; // when kitty has landed, the rocket is no longer on obviously
            kitty.draw();
            moon();

            // instruction
            push();
            fill("white");
            noStroke();
            textAlign("center", "center");
            textFont("ArcadeClassic");
            textSize(25);
            textAlign("center", "center");
            blink(500, 2, () => {
                text("Press   R   to   restart", canvas.size.width / 2, canvas.size.height / 2 - 247);
            });
            pop();

            // screen title
            push();
            fill("white");
            textFont("ArcadeClassic");
            textSize(50);
            textStyle("bold");
            textAlign("center", "center");
            text("Game   Over", canvas.size.width / 2, 150);
            pop();

            if (kittyBase.died) {
                kitty.state = "dead";
                push();
                fill("white");
                textFont("ArcadeClassic");
                textSize(35);

                textAlign("center", "center");
                text("Kitty   didn't   survive\nthe   landing", canvas.size.width / 2, 225);
                pop();
            } else {

                kitty.state = "happy";

                // score title
                push();
                fill("white");
                textFont("ArcadeClassic");
                textSize(35);
                textStyle("bold");
                textAlign("center", "center");
                text("Score", canvas.size.width / 2, 225);
                pop();

                //score
                push();
                fill("white");
                textFont("ArcadeClassic");
                textSize(25);
                textAlign("center", "center");
                text(score, canvas.size.width / 2, 255);
                pop();

                // high score title
                push();
                fill("white");
                textFont("ArcadeClassic");
                textSize(25);
                textStyle("bold");
                textAlign("center", "center");
                text("High   Score", canvas.size.width / 2, 300);
                pop();

                // high score
                push();
                fill("white");
                textFont("ArcadeClassic");
                textSize(20);
                textAlign("center", "center");
                text(highScore, canvas.size.width / 2, 330);
                pop();
            }
        }
    }
}

/**
 * Displaying the elements of the background
 */
function background_elements() {
    background(25, 25, 112);
    Star.display();
}

/**
 * The moon in the background
 */
function moon() {
    noStroke();
    //moon base
    fill(245, 245, 245);
    ellipse(canvas.size.width / 2, canvas.size.height + 400, 1000, 1000);

    //holes
    push();
    translate(canvas.size.width / 2 - 170, canvas.size.height - 30);
    rotate(2.9);
    fill(192, 192, 192);
    ellipse(0, 0, 90, 60);
    pop();

    push();
    translate(canvas.size.width / 2, canvas.size.height);
    rotate();
    fill(192, 192, 192);
    ellipse(0, 0, 90, 70);
    pop();

    push();
    translate(canvas.size.width / 2 + 180, canvas.size.height - 20);
    rotate(0.3);
    fill(192, 192, 192);
    ellipse(0, 0, 90, 60);
    pop();


}


// specify which key does what in which screen
function keyPressed() {
    switch (keyCode) {
        case 32: // SPACE
            switch (screen.name) {
                case "menu":
                    resetSettings();
                    screen.name = "game";
                    break;
            }
            break;
        case 82: // R
            switch (screen.name) {
                case "gameOver":
                    screen.name = "game";
                    resetSettings();
                    break;
                case "game":
                    resetSettings();
                    break;
            }
            break;
        case 27: // ESCAPE
            switch (screen.name) {
                case "gameOver":
                case "game":
                    screen.name = "menu";
                    resetSettings();
                    break;
            }
            break;
    }
}

/**
 * Displays the fuel and speed bars
 */
function dialDisplays() {
    bars.fuel.set(fuel.level);
    bars.speed.set(Math.abs(speed * 10));
    bars.fuel.draw();
    bars.speed.draw();
}


/**
 * Generates a random (whole) number between two values
 * @param min {number} the lower limit
 * @param max {number} the upper limit
 * @param whole {boolean} whether the number should be a whole number or not
 * @returns {number} the random number
 */
function randomRange(min, max, whole = false) {
    const random_number = Math.random() * (max - min) + min;
    if (whole) {
        return Math.floor(random_number);
    } else {
        return random_number;
    }
}

/**
 * Star for the background
 * @class
 * @property {number} x - x position
 * @property {number} y - y position
 * @property {number} size - size of the star
 * @property {number} alpha - colour alpha
 * @property {number} speed - speed of ageing
 */
class Star {
    x;
    y;
    size;
    alpha;
    speed;

    constructor(x, y, size, alpha, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.alpha = alpha;
        this.speed = speed;
    }

    /**
     * Generates the settings for a star
     * @param base {boolean} whether the star is a base star or not
     * @returns {Star} the star with the generated settings
     */
    generate(base = false) {

        this.x = Math.random();
        this.y = Math.random();
        this.alpha = base ? randomRange(0, 180 * 100, true) / 100 : 0;
        this.size = randomRange(0, stars.big_probability, true) === 0 ? randomRange(stars.size.big.min, stars.size.big.max) : randomRange(stars.size.small.min, stars.size.small.max);
        this.speed = stars.speed.measure + randomRange(0, stars.speed.fluctuation);
        return this;

    }

    /**
     * Displays all the stars
     */
    static display() {
        for (let i = 0; i < stars.number; i++) {
            if (Math.round(stars.collection[i].alpha) >= 180) { //the rounding is there because sometimes the results are a bit off for no reason
                stars.collection[i] = new Star().generate(); //replacing dead star
            } else {
                stars.collection[i].alpha += stars.collection[i].speed;
            }
            push();
            noStroke();
            fill(255, 255, 255, Math.sin(stars.collection[i].alpha * Math.PI / 180) * 255); //converting to radians
            stars.collection[i].draw();
            pop();
        }
    }

    /**
     * Draws the star
     */
    draw(x = this.x * width, y = this.y * height, size = this.size * (height / canvas.size.height)) { // note: I specify the width and height because of the fullscreen support

        push();
        noStroke();
        triangle(x, y, x + 0.25 * size, y - 1 * size, x + 0.5 * size, y);
        triangle(x, y, x + 0.25 * size, y + 1 * size, x + 0.5 * size, y);
        triangle(x + 0.25 * size, y - 0.25 * size, x - 0.5 * size, y, x + 0.25 * size, y + 0.25 * size);
        triangle(x + 0.25 * size, y - 0.25 * size, x + 1 * size, y, x + 0.25 * size, y + 0.25 * size);
        pop();

        return this;
    }
}

/**
 * The kitty character
 * @Class
 * @property {number} x - x position
 * @property {number} y - y position
 * @property {number} size - size of the character
 * @property {"normal" | "dead" | "happy"} state - the state of the character (normal, happy, dead)
 * @property {boolean} flame - whether the flame of the rocket is on or off
 */
class Character {
    x;
    y;
    size;
    state;
    flame;

    constructor(x, y, size, state, flame = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.state = state;
        this.flame = flame;
    }

    /**
     * Draws the character
     */
    draw() {
        push();
        translate(0, -32);

        // jetpack bag
        noStroke();
        fill(105, 105, 105);
        rect(this.x - 45 * this.size, this.y - 50 * this.size, 90 * this.size, 100 * this.size, 10 * this.size);

        //left mini rocket
        noStroke();
        fill(128, 128, 128);
        rect(this.x - 85 * this.size, this.y - 50 * this.size, 40 * this.size, 100 * this.size, 0, 0, 10 * this.size, 10 * this.size);

        fill(255, 0, 0);
        triangle(this.x - 85 * this.size, this.y - 43 * this.size, this.x - 65 * this.size, this.y - 90 * this.size, this.x - 45 * this.size, this.y - 43 * this.size);
        rect(this.x - 85 * this.size, this.y, 40 * this.size, 10 * this.size); //didn'T work  (y) * s removed for moving
        rect(this.x - 85 * this.size, this.y + 20 * this.size, 40 * this.size, 10 * this.size);


        //right mini rocket
        noStroke();
        fill(128, 128, 128);
        rect(this.x + 45 * this.size, this.y - 50 * this.size, 40 * this.size, 100 * this.size, 0, 0, 10 * this.size, 10 * this.size);

        fill(255, 0, 0);
        triangle(this.x + 85 * this.size, this.y - 43 * this.size, this.x + 65 * this.size, this.y - 90 * this.size, this.x + 45 * this.size, this.y - 43 * this.size);
        rect(this.x + 45 * this.size, this.y, 40 * this.size, 10 * this.size);
        rect(this.x + 45 * this.size, this.y + 20 * this.size, 40 * this.size, 10 * this.size);


        //tail
        fill(34, 34, 34);
        noStroke();
        ellipse(this.x + 30 * this.size, this.y + 70 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 40 * this.size, this.y + 90 * this.size, 25 * this.size, 25 * this.size);
        ellipse(this.x + 55 * this.size, this.y + 70 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 60 * this.size, this.y + 95 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 78 * this.size, this.y + 78 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 80 * this.size, this.y + 100 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 100 * this.size, this.y + 80 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 100 * this.size, this.y + 100 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 120 * this.size, this.y + 70 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 125 * this.size, this.y + 95 * this.size, 35 * this.size, 35 * this.size);
        ellipse(this.x + 135 * this.size, this.y + 60 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 145 * this.size, this.y + 70 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 145 * this.size, this.y + 85 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 150 * this.size, this.y + 53 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 158 * this.size, this.y + 68 * this.size, 30 * this.size, 30 * this.size);
        ellipse(this.x + 164 * this.size, this.y + 52 * this.size, 20 * this.size, 20 * this.size);

        //flame
        if (this.flame) {
            push();
            noStroke();
            fill("orange");
            triangle(this.x - 77 * this.size, this.y + 48 * this.size, this.x - 53 * this.size, this.y + 48 * this.size, this.x - 65 * this.size, this.y + 85 * this.size);
            triangle(this.x + 53 * this.size, this.y + 48 * this.size, this.x + 77 * this.size, this.y + 48 * this.size, this.x + 65 * this.size, this.y + 85 * this.size);
            pop();
        }


        ////////////////////////////////////////////////

        //body
        noStroke();
        fill(220, 220, 220);
        ellipse(this.x, this.y, 60 * this.size, 120 * this.size);

        switch (this.state) {
            case "normal":
                //right arm base
                push();
                translate(this.x, this.y);
                rotate(2);

                noStroke();
                fill(255);
                rect(-50 * this.size, -60 * this.size, 30 * this.size, 60 * this.size, 15 * this.size);
                pop();

                //left arm base
                push();
                translate(this.x, this.y);
                rotate(1.2);

                noStroke();
                fill(255);
                rect(-50 * this.size, 0 * this.size, 30 * this.size, 60 * this.size, 15 * this.size);
                pop();

                straps(this.x, this.y, this.size);

                //left arm top
                push();
                translate(this.x, this.y);
                rotate(1.5);

                noStroke();
                fill(0);
                rect(-35 * this.size, 10 * this.size, 30 * this.size, 60 * this.size, 15 * this.size);
                fill(255);
                rect(-35 * this.size, 30 * this.size, 30 * this.size, 40 * this.size, 15 * this.size); //used 2 rectangles to show the hand
                rect(-35 * this.size, 30 * this.size, 30 * this.size, 20 * this.size);
                pop();

                //right arm top
                push();
                translate(this.x, this.y);
                rotate(1.7);

                noStroke();
                fill(0);
                rect(-35 * this.size, -70 * this.size, 30 * this.size, 60 * this.size, 15 * this.size);
                fill(255);
                rect(-35 * this.size, -70 * this.size, 30 * this.size, 40 * this.size, 15 * this.size); //used 2 rectangles to show the hand
                rect(-35 * this.size, -50 * this.size, 30 * this.size, 20 * this.size);
                pop();

                break;
            case "happy":
                straightArm(this.x - 12.5, this.y + 2.5, this.size, 135 * Math.PI / 180);
                straightArm(this.x + 2.5, this.y - 7.5, this.size, 225 * Math.PI / 180);
                straps(this.x, this.y, this.size);
                break;
            case "dead":
                straightArm(this.x - 2.5, this.y - 15, this.size, 15 * Math.PI / 180);
                straightArm(this.x + 16, this.y - 18.5, this.size, 345 * Math.PI / 180);
                straps(this.x, this.y, this.size);
                break;
        }

        function straightArm(x, y, size, rotation = 0) {
            push();
            translate(x, y);
            push();
            rotate(rotation);
            noStroke();
            fill(0);
            rect(-35 * size, 0 * size, 30 * size, 90 * size, 15 * size);
            fill(255);
            rect(-35 * size, 0 * size, 30 * size, 70 * size, 15 * size); //used 2 rectangles to show the hand
            rect(-35 * size, 50 * size, 30 * size, 20 * size);
            pop();
            pop();

        }


        function straps(x, y, size) {
            //left strap
            noStroke();
            fill(128, 128, 128);
            rect(x - 30 * size, y - 45 * size, 20 * size, 70 * size, 15 * size);

            //right strap
            noStroke();
            fill(128, 128, 128);
            rect(x + 10 * size, y - 45 * size, 20 * size, 70 * size, 15 * size);

        }


        //right leg
        noStroke();
        fill(255);
        rect(this.x + 5 * this.size, this.y + 30 * this.size, 30 * this.size, 60 * this.size, 15 * this.size);
        fill(0); //used 2 rectangles to show the foot
        rect(this.x + 5 * this.size, this.y + 60 * this.size, 30 * this.size, 30 * this.size, 15 * this.size);
        rect(this.x + 5 * this.size, this.y + 55 * this.size, 30 * this.size, 20 * this.size);

        //left leg
        noStroke();
        fill(255);
        rect(this.x - 35 * this.size, this.y + 30 * this.size, 30 * this.size, 60 * this.size, 15 * this.size);
        fill(0); //used 2 rectangles to show the foot
        rect(this.x - 35 * this.size, this.y + 60 * this.size, 30 * this.size, 30 * this.size, 15 * this.size);
        rect(this.x - 35 * this.size, this.y + 55 * this.size, 30 * this.size, 20 * this.size);


        //head

        //head base
        stroke(0, 0, 0);
        strokeWeight(4);
        fill(0);
        ellipse(this.x, this.y - 80 * this.size, 120 * this.size, 90 * this.size);

        //left ear
        beginShape();
        vertex(this.x - 60 * this.size, this.y - 85 * this.size);
        bezierVertex(this.x - 60 * this.size, this.y - 85 * this.size, this.x - 50 * this.size, this.y - 200 * this.size, this.x - 10 * this.size, this.y - 125 * this.size);
        endShape();

        //right ear
        beginShape();
        vertex(this.x + 60 * this.size, this.y - 75 * this.size);
        bezierVertex(this.x + 60 * this.size, this.y - 95 * this.size, this.x + 50 * this.size, this.y - 200 * this.size, this.x + 10 * this.size, this.y - 125 * this.size);
        endShape();


        //eyes

        switch (this.state) {
            case "normal":

                normalEye(this.x - 9, this.y - 28, this.size);
                normalEye(this.x + 9, this.y - 28, this.size);


            function normalEye(x, y, size) {
                push();
                translate(x, y);
                //eye base
                push();
                fill(255, 255, 0);
                noStroke();
                ellipse(0 * size, 0 * size, 45 * size, 45 * size);
                pop();
                push();
                //eye pupil
                fill(0, 0, 0);
                noStroke();
                ellipse(0 * size, 0 * size, 20 * size, 35 * size);
                pop();
                pop();
            }

                break;
            case "happy":
                happyEye(this.x - 9, this.y - 28, this.size);
                happyEye(this.x + 9, this.y - 28, this.size);

            function happyEye(x, y, size) {
                push();
                stroke(255, 255, 0);
                strokeWeight(4)
                beginShape();
                vertex(x - 12.5 * size, y);
                bezierVertex(x - 12.5 * size, y, x, y - 25 * size, x + 12.5 * size, y);
                endShape();
                pop();
            }

                break;
            case "dead":
                deadEye(this.x - 9, this.y - 30, this.size); // left eye
                deadEye(this.x + 9, this.y - 30, this.size); // right eye

            function deadEye(x, y, size) {
                push();
                translate(x, y);
                rotate(45 * Math.PI / 180);
                push();
                noStroke();
                fill(255, 255, 0);
                rect(-15 * size, 0 * size, 40 * size, 10 * size, 6);
                pop();
                push();
                noStroke();
                fill(255, 255, 0);
                rect(0 * size, -15 * size, 10 * size, 40 * size, 6);
                pop();
                pop();
            }

                break;
        }

        //helmet
        stroke(167, 199, 231);
        strokeWeight(6 * this.size);
        fill(70, 130, 180, 40);
        ellipse(this.x, this.y - 100 * this.size, 150 * this.size, 150 * this.size);

        pop();

        return this;
    }
}

/**
 * Display bar for numerical values
 * @Class
 * @property {string} name - displayed text on the top
 * @property {number} x - x position
 * @property {number} y - y position
 * @property {string | "rainbow_rb" | "rainbow_br"} colour - colour\nrainbow_rb: red to blue\nrainbow_br: blue to red
 * @property {number} max - maximum value
 * @property {number} decimal - the number of decimal points in the output
 * @property {number[]} markers - the positions of the horizontal indicators with numbers on the bar
 * @property {number} value - the displayable value
 */
class Bar {
    name;
    x;
    y;
    colour;
    max;
    decimal;
    markers;
    value;

    constructor(name, x, y, colour, max, decimal, markers = []) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.max = max;
        this.decimal = decimal;
        this.markers = markers;
    }

    /**
     * Draws the bar
     */
    draw() {
        // the "shell" of the bar
        push();
        strokeCap("round");
        strokeWeight(1);
        stroke("black");
        fill("white");
        rect(this.x - 0.5, this.y - 0.5, 200 + 1, 20 + 1); // I added 1 to the height and width because of the stroke
        pop();
        // the "progress" part of the bar
        push();
        noStroke();
        switch (this.colour) {
            case "rainbow_gr": // green to red
                colorMode("hsb"); //(hue-saturation-brightness) specify the colour of the bar with the hue (0 - red, 60 - yellow, 120 - green)
                fill(stayWithinRange(this.value, this.max) * 120, 100, 100);
                break;
            case "rainbow_rg": // red to green
                colorMode("hsb");
                fill(120 - (stayWithinRange(this.value, this.max) * 120), 100, 100);
                break;
            default:
                fill(this.colour);
                break;
        }

        /**
         * Checks, if the value is within the range, and if not, it sets it to the closest limit (which is 0 or the max value)
         * @param value {number} - the value to be checked
         * @param max {number} - the upper limit
         * @returns {number}
         */
        function stayWithinRange(value, max) {
            if (value < 0) {
                return 0;
            } else if (value > max) {
                return 1;
            } else {
                return value / max;
            }
        }

        rect(this.x, this.y, stayWithinRange(this.value, this.max) * 200, 20); // 200: width of the bar

        pop();

        // bar name/title
        push();
        textAlign("center", "top");
        textSize(15);
        textFont("ArcadeClassic");
        fill("white");
        text(this.name, this.x + 100, this.y - 20);
        pop();

        // output value
        push();
        textAlign("center", "top");
        textSize(20);
        textFont("ArcadeClassic");
        fill("white");
        text(this.value.toFixed(this.decimal), this.x + 100, this.y + 37.5);
        pop();

        // top and bottom markers
        markerCreate(this.x, this.y, this.max, 0); // the smallest value
        markerCreate(this.x, this.y, this.max, this.max); // the biggest value

        for (const marker of this.markers) { //going through the marker values & create/display them
            markerCreate(this.x, this.y, this.max, marker, true);
        }

        /**
         * Generates the markers for the bar
         * @param x {number} - x position of the bar
         * @param y {number} - y position of the bar
         * @param max {number} - the maximum value
         * @param marker {number} - the value of the marker
         * @param divider {boolean} - whether the marker should have a line in the bar or not
         */
        function markerCreate(x, y, max, marker, divider = false) { // I need these parameters because "this" doesn't work inside the function for a reason
            if (divider) {
                push();
                strokeWeight(0.5);
                stroke(0, 0, 0, 127);
                line(x + 200 * marker / max, y + 17.5, x + marker * 200 / max, y + 2.5); //  2.5 pixel gap
                pop();
            }
            push();
            textSize(10);
            textAlign("center", "bottom");
            textFont("ArcadeClassic");
            fill("white");
            text(marker, x + 200 * marker / max, y + 32.5);
            pop();
        }

        return this;
    }

    /**
     * Sets the value for the bar
     * @param value {number} - the value of the bar    */
    set(value) {
        this.value = value;
        return this;
    }
}
