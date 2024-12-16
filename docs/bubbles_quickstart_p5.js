// Create an array of Bubbles.
let theBubbles = [];
let is_paused = false;

function setup() {
    createCanvas(innerWidth, innerHeight);
}

// Resize the canvas when the website's size changes.
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // Clear the background.
    background(0, 0, 0);

    // If the user clicks...
    if (mouseIsPressed && !is_paused) {
        // Create a Bubble and add it to the current index in our array.
        // The Bubble should be placed where the user clicked.
        theBubbles.push(new Bubble(this, mouseX, mouseY));
    }
		
    check_pause();
    theBubbles.forEach((bubble) => {
        if (!is_paused) {
            bubble.move();
        }
        bubble.display();
    });
	

}

function check_pause() {
		if (isKeyPressed && keyCode == UP_ARROW) {
				is_paused = true;
		} else if (isKeyPressed) {
				is_paused = false;
		}
}

class Bubble {

    constructor(canvas, x, y) {
        // Store a reference to the canvas.
        this.canvas = canvas;

        // Store x and y.
        this.x = x;
        this.y = y;

        // Randomize our size.
        this.size = this.canvas.random(15,35);

        // Randomize our color.
        this.myRed = this.canvas.random(0,255);
        this.myGreen = this.canvas.random(0,255);
        this.myBlue = this.canvas.random(0,255);

        // Randomize our speed.
        this.speedX = this.canvas.random(-5, 5);
        this.speedY = this.canvas.random(-5, 5);
    }
	
    display() {
        // This method specifies our Bubble will not have an outline.
        this.canvas.noStroke();

        // Specifies the fill for the Bubble.
        this.canvas.fill(this.myRed, this.myGreen, this.myBlue);

        // Draws an ellipse on the screen to represent our Bubble.
        this.canvas.ellipse(this.x, this.y, this.size, this.size);
    }

    move() {
        // Updates position based on speed.
        this.x += this.speedX;
        this.y += this.speedY;
    }

}