/**
 * Author: Khalil Kilani
 * Course: CSCI 3725
 * Assignment: M9 - Another Kind of CC
 * Date: December 19, 2024
 */


let clouds = []; // Array of Clouds
let current_line_coordinates = [];
let is_paused = false;


// Initialize canvas at the start of every new sketch.
function setup() {
    createCanvas(innerWidth, innerHeight);
}


// Resize the canvas when the window's size changes.
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
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
    strokeWeight(2);
    // Make line by connecting previous mouse coordinates
    line(pmouseX, pmouseY, mouseX, mouseY);
    current_line_coordinates.push([mouseX, mouseY]);
}


// Create a Cloud using stored line coordinates upon mouse drag completion.
function mouseReleased() {
    clouds.push(new Cloud(this, current_line_coordinates)); // Create a Cloud
    current_line_coordinates = []; // Reset line coordinates for next Cloud
}


function draw() {
    // Display each cloud
    clouds.forEach((cloud) => {
        cloud.display();
    });
}


class Cloud {
    constructor(canvas, coordinates) {
        this.canvas = canvas; // Store a reference to the canvas
        this.coordinates = coordinates; // Coordinates of the bounding line
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
        // TODO
    }
}