// Create an array of Bubbles.
Bubble[] theBubbles = new Bubble[100];

// How many Bubbles we have already created.
int numBubbles = 0;

// The current index position in our Bubble array.
int currentBubble = 0;

boolean is_paused = false;

void setup() {
    fullScreen(P2D);
}

void draw() {
    // Clear the background.
    background(0, 0, 0);

    // If the user clicks...
    if (mousePressed && !is_paused) {
        // Create a Bubble and add it to the current index in our array.
        // The Bubble should be placed where the user clicked.
        theBubbles[currentBubble] = new Bubble(this, mouseX, mouseY);
        
        // Increase the current index to get ready for the next Bubble.
        currentBubble++;

        // Increase our total bubbles in play, if we haven't filled the array yet.
        if (numBubbles < theBubbles.length){
            numBubbles++;
        }

        // Did we just use our last slot? If so, we can reuse old slots.
        if (currentBubble >= theBubbles.length) {
            currentBubble = 0;
        }
    }
		
		check_pause();
		for (int i = 0; i < numBubbles; i++){
				if (!is_paused) {
						theBubbles[i].move();
				}
				theBubbles[i].display();
		}
	

}

void check_pause() {
		if (keyPressed && keyCode == UP) {
				is_paused = true;
		} else if (keyPressed) {
				is_paused = false;
		}
}

class Bubble {
    // The position of this Bubble.
    private float x;
    private float y;

    // The size of this Bubble.
    private float size;

    // How much red, green, and blue this Bubble has.
    private float myRed;
    private float myGreen;
    private float myBlue;

    // How fast this Bubble moves.
    private float speedX;
    private float speedY;

    // Store a reference to the canvas.
    private PApplet canvas;

    Bubble(PApplet canvas, float x, float y) {
        // Store a reference to the canvas.
        this.canvas = canvas;

        // Store x and y.
        this.x = x;
        this.y = y;

        // Randomize our size.
        size = this.canvas.random(15,35);

        // Randomize our color.
        myRed = this.canvas.random(0,255);
        myGreen = this.canvas.random(0,255);
        myBlue = this.canvas.random(0,255);

        // Randomize our speed.
        speedX = this.canvas.random(-5, 5);
        speedY = this.canvas.random(-5, 5);
    }
	
		void display() {
			// This method specifies our Bubble will not have an outline.
			this.canvas.noStroke();

			// Specifies the fill for the Bubble.
			this.canvas.fill(myRed, myGreen, myBlue);

			// Draws an ellipse on the screen to represent our Bubble.
			this.canvas.ellipse(x, y, size, size);
		}
	
		void move() {
			// Updates position based on speed.
			x += speedX;
			y += speedY;
		}

}