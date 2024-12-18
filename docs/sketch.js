/**
 * Author: Khalil Kilani
 * Course: CSCI 3725
 * Assignment: M9 - Another Kind of CC
 * Date: December 19, 2024
 */


let clouds = [];
let currLinePoints = []; // Points that define shape of a Cloud
let strokeTrail = []; // Coordinates that define the mouse trail
let cloudColors = [
    [230, 230, 250], [255, 245, 238], [255, 228, 225], [220, 220, 220]
]; // RGB values for Lavender, SeaShell, MistyRose, and Gainsboro
let isPaused = false;
let isDrawing = false;
let skyLayer;
let drawStrokeLayer;
let prevNumClouds = -1; // Set negative so program can use range 0 <= i <= n
let font;
let fontsize = 56;
const SKY_GRADIENT_RATE = 10; // Rate at which gradient changes colors
const TRANSPARENCY_RATE = 1; // Rate at which Clouds lose transparency
const DRAWING_RESISTANCE = 5; // Amount to offset Cloud line points
const CLOUD_SPEED_RANGE = 2; // Set minimum and maximum of cloud speed
const SCATTER_SPEED = 20; // Speed at which Clouds scatter upon double click


/**
 * Initialize canvas and drawing buffer at the start of every new sketch.
 */
function setup() {
    createCanvas(innerWidth, innerHeight);
    noCursor();

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
    if (isPaused) {
        displayPauseText();
    }

    if (isKeyPressed && keyCode === UP_ARROW) { // User pressed up arrow
        isPaused = true;
    } else if (isKeyPressed) {
        isPaused = false;
    }
}


/**
 * Display text on pause window for when user shares their creation.
 */
function displayPauseText() {
    textFont('Courier New');
    textStyle(BOLD);
    textSize(fontsize);
    textAlign(CENTER, TOP);

    // White text with black outline
    fill(255);
    stroke(0);
    strokeWeight(4);

    // Center text near top of window
    text("Look! It's a...", innerWidth / 2, innerHeight / 10);
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
 * Scatter Clouds off the screen when the user double clicks the mouse.
 */
function doubleClicked() {
    // Assume Cloud is on the bottom right quadrant of window
    let newXDir = 1;
    let newYDir = 1;

    // Scatter each Cloud away toward the window quadrant it is closest to
    clouds.forEach((cloud) => {
        let [xCoord, yCoord] = cloud.getCenterCoord(); // Middle of Cloud

        // Cloud is on left half of window
        if (xCoord < (innerWidth / 2)) {
            newXDir = -1;
        }
        // Cloud is on top half of window
        if (yCoord < (innerHeight / 2)) {
            newYDir = -1;
        }

        // Scatter the Cloud away
        cloud.scatter(newXDir, newYDir);
    });
}


/**
 * Draw and store the line coordinates of every mouse drag.
 */
function mouseDragged() {
    if (!isPaused) { // Only draw if user has allowed movement
        isDrawing = true;
        // drawStrokeLayer.strokeWeight(2);

        // Add resistance against the user's intended Cloud drawing
        let offset = random(-DRAWING_RESISTANCE, DRAWING_RESISTANCE);

        // Make line by connecting previous mouse coordinates
        // drawStrokeLayer.line(pmouseX, pmouseY, mouseX, mouseY);
        currLinePoints.push([mouseX + offset, mouseY + offset]);
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

    // Add a trail to the cursor movement
    drawStrokeTrail();

    // Check utilities of the creative space
    checkPause();
    checkRestart();

    // Remove Clouds that have become fully transparent or moved out of bounds
    clouds = clouds.filter(checkCloudBounds).filter(checkTransparency);
    // Display each Cloud
    clouds.forEach((cloud) => {
        if (!isPaused) { // Only move Clouds if user has allowed movement
            cloud.move();
            cloud.dissipate();
        }
        cloud.display();
    });
}


/**
 * Draws a trail behind the mouse that shows past movement and current location
 * in place of a standard cursor arrow.
 */
function drawStrokeTrail() {
    strokeTrail.push([mouseX, mouseY]); // Save current coordinates
    noStroke();

    // Limit trail to 50 copies
    if (strokeTrail.length > 50) {
        strokeTrail.shift(); // Removes first copy
    }

    // Apportion transparency evenly among all copies
    let transparency = 255 / strokeTrail.length;

    // Draw all trail copies in gold color, from smallest to biggest
    for (let i = 0; i < strokeTrail.length; i++) {
        // Subsequent copies are smaller and more transparent
        fill(255, 215, 0, (transparency * i));
        let currCoords = strokeTrail[i];
        circle(currCoords[0], currCoords[1], i / 5);
    }
}


/**
 * Define the blue and grey hues of the sky gradient depending on the number of
 * clouds present.
 * 
 * @param {boolean} is_window_resized true if window resized, false otherwise.
 * @returns does not execute if number of Clouds has not changed.
 */
function displaySkyGradient(is_window_resized = false) {
    let numClouds = clouds.length; // Obtain number of Clouds currently visible

    // Only redraw the sky gradient if the number of Clouds has changed
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
 * @returns true if Cloud within bounds, false otherwise.
 */
function checkCloudBounds(cloud) {
    [xCoord, yCoord] = cloud.getCenterCoord();

    // Quarter padding around window bounds
    if (xCoord > (innerWidth * 1.5) || xCoord < -(innerWidth / 2) ||
        yCoord > (innerHeight * 1.5) || yCoord < -(innerHeight / 2)) {
        return false;
    } else {
        return true;
    }
}


/**
 * Determine if a Cloud has become fully transparent.
 * 
 * @param {Cloud} cloud 
 * @returns true if Cloud is fully transparent, false otherwise.
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
     * @param {number[]} coordinates coordinates of the bounding line.
     */
    constructor(coordinates) {
        this.coordinates = coordinates;

        this.vectors = [];
        this.color = random(cloudColors);
        this.transparency = 255;

        // Set speed to non-zero value
        this.setSpeed();
        while (this.speedX === 0 || this.speedY === 0) {
            this.setSpeed();
        }

        this.directionX = Math.sign(this.speedX);
        this.directionY = Math.sign(this.speedY);

        this.isDirXChanged = false;
        this.isDirYChanged = false;
        this.isTouchingWall = false;
        this.isScattering = false;
    }

    /**
     * Set the speed of the Cloud.
     */
    setSpeed() {
        if (this.isScattering) {
            this.speedX = SCATTER_SPEED;
            this.speedY = SCATTER_SPEED;
        } else {
            this.speedX = random(-CLOUD_SPEED_RANGE, CLOUD_SPEED_RANGE);
            this.speedY = random(-CLOUD_SPEED_RANGE, CLOUD_SPEED_RANGE);
        }
    }

    /**
     * Scatter the Cloud away toward whichever window quadrant it is in.
     * 
     * @param {number} newXDir -1 for leftward or 1 for rightward.
     * @param {number} newYDir -1 for up or 1 for down.
     */
    scatter(newXDir, newYDir) {
        // Move Cloud out of bounds
        this.directionX = newXDir;
        this.directionY = newYDir;
        // Notify move() that Cloud should not be contained by window bounds
        // and notify setSpeed() that Cloud speed should be absolute
        this.isScattering = true;
        // Make Cloud move quicker for scatter effect
        this.setSpeed();
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
     * Identify the center point of the Cloud.
     * 
     * @returns x and y coordinates of the center of the Cloud.
     */
    getCenterCoord() {
        // Set mins and maxes as opposites to ensure correct comparision in loop
        let minX = innerWidth;
        let maxX = 0;
        let minY = innerHeight;
        let maxY = 0;

        // Find the min and max of the Cloud's x and y coordinates
        this.coordinates.forEach((coordinate) => {
            if (coordinate[0] < minX) {
                minX = coordinate[0];
            }
            if (coordinate[0] > maxX) {
                maxX = coordinate[0];
            }
            if (coordinate[1] < minY) {
                minY = coordinate[1];
            }
            if (coordinate[1] > maxY) {
                maxY = coordinate[1];
            }
        });

        // Cloud center point
        return [(maxX + minX) / 2, (maxY + minY) / 2]
    }

    /**
     * Move the Cloud.
     */
    move() {
        // Check if any coordinate has surpassed the window boundaries
        if (!this.isScattering) {
            this.coordinates.forEach((coordinate) => {
                this.checkWallBounceX(coordinate[0]);
                this.checkWallBounceY(coordinate[1]);
            });
        }

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
     * @param {number} xCoord a single x coordinate within the Cloud's shape.
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
     * @param {number} yCoord a single y coordinate within the Cloud's shape.
     */
    checkWallBounceY(yCoord) {
        if ((yCoord < 0 || yCoord > innerHeight) && !this.isDirYChanged) {
            this.directionY *= -1;
            this.isDirYChanged = true;
        }
    }
}
