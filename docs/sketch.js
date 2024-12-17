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
let sky_layer;
let draw_stroke_layer;
let prev_num_clouds = -1;
const SKY_COLOR_CHANGE_RATE = 10;
const TRANSPARENCY_CHANGE_RATE = 1;


// Initialize canvas and drawing buffer at the start of every new sketch.
function setup() {
    createCanvas(innerWidth, innerHeight);

    // Initialize graphics buffer for intermediate draw strokes
    sky_layer = createGraphics(innerWidth, innerHeight);
    sky_layer.show();

    // Initialize graphics buffer for intermediate draw strokes
    draw_stroke_layer = createGraphics(innerWidth, innerHeight);
    draw_stroke_layer.show();
}


// Resize the canvas and drawing buffer when the window's size changes.
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

    sky_layer.remove(); // Remove graphics buffer from web page
    sky_layer = undefined; // Delete graphics buffer from CPU memory
    sky_layer = createGraphics(innerWidth, innerHeight);
    sky_gradient(true);

    draw_stroke_layer.remove(); // Remove graphics buffer from web page
    draw_stroke_layer = undefined; // Delete graphics buffer from CPU memory
    draw_stroke_layer = createGraphics(innerWidth, innerHeight);
}


// Check if the user has paused movement to save their creation.
function check_pause() {
    if (isKeyPressed && keyCode === UP_ARROW) { // User pressed up arrow
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

    sky_gradient();

    // Display drawing buffers from top left
    image(sky_layer, 0, 0);
    image(draw_stroke_layer, 0, 0);

    check_pause();
    // Display each cloud
    clouds = clouds.filter(check_cloud_bounds);
    clouds.forEach((cloud) => {
        if (!is_paused) { // Only move clouds if user has allowed movement
            cloud.move();
        }
        cloud.dissipate();
        cloud.display();
    });
}


// Define the blue and grey hues of the sky gradient depending on the number of
// clouds present. Default parameter assumes window has not been resized.
function sky_gradient(is_window_resized = false) {
    let num_clouds = clouds.length; // Obtain number of clouds currently visible

    // Only redraw the sky gradient if the number of clouds has changed
    if (!is_window_resized && num_clouds === prev_num_clouds) {
        return;
    } else {
        prev_num_clouds = num_clouds;
        sky_layer.clear(); // Clear the sky buffer
    }

    // Adjust B value down for darker, up for lighter
    let blue_hue = color(0, 150 - (num_clouds * SKY_COLOR_CHANGE_RATE),
        255 - (num_clouds * SKY_COLOR_CHANGE_RATE));

    // Adjust R,G,B values down for darker, up for lighter
    let grey_RGB_value = 225 - (num_clouds * SKY_COLOR_CHANGE_RATE);
    let grey_hue = color(grey_RGB_value, grey_RGB_value, grey_RGB_value);

    // Draw horizontal lines per height pixel using a different blue-grey blend
    for (let y = 0; y < innerHeight; y += 1) {
        // Determine how much to interpolate between both colors
        let amount = map(y, 0, innerHeight, 0, 1);
        // Lerp to blend both colors
        let gradient = lerpColor(blue_hue, grey_hue, amount);
        sky_layer.stroke(gradient);
        sky_layer.line(0, y, innerWidth, y);
    }
}


// Determine if a Cloud is out of the window bounds.
function check_cloud_bounds(cloud) {
    [xCoord, yCoord] = cloud.get_first_coord_pair();

    // Check if within window bounds using quarter padding
    if (xCoord > (innerWidth * 1.25) || xCoord < -(innerWidth / 4) ||
        yCoord > (innerHeight * 1.25) || yCoord < -(innerHeight / 4)) {
        return false;
    } else {
        return true;
    }
}


class Cloud {
    constructor(canvas, coordinates) {
        this.canvas = canvas; // Store a reference to the canvas
        this.coordinates = coordinates; // Coordinates of the bounding line

        this.vectors = [];
        this.transparency = 255;

        // TODO: change speed
        this.speedX = this.canvas.random(-5, 5);
        this.speedY = this.canvas.random(-5, 5);
    }

    display() {
        // Specify the fill color for the Cloud
        fill(255, 0, 0, this.transparency);
        noStroke();

        this.vectors = []; // Reset vectors

        // Draw the cloud by connecting all the line coordinates with vertices
        beginShape();
        this.coordinates.forEach((coordinate) => {
            // Every 60 frames, offset the coordinates to perform wiggle effect
            if (frameCount % 60 === 0) {
                coordinate[0] += random(-10, 10) * noise(0.05 * frameCount);
                coordinate[1] += random(-5, 5) * noise(0.05 * frameCount);
            }
            curveVertex(coordinate[0], coordinate[1]); // Connect using a vertex

            // Update vectors
            let curr_vector = createVector(coordinate[0], coordinate[1]);
            this.vectors.push(curr_vector);
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

    // Return the first coordinate pair (x, y) of the cloud.
    get_first_coord_pair() {
        return this.coordinates[0];
    }

    // If mouse hovers over cloud, make it turn transparent
    dissipate() {
        // Check if mouse collides with cloud
        let hit = collidePointPoly(mouseX, mouseY, this.vectors);
        if (hit) {
            this.transparency -= TRANSPARENCY_CHANGE_RATE; // Decrease alpha value
        }
    }
}