let safePipeImg, unsafePipeImg, mouseImg; // Declare the mouse image variable
let dingSound, oofSound; // Declare sound variables

// Screen properties
const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 500;

// Adjusted canvas height
const CANVAS_HEIGHT = SCREEN_HEIGHT - 25; // Updated canvas height

// Colors
const WHITE = "#FFFFFF";
const BLACK = "#000000"; // Background color
const GREY = "#808080"; // Color for the border
const BLUE = "#0000FF"; // This color will be used for fallback if no image is set

// Mouse properties (representing the player)
let mouseXPos = 100;
let mouseY = CANVAS_HEIGHT / 2; // Center mouse in the adjusted canvas height
let gravity = 0.6;
let mouseVelocity = 0;
const jumpHeight = -10;

// Pipe properties
const pipeWidth = 70;
const pipeGap = 150;
const pipeSpeed = 3;
let pipes = [];

// Score and game state
let score = 0;
let highScore = 0; // High score variable
let gameActive = true;
const safePractices = ["Strong Password", "Two-Factor Auth", "Software Updates"];
const unsafePractices = ["Phishing Link", "Weak Password", "Public Wi-Fi"];
let messageIndex = 0;

// Load images and sounds
function preload() {
  // Replace with the actual paths to your images
  safePipeImg = loadImage("GreenPipe.png"); 
  unsafePipeImg = loadImage("RedPipe.png");
  mouseImg = loadImage("Mouse.png"); // Load mouse image here
  dingSound = loadSound("ding.mp3"); // Load ding sound
  oofSound = loadSound("oof.mp3"); // Load oof sound
  backgroundSound = loadSound("prototypebackground.mp3");
}

// Set up the canvas and initial game state
function setup() {
  createCanvas(SCREEN_WIDTH, CANVAS_HEIGHT); // Create canvas with updated height
  resetGame();
  backgroundSound.loop();
}

// Reset the game
function resetGame() {
  gameActive = true;
  pipes = [];
  score = 0;
  mouseXPos = 100;
  mouseY = CANVAS_HEIGHT / 2; // Center mouse in the adjusted canvas height
  mouseVelocity = 0;
}

// Create a new pipe
function createPipe() {
  let yPosition = Math.floor(Math.random() * (CANVAS_HEIGHT - 200)) + 100;
  let safeOrUnsafe = Math.random() < 0.5 ? "safe" : "unsafe";
  let message = safeOrUnsafe === "safe" ? safePractices[messageIndex] : unsafePractices[messageIndex];
  messageIndex = (messageIndex + 1) % safePractices.length;
  return { x: SCREEN_WIDTH + pipeWidth, y: yPosition, safeOrUnsafe, message };
}

// Draw the game
function draw() {
  background(BLACK); // Keep background color black

  if (gameActive) {
    // Apply gravity and update mouse position
    mouseVelocity += gravity;
    mouseY += mouseVelocity;

    // Create new pipes
    if (pipes.length === 0 || pipes[pipes.length - 1].x < SCREEN_WIDTH - 200) {
      pipes.push(createPipe());
    }

    // Update and draw pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].x -= pipeSpeed;

      // Remove pipes that are off the screen
      if (pipes[i].x + pipeWidth < 0) {
        pipes.splice(i, 1);
        score++;
      }

      // Check for collisions
      if (
        mouseXPos + 25 > pipes[i].x &&  // Adjusted based on mouse image size
        mouseXPos - 25 < pipes[i].x + pipeWidth &&
        (mouseY < pipes[i].y || mouseY > pipes[i].y + pipeGap)
      ) {
        if (pipes[i].safeOrUnsafe === "unsafe") {
          oofSound.play(); // Play oof sound when hitting an unsafe pipe
          gameActive = false; // Game over if hit an unsafe pipe
        } else {
          score++; // Increment score for safe pipe
        }
      }

      // Draw pipes using images
      if (pipes[i].safeOrUnsafe === "safe") {
        // Draw green (safe) pipe with the safePipeImg
        image(safePipeImg, pipes[i].x, 0, pipeWidth, pipes[i].y); // Top green pipe
        image(safePipeImg, pipes[i].x, pipes[i].y + pipeGap, pipeWidth, CANVAS_HEIGHT - pipes[i].y - pipeGap); // Bottom green pipe
      } else {
        // Draw red (unsafe) pipe with the unsafePipeImg
        image(unsafePipeImg, pipes[i].x, 0, pipeWidth, pipes[i].y); // Top red pipe
        image(unsafePipeImg, pipes[i].x, pipes[i].y + pipeGap, pipeWidth, CANVAS_HEIGHT - pipes[i].y - pipeGap); // Bottom red pipe
      }

      // Draw message on the pipe
      fill(WHITE); // Change text color to white
      textSize(16);
      text(pipes[i].message, pipes[i].x + 5, pipes[i].y + pipeGap / 2 - 20);
    }

    // Draw "mouse" (the player character) using the loaded image
    image(mouseImg, mouseXPos - 25, mouseY - 25, 50, 50); // Draws image centered around mouse position

    // Draw scores at the top
    fill(WHITE); // Change score color to white
    textSize(24);
    textAlign(LEFT); // Align to the left
    text(`Score: ${score}`, 10, 30); // Current score at fixed position
    text(`High Score: ${highScore}`, 10, 60); // High score below current score

    // Update high score if current score exceeds high score
    if (score > highScore) {
      highScore = score; // Set new high score
    }

    // Check if "mouse" is out of bounds (only check if it falls off the bottom)
    if (mouseY > CANVAS_HEIGHT) {
      oofSound.play(); // Play oof sound when falling off the canvas
      gameActive = false; // Game over if out of bounds
    }
  } else {
    // Game over screen
    fill(255, 0, 0); // Red color for the "Game Over" message
    textSize(36);
    text("Game Over!", SCREEN_WIDTH / 2 - 90, CANVAS_HEIGHT / 2 - 30);
    fill(WHITE); // Change restart message color to white
    textSize(24);
    text("Click to Restart", SCREEN_WIDTH / 2 - 110, CANVAS_HEIGHT / 2 + 20);
  }
}

// Handle mouse click events for jumping and restarting
function mousePressed() {
  if (gameActive) {
    mouseVelocity = jumpHeight; // Jumping action
  } else {
    resetGame(); // Restart game
  }
}
