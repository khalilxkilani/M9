**Link to Public GitHub Repository:** [https://github.com/khalilxkilani/M9.git](https://github.com/khalilxkilani/M9.git) \
**Link to GitHub Pages Website:** [https://khalilxkilani.github.io/M9/](https://khalilxkilani.github.io/M9/) \
**Link to Demo Video:** []()

# M9: Another Kind of CC
CSCI 3725: Computational Creativity \
Khalil Kilani \
December 19, 2024

# SkySonder
A casual creator interactive system that emulates the sensation of looking up at the sky and guessing what objects the clouds resemble. In SkySonder, users draw clouds on a gradient sky background by clicking and dragging their mouse. The sky darkens as more clouds are added. The user can dissipate clouds by hovering over them or scatter them away by double clicking anywhere inside the window. Clouds remain within the window and bounce off the wall boundaries until the user is ready to share their creation. When the user is ready to share their creation, they can pause the system to freeze movement. While paused, the user can handwrite what they believe their cloud resembles and screenshot that frame to share with their peers. Afterward, the user sends their clouds off into the gradient sky background by scattering them. SkySonder also adapts to window resizing and implement performance enhancing optimizations for rendering.

***

### How to Set up and Run the Code:
* Open the [GitHub Pages Website deployment](https://khalilxkilani.github.io/M9/) in a Chrome browser window.

### Overview:
1. **What Are Your Users Casually Creating?:** SkySonder presents users with a blank sky and invites them to draw clouds.
2. **How Do You Keep Them Engaged and Excited to Create?:** SkySonder engages users by offering multiple avenues for exploration and creation. First, clouds gradually change over time, transforming just as if they were being observed in the sky. Second, the sky gradually becomes darker as the user adds more clouds and becomes lighter once the clouds are dissipated or scattered away. Third, the clouds bounce off the browser window boundaries to create a relaxing dynamic. Fourth, SkySonder includes resistance against the user's mouse cursor while they are drawing to ensure that clouds have natural shapes. Fifth, users can dissipate clouds by hovering over them, adjusting the transparency of the clouds to achieve different depth effects. Sixth, the mouse cursor emits a golden trail to emulate stars dotting the sky.
3. **How Do You Help Them Make Something They Are Proud to Share?:** Throughout the drawing phase, the clouds naturally form into new shapes. As such, SkySonder invites the user to think creatively about what their cloud could resemble, which may be somethind different than what they originally intended. When the user pauses the system and is ready to share their creation, text appears stating: "Look! It's a ________." In the blank space, the user can write what they believe their cloud most closely resembles. They can screenshot this frame and share it with their peers. After creating their clouds, the user sends them off into the gradient sky background by double clicking their mouse to scatter them. 

### Personal Meaning
My idea for SkySonder originates from the joy I find from sitting on a park bench and staring at the sky. Every so often I can catch a glimpse of a cardinal, my favorite bird to spot, or find a cloud that I like to imagine as my relatives watching over me. My culture also emphasizes the sky, as I have grown up reciting Quranic verses that mention it, and it has been ingrained in me to say certain prayers if there is a full moon. Despite this, I often view clouds as a metaphor for adversity and find that I cannot wait until the clear, blue sky returns after rainy days. Through this project, I have learned to alter this viewpoint, seeing cloudy days and their corresponding gloominess as something beautiful rather than something to merely tolerate.

### Challenging Myself
I challenged myself on this project by continuously taking risks. I first approached this project with the ideas of calligraphy and cairn stones. I devoted time to learning about the drawing and physics libraries for p5.js before eventually honing my goals to create SkySonder. Although I began this project by programming in Processing, I soon realized that I wanted to utilize more powerful tools and learn p5.js. Despite not having any experience with JavaScript prior to taking CSCI 3725, I now prefer it to other languages and have made it a priority in this project to practice it and build off my progress from M7.

A significant technical challenge was managing performance. I improved performance by adding boundaries that mark when clouds should stop being rendered, only redrawing the gradient sky background when it is modified, and implementing the system using three buffer layers. Another technical challenge was handling window resizing for the instructions image. I pushed myself to handle this detail because I wanted the experience to be as smooth as possible for the user, even if it is a feature that would not receive much use. To ensure that the image does not stretch, I calculated how to keep its aspect ratio while ensuring that no part of it is clipped. Additionally, I used copies of the image to avoid accumulating blurriness from multiple resizing operations. Lastly, I also drew the image for the instruction screen on my iPad and even added small details like a sun favicon to the browser tab.

### Known Bug
When the user begins drawing and then moves their cursor out of the browser window before releasing their mouse click, the drawn cloud overlaps with the window boundaries and sticks to them rather than bouncing off. This was not a last-minute bug but rather something that I researched extensively and made multiple attempts at fixing. After much debugging, I decided it would be best to develop other features and return to this issue as a future goal.

### Sources:
**Processing Documentation:**
* [Processing Reference](https://processing.org/reference) on Processing.
* [p5.js Reference](https://p5js.org/reference/) on p5.js.
* [Drawing Lines Example](https://p5js.org/examples/animation-and-variables-drawing-lines/) on p5.js.
* [Create Graphics Example](https://p5js.org/examples/advanced-canvas-rendering-create-graphics/) on p5.js.
* [Creating and Styling HTML Tutorial](https://p5js.org/tutorials/creating-styling-html/) on p5.js.
* [Color Gradients Tutorial](https://p5js.org/tutorials/color-gradients/) by Jules Kris and Tristan Bunn on p5.js.

**YouTube:**
* [Hosting a p5.js Sketch with Github Pages](https://youtu.be/ZneWjyn18e8?feature=shared) by The Coding Train on YouTube.
* [2.6: createGraphics() - p5.js Tutorial](https://youtu.be/TaluaAD9MKA?si=-PxropzQQv_ftfrA) by The Coding Train on YouTube.
* [p5.js | 5 minute challenge | Mouse Trail](https://youtu.be/jiwg4H8a3fI?feature=shared) by The Coding Kid on YouTube.
* [How to Make Objects Bounce Off Walls in the p5.js Programming Language](https://youtu.be/Kp070rI_G48?feature=shared) by Jason Erdreich on YouTube.

**Miscellaneous:**
* [p5.collide2D Library](https://github.com/bmoren/p5.collide2D.git) on GitHub.
* [Include a Processing File (.pde) in a Webpage](https://home.et.utwente.nl/slootenvanf/2017/10/03/include-processing-file-in-webpage/) on VanSlooten.
* [1.4 Draw With Mouse](https://nycdoe-cs4all.github.io/units/2/lessons/lesson_1.4) on NYC Department of Education.
* [Color Picker](https://htmlcolorcodes.com) on HTML Color Codes.
* [Sunny Icon ICO](https://www.shareicon.net/sunny-307412) on ShareIcon.
* [How to Create and Implement an HTML Favicon](https://www.dhiwise.com/post/how-to-create-and-implement-an-html-favicon) on DhiWise.
