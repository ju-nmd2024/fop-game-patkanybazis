/**
 *
 * @type {{number: number, size: {small: {min: number, max: number}, big: {min: number, max: number}}, big_probability: number, speed: {measure: number, fluctuation: number}, collection: {x: number, y: number, alpha: number, size: number}[]}}
 */
let stars = {};


function setup() {
    createCanvas(800,500);

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
            measure: 1,      // how fast the stars appear and disappear
            fluctuation: 1  // how faster the speed can be (to make the animation more dynamic)
        },
        collection: []  // the collection of stars
    }

    for (let i = 0; i < stars.number; i++) {
        
    }

}



function draw() {
    background_elements();
}


function background_elements() {
    background(25, 25, 112);
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
    function star(x, y, s){
        s = s * 0.15  //makes the stars smaller
        fill(255);
        noStroke();
        triangle(x , y  , x + 5 * s, y - 20*s, x + 10*s , y );
        triangle(x, y , x + 5* s, y + 20* s, x + 10* s , y );
        triangle(x + 5 * s, y - 5 * s, x - 10 * s, y , x + 5 * s, y + 5 * s );
        triangle(x + 5 * s, y - 5 * s, x + 20 * s, y , x + 5 * s, y + 5 * s );

    }
    function star_generation(){





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

