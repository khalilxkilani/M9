/**
 * Author: Khalil Kilani
 * Course: CSCI 3725
 * Assignment: M9 - Another Kind of CC
 * Date: December 19, 2024
 */


let clouds = []; // Array of Clouds
let currLinePoints = [];
let cloudColors = [
    [230, 230, 250], [255, 245, 238], [255, 228, 225], [220, 220, 220]
]; // RGB values for Lavender, SeaShell, MistyRose, and Gainsboro
let isPaused = false;
let isDrawing = false;
let skyLayer;
let drawStrokeLayer;
let prevNumClouds = -1; // Set negative so program can use range 0 <= i <= n
const SKY_GRADIENT_RATE = 10; // Rate at which gradient changes colors
const TRANSPARENCY_RATE = 1; // Rate at which clouds lose transparency


/**
 * Initialize canvas and drawing buffer at the start of every new sketch.
 */
function setup() {
    createCanvas(innerWidth, innerHeight);

    // Initialize graphics buffer for intermediate draw strokes
    skyLayer = createGraphics(innerWidth, innerHeight);
    skyLayer.show();

    // Initialize graphics buffer for intermediate draw strokes
    drawStrokeLayer = createGraphics(innerWidth, innerHeight);
    drawStrokeLayer.show();
}


/**
 * Resize the canvas and drawing buffer when the window's size changes.
 */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    refreshGraphicsLayers();
}


/**
 * Create new graphics layers for the sky and draw strokes when resizing the
 * window or resetting the creative space.
 */
function refreshGraphicsLayers() {
    skyLayer.remove(); // Remove graphics buffer from web page
    skyLayer = undefined; // Delete graphics buffer from CPU memory
    skyLayer = createGraphics(innerWidth, innerHeight);
    displaySkyGradient(true);

    drawStrokeLayer.remove();
    drawStrokeLayer = undefined;
    drawStrokeLayer = createGraphics(innerWidth, innerHeight);
}


/**
 * Check if the user has paused movement to save their creation.
 */
function checkPause() {
    if (isKeyPressed && keyCode === UP_ARROW) { // User pressed up arrow
        isPaused = true;
    } else if (isKeyPressed) {
        isPaused = false;
    }
}


/**
 * Check if the user has restarted the sketch to begin a new creation.
 */
function checkRestart() {
    if (isKeyPressed && key === 'r') { // User pressed r key
        // Reset states of non-static global variables
        clouds = [];
        currLinePoints = [];
        isPaused = false;
        isDrawing = false;

        refreshGraphicsLayers();
    }
}


/**
 * Draw and store the line coordinates of every mouse drag.
 */
function mouseDragged() {
    if (!isPaused) { // Only draw if user has allowed movement
        isDrawing = true;
        drawStrokeLayer.strokeWeight(2);

        // Make line by connecting previous mouse coordinates
        drawStrokeLayer.line(pmouseX, pmouseY, mouseX, mouseY);
        currLinePoints.push([mouseX, mouseY]);
    }
}


/**
 * Create a Cloud using stored line coordinates upon mouse drag completion.
 */
function mouseReleased() {
    if (isDrawing) { // Only create Cloud if one was drawn (omit mouse presses)
        isDrawing = false;
        clouds.push(new Cloud(currLinePoints)); // Create Cloud
        currLinePoints = []; // Reset line coordinates for next Cloud
        drawStrokeLayer.clear(); // Clear the drawing buffer
    }
}


/**
 * Draw the sky gradient and Clouds every frame.
 */
function draw() {
    clear(); // Clear the background
    displaySkyGradient();

    // Display drawing buffers from top left
    image(skyLayer, 0, 0);
    image(drawStrokeLayer, 0, 0);

    // Check utilities of the creative space
    checkPause();
    checkRestart();

    // Display each cloud
    clouds = clouds.filter(checkCloudBounds).filter(checkTransparency);
    clouds.forEach((cloud) => {
        if (!isPaused) { // Only move clouds if user has allowed movement
            cloud.move();
            cloud.dissipate();
        }
        cloud.display();
    });
}


/**
 * Define the blue and grey hues of the sky gradient depending on the number of
 * clouds present.
 * 
 * @param {*} is_window_resized true if window has been resized, false otherwise
 * @returns does not execute if number of Clouds has not changed
 */
function displaySkyGradient(is_window_resized = false) {
    let numClouds = clouds.length; // Obtain number of clouds currently visible

    // Only redraw the sky gradient if the number of clouds has changed
    if (!is_window_resized && numClouds === prevNumClouds) {
        return;
    } else {
        prevNumClouds = numClouds;
        skyLayer.clear(); // Clear the sky buffer
    }

    // Adjust B value down for darker, up for lighter
    let blueHue = color(0, 150 - (numClouds * SKY_GRADIENT_RATE),
        255 - (numClouds * SKY_GRADIENT_RATE));

    // Adjust R,G,B values down for darker, up for lighter
    let greyRGB = 225 - (numClouds * SKY_GRADIENT_RATE);
    let greyHue = color(greyRGB, greyRGB, greyRGB);

    // Draw horizontal lines per height pixel using a different blue-grey blend
    for (let y = 0; y < innerHeight; y += 1) {
        // Determine how much to interpolate between both colors
        let amount = map(y, 0, innerHeight, 0, 1);
        // Lerp to blend both colors
        let gradient = lerpColor(blueHue, greyHue, amount);
        skyLayer.stroke(gradient);
        skyLayer.line(0, y, innerWidth, y);
    }
}


/**
 * Determine if a Cloud is outside of the window bounds.
 * 
 * @param {Cloud} cloud 
 * @returns true if Cloud within bounds, false otherwise
 */
function checkCloudBounds(cloud) {
    [xCoord, yCoord] = cloud.getFirstCoordPair();

    // Quarter padding around window bounds
    if (xCoord > (innerWidth * 1.25) || xCoord < -(innerWidth / 4) ||
        yCoord > (innerHeight * 1.25) || yCoord < -(innerHeight / 4)) {
        return false;
    } else {
        return true;
    }
}


/**
 * Determine if a Cloud has become fully transparent.
 * 
 * @param {Cloud} cloud 
 * @returns true if Cloud is fully transparent, false otherwise
 */
function checkTransparency(cloud) {
    if (cloud.transparency <= 0) {
        return false;
    } else {
        return true;
    }
}


/**
 * Cloud objects are what the user draws and interacts with on the screen.
 */
class Cloud {

    /**
     * Initialize a new Cloud object.
     * 
     * @param {*} coordinates coordinates of the bounding line
     */
    constructor(coordinates) {
        this.coordinates = coordinates;

        this.vectors = [];
        this.color = random(cloudColors);
        this.transparency = 255;

        // TODO: change speed
        this.speedX = random(-5, 5);
        this.speedY = random(-5, 5);
        this.directionX = Math.sign(this.speedX);
        this.directionY = Math.sign(this.speedY);

        this.isDirXChanged = false;
        this.isDirYChanged = false;
        this.isTouchingWall = false;
    }

    /**
     * Render the Cloud.
     */
    display() {
        // Specify the fill color for the Cloud
        let [r, g, b] = this.color; // Unpack assigned color
        fill(r, g, b, this.transparency);
        noStroke(); // Remove outline of Cloud shape

        this.vectors = []; // Reset vectors

        // Draw the cloud by connecting all the line coordinates with vertices
        beginShape();
        this.coordinates.forEach((coordinate) => {
            // Every 60 frames, offset the coordinates to perform wiggle effect
            if (frameCount % 60 === 0 && !isPaused) {
                coordinate[0] += random(-10, 10) * noise(0.05 * frameCount);
                coordinate[1] += random(-5, 5) * noise(0.05 * frameCount);
            }
            curveVertex(coordinate[0], coordinate[1]); // Connect using a vertex

            // Update vectors
            let currVector = createVector(coordinate[0], coordinate[1]);
            this.vectors.push(currVector);
        });
        endShape(CLOSE); // Connect first and last vertices
    }

    /**
     * Move the Cloud.
     */
    move() {
        // Check if any coordinate has surpassed the window boundaries
        this.coordinates.forEach((coordinate) => {
            this.checkWallBounceX(coordinate[0]);
            this.checkWallBounceY(coordinate[1]);
        });

        // Update Cloud positon according to its speed and direction
        this.coordinates.forEach((coordinate) => {
            coordinate[0] += this.speedX * this.directionX;
            coordinate[1] += this.speedY * this.directionY;
        });

        // Enable direction changes on next call to move()
        this.isDirXChanged = false;
        this.isDirYChanged = false;
    }

    /**
     * Return the first (x, y) coordinate pair of the cloud.
     * 
     * @returns first (x, y) coordinate pair of the cloud.
     */
    getFirstCoordPair() {
        return this.coordinates[0];
    }

    /**
     * If the mouse hovers over the Cloud, increase transparency of the Cloud.
     */
    dissipate() {
        // Check if mouse collides with cloud
        let hit = collidePointPoly(mouseX, mouseY, this.vectors);
        if (hit) {
            this.transparency -= TRANSPARENCY_RATE; // Decrease alpha value
        }
    }

    /**
     * Check if the Cloud should bounce off the left or right bounds of the
     * window.
     * 
     * @param {*} xCoord a single x coordinate within the Cloud's shape.
     */
    checkWallBounceX(xCoord) {
        if ((xCoord < 0 || xCoord > innerWidth) && !this.isDirXChanged) {
            this.directionX *= -1;
            this.isDirXChanged = true;
        }
    }

    /**
     * Check if the Cloud should bounce off the top or bottom bounds of the
     * window.
     * 
     * @param {*} yCoord a single y coordinate within the Cloud's shape.
     */
    checkWallBounceY(yCoord) {
        if ((yCoord < 0 || yCoord > innerHeight) && !this.isDirYChanged) {
            this.directionY *= -1;
            this.isDirYChanged = true;
        }
    }
}