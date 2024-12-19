/**
 * Author: Khalil Kilani
 * Course: CSCI 3725
 * Assignment: M9 - Another Kind of CC
 * Date: December 19, 2024
 * 
 * A module representing Cloud objects. Users can interact with Clouds by
 * drawing, dissipating, or scattering them.
 */


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

        // Extract direction from assigned speed (negative or positive sign)
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
