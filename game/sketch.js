'use strict'

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 800;
const TARGET_FRAME_RATE = 60;

var currentTime = 0;
var lastTime = 0;
var deltaTime = 0;

class MovableObject
{
    constructor(posX, posY)
    {
        this.posX = posX;
        this.posY = posY;
    }

    moveRight(speed)
    {
        this.posX += speed * deltaTime;
    }

    moveLeft(speed)
    {
        this.posX -= speed * deltaTime;
    }
}

class Ship extends MovableObject
{
    constructor(posX, posY, heightY, widthX)
    {
        super(posX, posY)

        this.heightY = heightY;
        this.widthX = widthX;
    }

    draw()
    {
        fill(0, 200, 0);
        rect(this.posX, this.posY, this.widthX, this.heightY)
    }
}

class Invader extends MovableObject
{
    constructor(posX, posY, size)
    {
        super(posX, posY)
        this.size = size;
    }

    draw()
    {
        fill(200, 0, 0);
        circle(this.posX, this.posY, this.size)
    }
}

var ship = new Ship(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50, 50, 50);

function setup() 
{
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    frameRate(TARGET_FRAME_RATE);
}
 
function processInput()
{
    if(keyIsDown(RIGHT_ARROW))
    {
        ship.moveRight(.3);
    }

    if(keyIsDown(LEFT_ARROW))
    {
        ship.moveLeft(.3);
    }
}

function draw() 
{
    currentTime = Date.now();            
    deltaTime = currentTime - lastTime;  
    lastTime = currentTime;

    background(0);
    processInput();

    ship.draw();
}