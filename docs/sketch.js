/**
 * Author: Khalil Kilani
 * Course: CSCI 3725
 * Assignment: M9 - Another Kind of CC
 * Date: December 19, 2024
 */


let clouds = []; // Array of Clouds
let current_line_coordinates = [];
let is_paused = false;
let is_drawing = false;
let draw_stroke_layer;

// Initialize canvas and drawing buffer at the start of every new sketch.
function setup() {
    createCanvas(innerWidth, innerHeight);

    // Initialize graphics buffer for intermediate draw strokes
    draw_stroke_layer = createGraphics(innerWidth, innerHeight);
    draw_stroke_layer.show();
}


// Resize the canvas and drawing buffer when the window's size changes.
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    draw_stroke_layer.remove(); // Remove graphics buffer from web page
    draw_stroke_layer = undefined; // Delete graphics buffer from CPU memory
    draw_stroke_layer = createGraphics(innerWidth, innerHeight);
}


// Check if the user has paused movement to save their creation.
function check_pause() {
    if (isKeyPressed && keyCode == UP_ARROW) { // User pressed up arrow
        is_paused = true;
    } else if (isKeyPressed) {
        is_paused = false;
    }
}


// Draw and store the line coordinates of every mouse drag.
function mouseDragged() {
    if (!is_paused) { // Only draw if user has allowed movement
        is_drawing = true;
        draw_stroke_layer.strokeWeight(2);

        // Make line by connecting previous mouse coordinates
        draw_stroke_layer.line(pmouseX, pmouseY, mouseX, mouseY);
        current_line_coordinates.push([mouseX, mouseY]);
    }
}


// Create a Cloud using stored line coordinates upon mouse drag completion.
function mouseReleased() {
    if (is_drawing) { // Only create Cloud if one was drawn (omit mouse presses)
        is_drawing = false;
        clouds.push(new Cloud(this, current_line_coordinates)); // Create Cloud
        current_line_coordinates = []; // Reset line coordinates for next Cloud
        draw_stroke_layer.clear(); // Clear the drawing buffer
    }
}


function draw() {
    clear(); // Clear the background
    
    image(draw_stroke_layer, 0, 0); // Display drawing buffer from top left

    check_pause();
    // Display each cloud
    clouds.forEach((cloud) => {
        if (!is_paused) { // Only move clouds if user has allowed movement
            cloud.move();
        }
        cloud.display();
    });
}


class Cloud {
    constructor(canvas, coordinates) {
        this.canvas = canvas; // Store a reference to the canvas
        this.coordinates = coordinates; // Coordinates of the bounding line

        // TODO: change speed
        this.speedX = this.canvas.random(-5, 5);
        this.speedY = this.canvas.random(-5, 5);
    }

    display() {
        // Specify the fill color for the Cloud
        this.canvas.fill(255, 0, 0);

        // Draw the cloud by connecting all the line coordinates with vertices
        beginShape();
        this.coordinates.forEach((coordinate) => {
            let [xCoord, yCoord] = coordinate; // Unpack x and y coordinates
            curveVertex(xCoord, yCoord); // Connect using a vertex
        });
        endShape(CLOSE); // Connect first and last vertices
    }

    move() {
        // Update the position of the cloud according to its speed
        this.coordinates.forEach((coordinate) => {
            coordinate[0] += this.speedX;
            coordinate[1] += this.speedY;
        });

    }
}