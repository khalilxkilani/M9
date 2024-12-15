// Create an array of Bubbles.
let theBubbles = [];
// How many Bubbles we have already created.
let numBubbles = 0;
// The current index position in our Bubble array.
let currentBubble = 0;
let is_paused = false;

function setup() {
    createCanvas(innerWidth, innerHeight);
}

function draw() {
    // Clear the background.
    background(0, 0, 0);

    // If the user clicks...
    if (mouseIsPressed && !is_paused) {
        // Create a Bubble and add it to the current index in our array.
        // The Bubble should be placed where the user clicked.
        theBubbles[currentBubble] = new Bubble(this, mouseX, mouseY);
        
        // Increase the current index to get ready for the next Bubble.
        currentBubble++;

        // Increase our total bubbles in play, if we haven't filled the array yet.
        if (numBubbles < theBubbles.length){
            numBubbles++;
        }
    }
		
		check_pause();
		for (var i = 0; i < numBubbles; i++){
				if (!is_paused) {
						theBubbles[i].move();
				}
				// theBubbles[i].move();
				theBubbles[i].display();
		}
	

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