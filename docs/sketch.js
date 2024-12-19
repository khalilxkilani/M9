/**
 * Author: Khalil Kilani
 * Course: CSCI 3725
 * Assignment: M9 - Another Kind of CC
 * Date: December 19, 2024
 * 
 * A module to hold the main mechanics of SkySonder. They include mouse
 * interaction, button feedback, layer management, bounds-checking, and asset
 * drawing.
 */


let clouds = [];
let currLinePoints = []; // Points that define shape of a Cloud
let strokeTrail = []; // Coordinates that define the mouse trail
let cloudColors = [
    [230, 230, 250], [255, 245, 238], [255, 228, 225], [220, 220, 220]
]; // RGB values for Lavender, SeaShell, MistyRose, and Gainsboro
let isPaused = false;
let isDrawing = false;
let isCreativeSpaceEnabled = false;
let instructionsImage;
let skyLayer;
let drawStrokeLayer;
let font;
let fontsize = 56;
let prevNumClouds = -1; // Set negative so program can use range 0 <= i <= n
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
    cursor(CROSS);

    // Load instructions image
    instructionsImage = loadImage('static/instructions.png');

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
    instructionsImage = loadImage('static/instructions.png');
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
 * Check if the user has paused, unpaused, restarted, or continued.
 */
function keyPressed() {
    if (keyCode === UP_ARROW && isCreativeSpaceEnabled) { // Pause
        if (!isPaused) { // Pause
            isPaused = true;
            cursor(CROSS);
        } else { // Unpause
            drawStrokeLayer.clear(); // Clear the drawing buffer of previous writing
            isPaused = false;
            noCursor(); // Disable cursor to emphasize mouse trail
        }
    } else if (keyCode === 32 && !isCreativeSpaceEnabled) { // Continue
        isCreativeSpaceEnabled = true;
        noCursor(); // Disable cursor to emphasize mouse trail
    } else if (key === 'r' && isCreativeSpaceEnabled) { // Restart
        // Reset states of non-static global variables
        clouds = [];
        currLinePoints = [];
        strokeTrail = [];
        isPaused = false;
        isDrawing = false;
        isCreativeSpaceEnabled = false;

        refreshGraphicsLayers();
        cursor(CROSS);
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

    // Center text near top of window, where underscores hold user scribble
    text("Look! It's a __________", innerWidth / 2, innerHeight / 10);
}


/**
 * Scatter Clouds off the screen when the user double clicks the mouse.
 */
function doubleClicked() {
    if (!isPaused && isCreativeSpaceEnabled) {
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
}


/**
 * Draw and store the line coordinates of every mouse drag.
 */
function mouseDragged() {
    if (!isPaused && isCreativeSpaceEnabled) { // Only draw if user has allowed movement
        isDrawing = true;

        // Set properties of Cloud's golden outline
        drawStrokeLayer.strokeWeight(2);
        drawStrokeLayer.stroke(255, 215, 0);

        // Add resistance against the user's intended Cloud drawing
        let offset = random(-DRAWING_RESISTANCE, DRAWING_RESISTANCE);

        // Form line by connecting previous mouse coordinates and create a
        // temporary golden outline of the Cloud
        drawStrokeLayer.line(pmouseX, pmouseY, mouseX, mouseY);
        currLinePoints.push([mouseX + offset, mouseY + offset]);
    } else if (isCreativeSpaceEnabled) {
        // Set properties of handwriting scribble during pause
        drawStrokeLayer.stroke(0, 0, 0);
        drawStrokeLayer.strokeWeight(4);
        // Draw the handwriting scribble
        drawStrokeLayer.line(pmouseX, pmouseY, mouseX, mouseY);
    }
}


/**
 * Create a Cloud using stored line coordinates upon mouse drag completion.
 */
function mouseReleased() {
    // Only create Cloud if one was drawn (omit single mouse presses)
    if (isDrawing && !isPaused && isCreativeSpaceEnabled) {
        isDrawing = false;
        clouds.push(new Cloud(currLinePoints)); // Create Cloud
        currLinePoints = []; // Reset line coordinates for next Cloud
        drawStrokeLayer.clear(); // Clear the drawing buffer
    }
}


/**
 * Display the instructions image at the start and whenever creative
 * space is reset.
 */
function displayInstructions() {
    imageMode(CENTER);

    // Test new height if width is 75% of window width according to aspect ratio
    let newHeight = ((innerWidth * 0.75) / instructionsImage.width)
        * instructionsImage.height;

    // Resize image according to height if overflow
    if (newHeight > innerHeight) {
        instructionsImage.resize(0, innerHeight * 0.75);
    } else { // Otherwise, resize image according to width
        instructionsImage.resize(innerWidth * 0.75, 0);
    }
    image(instructionsImage, innerWidth / 2, innerHeight / 2);
}


/**
 * Draw the sky gradient and Clouds every frame.
 */
function draw() {
    clear(); // Clear the background
    displaySkyGradient();
    imageMode(CORNER);
    image(skyLayer, 0, 0);

    // Show the instructions until the user continues to creative space
    if (!isCreativeSpaceEnabled) {
        displayInstructions();
    } else { // User has continued to creative space
        // Display sky buffer first, starting at top left
        image(skyLayer, 0, 0);

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

        // Display draw stroke buffer last
        image(drawStrokeLayer, 0, 0);

        // Enable cursor, show pause text, and clear stroke trail when paused
        if (isPaused) {
            displayPauseText();
            strokeTrail = [];
        } else {
            drawStrokeTrail(); // Add a trail to the cursor movement when unpaused
        }
    }
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
        circle(currCoords[0], currCoords[1], i / 8);
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

    // Only redraw sky gradient if window resized or num Clouds has changed
    if (is_window_resized || numClouds !== prevNumClouds) {
        prevNumClouds = numClouds;
        skyLayer.clear(); // Clear the sky buffer

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
}


/**
 * Determine if a Cloud is outside of the window bounds. Use center point and
 * half padding to ensure that Cloud is fully off the screen before being
 * removed. In the worst case, the cloud is as big as the window, and thus
 * its center point must pass padding measured to be half the window's width or
 * height outside the visible area.
 * 
 * @param {Cloud} cloud the Cloud to analyze.
 * @returns true if Cloud within bounds, false otherwise.
 */
function checkCloudBounds(cloud) {
    [xCoord, yCoord] = cloud.getCenterCoord();

    // Half padding around window bounds
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
 * @param {Cloud} cloud the Cloud to analyze.
 * @returns true if Cloud is fully transparent, false otherwise.
 */
function checkTransparency(cloud) {
    if (cloud.transparency <= 0) {
        return false;
    } else {
        return true;
    }
}
