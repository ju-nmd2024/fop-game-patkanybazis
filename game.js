
/**
 *
 * @type {{number: number, size: {small: {min: number, max: number}, big: {min: number, max: number}}, big_probability: number, speed: {measure: number, fluctuation: number}, collection: Star[]}}
 */
let stars = {};


function setup() {
    createCanvas(800,500);
    frameRate(30)

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

    for (let i = 0; i < stars.number; i++) {
        let star_options = Star.generate(true);
        stars.collection.push(new Star(star_options.x, star_options.y, star_options.size, star_options.alpha, star_options.speed));
    }



    console.log(stars.collection[0].size);

}



function draw() {
    background_elements();
}


function background_elements() {
    background(25, 25, 112);
    Star.display();
    moon();

    function moon() {
        noStroke();
        //moon base
        fill(245,245,245);
        ellipse(400, 900, 1000, 1000);

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
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }

    draw () {
        push()
        translate(0, -32)

        // jetpack bag
        noStroke();
        fill(105,105,105);
        rect(this.x - 45 * this.s , this.y - 50 * this.s, 90 * this.s, 100 * this.s, 10 * this.s);

        //left mini rocket
        noStroke();
        fill(128,128,128);
        rect(this.x - 85 * this.s , this.y - 50 * this.s, 40 * this.s, 100 * this.s, 0, 0,10 * this.s, 10 * this.s);

        fill(255,0,0);
        triangle(this.x - 85 * this.s, this.y - 43 * this.s, this.x - 65 * this.s, this.y - 90 * this.s, this.x - 45 * this.s,this.y - 43 * this.s);
        rect(this.x - 85 * this.s, this.y, 40 * this.s , 10 * this.s ); //didn'T work  (y) * s removed for moving
        rect(this.x - 85 * this.s, this.y + 20 * this.s, 40 * this.s, 10 * this.s );


        //right mini rocket
        noStroke();
        fill(128,128,128);
        rect(this.x + 45 * this.s, this.y - 50 * this.s, 40 * this.s, 100 * this.s, 0, 0,10 * this.s, 10 * this.s);

        fill(255,0,0);
        triangle(this.x + 85 * this.s, this.y - 43 * this.s, this.x + 65 * this.s, this.y - 90 * this.s, this.x + 45 * this.s,this.y - 43 * this.s);
        rect(this.x + 45 * this.s, this.y, 40 * this.s, 10 * this.s );
        rect(this.x + 45 * this.s, this.y + 20 * this.s, 40 * this.s, 10 * this.s );

        //tail
        fill(34,34,34);
        noStroke();
        ellipse(this.x + 30 * this.s, this.y + 70 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 40 * this.s, this.y + 90 * this.s, 25 * this.s, 25 * this.s);
        ellipse(this.x + 55 * this.s, this.y + 70 * this.s, 35 * this.s, 35  * this.s);
        ellipse(this.x + 60 * this.s, this.y + 95 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 78 * this.s, this.y + 78 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 80 * this.s, this.y + 100 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 100 * this.s, this.y + 80 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 100 * this.s, this.y + 100 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 120 * this.s, this.y + 70 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 125 * this.s, this.y + 95 * this.s, 35 * this.s, 35 * this.s);
        ellipse(this.x + 135 * this.s, this.y + 60 * this.s, 30 * this.s, 30 * this.s);
        ellipse(this.x + 145 * this.s, this.y + 70* this.s, 30 * this.s, 30 * this.s);
        ellipse(this.x + 145 * this.s, this.y + 85 * this.s, 30 * this.s, 30 * this.s);
        ellipse(this.x + 150 * this.s, this.y + 53 * this.s, 30 * this.s, 30 * this.s);
        ellipse(this.x + 158 * this.s, this.y + 68 * this.s, 30 * this.s, 30 * this.s);
        ellipse(this.x + 164 * this.s, this.y + 52 * this.s, 20 * this.s, 20 * this.s);




        ////////////////////////////////////////////////

        //body
        noStroke();
        fill(220,220,220);
        ellipse(this.x, this.y, 60* this.s, 120* this.s);

        switch (arm) {
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
        rect(-50* this.s, -60* this.s, 30* this.s, 60* this.s, 15* this.s);
        pop();

        //left arm base
        push();
        translate(this.x,this.y);
        rotate(1.2);

        noStroke();
        fill(255);
        rect(-50* this.s, 0* this.s, 30* this.s, 60* this.s, 15* this.s);
        pop();

        //left strap
        noStroke();
        fill(128,128,128);
        rect(this.x - 30 * this.s , this.y - 45 * this.s, 20 * this.s, 70 * this.s, 15 * this.s);

        //right strap
        noStroke();
        fill(128,128,128);
        rect(this.x + 10 * this.s, this.y - 45 * this.s, 20 * this.s, 70 * this.s, 15 * this.s);

        //left arm top
        push();
        translate(this.x,this.y);
        rotate(1.5);

        noStroke();
        fill(0);
        rect(-35 * this.s, 10 * this.s, 30 * this.s, 60* this.s, 15* this.s);
        fill(255);
        rect(-35* this.s,30* this.s, 30* this.s, 40* this.s, 15* this.s); //used 2 rectangles to show the hand
        rect(-35* this.s, 30* this.s, 30* this.s, 20* this.s);
        pop();

        //right arm top
        push();
        translate(this.x,this.y);
        rotate(1.7);

        noStroke();
        fill(0);
        rect(-35* this.s,-70* this.s, 30* this.s, 60* this.s, 15* this.s);
        fill(255);
        rect(-35* this.s,-70* this.s, 30* this.s, 40* this.s, 15* this.s); //used 2 rectangles to show the hand
        rect(-35* this.s,-50* this.s, 30* this.s, 20* this.s);
        pop();


        //right leg
        noStroke();
        fill(255);
        rect(this.x + 5* this.s, this.y + 30* this.s, 30* this.s, 60* this.s, 15* this.s);
        fill(0); //used 2 rectangles to show the foot
        rect(this.x + 5* this.s, this.y + 60* this.s, 30* this.s, 30* this.s, 15* this.s);
        rect(this.x + 5* this.s, this.y + 55* this.s, 30* this.s, 20* this.s);

        //left leg
        noStroke();
        fill(255);
        rect(this.x - 35* this.s, this.y + 30* this.s, 30* this.s, 60* this.s, 15* this.s);
        fill(0); //used 2 rectangles to show the foot
        rect(this.x - 35* this.s, this.y + 60* this.s, 30* this.s, 30* this.s, 15* this.s);
        rect(this.x - 35* this.s, this.y + 55* this.s, 30* this.s, 20* this.s);


        //head
        //head base
        stroke(0,0,0);
        strokeWeight(4);
        fill(0);
        ellipse(this.x, this.y - 80 * this.s, 120 * this.s , 90 * this.s);

        //left ear
        beginShape();
        vertex(this.x-60* this.s, this.y - 85* this.s);
        bezierVertex(this.x - 60 * this.s, this.y - 85 * this.s, this.x - 50 * this.s, this.y - 200 * this.s, this.x - 10 * this.s, this.y - 125 * this.s);
        endShape();

        //right ear
        beginShape();
        vertex(this.x+60* this.s, this.y-75* this.s);
        bezierVertex(this.x + 60 * this.s, this.y - 95 * this.s, this.x + 50 * this.s, this.y - 200 * this.s, this.x + 10 * this.s, this.y - 125 * this.s);
        endShape();



        //eyes

        switch (eye) {
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
        ellipse(this.x - 25 * this.s, this.y - 80 * this.s, 45 * this.s , 45 * this.s);


        //left eye pupil
        fill(0,0,0);
        noStroke();
        ellipse(this.x - 25 * this.s, this.y - 80 * this.s, 20 * this.s , 35 * this.s);

        //right eye base
        fill(255,255,0);
        noStroke();
        ellipse(this.x + 25 * this.s, this.y - 80 * this.s, 45 * this.s , 45 * this.s);


        //right eye pupil
        fill(0,0,0);
        noStroke();
        ellipse(this.x + 25 * this.s, this.y - 80 * this.s, 20 * this.s , 35 * this.s);







        //helmet
        stroke(167, 199, 231);
        strokeWeight(6*this.s);
        fill(70, 130, 180, 40);
        ellipse(this.x , this.y - 100 * this.s, 150 * this.s, 150 * this.s);

        //flame
        if (flame) {
            push()
            noStroke()
            fill("orange")
            triangle(this.x - 77 * this.s,this.y + 48 * this.s,this.x - 53 * this.s,this.y + 48 * this.s,this.x - 65 * this.s,this.y + 85 * this.s)
            triangle(this.x + 53 * this.s,this.y + 48 * this.s,this.x + 77 * this.s,this.y + 48 * this.s,this.x + 65 * this.s,this.y + 85 * this.s)
            pop()
        }

        pop()
    }
}

