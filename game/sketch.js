'use strict'

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

    createProjectile()
    {   
        let projectile = new Projectile(this.posX + 20, this.posY - this.heightY, PROJECTILE_SIZE, -1, .8);
        projectile.colideWithInvader = true;
        
        return projectile;
    }
}

class Invader extends MovableObject
{
    constructor(posX, posY, size)
    {
        super(posX, posY);
        this.size = size;
    }

    draw()
    {
        fill(200, 0, 0);
        circle(this.posX, this.posY, this.size);
    }

    createProjectile()
    {   
        let projectile = new Projectile(this.posX, this.posY, PROJECTILE_SIZE, 1, .8);
        projectile.collideWithShip = true;
        
        return projectile;
    }
}

class Projectile extends MovableObject
{
    constructor(posX, posY, size, dirY, speed)
    {
        super(posX, posY);
        this.size = size;
        this.dirY = Math.sign(dirY);
        this.speed = Math.abs(speed);
        this.collideWithShip = false;
        this.collideWithInvader = false;
    }

    draw()
    {
        fill(255, 255, 0);
        circle(this.posX, this.posY, this.size);
    }

    move()
    {
        this.posY += this.speed * this.dirY * deltaTime;
    }
}

const CANVAS_HEIGHT = 800;
const CANVAS_WIDTH = 800;
const TARGET_FRAME_RATE = 60;
const INVADER_SIZE = 50;
const INVADERS_SPACING = 20;
const INVADERS_ROWS = 3;
const INVADERS_COLUMNS = 10;
const INVADERS_HORIZONTAL_SPEED = .28;
const INVADERS_VERTICAL_SPEED = .1;
const PROJECTILE_SIZE = 15;
const SHOT_PERFORMED_AT_ONCE_FROM_INVADERS = 3;
const PAUSE_PETWEEN_RANDOM_SHOTS = 1000;
const PAUSE_BETWEEN_CHANGING_HORIZONTAL_DIRECTION = 3000;

var currentTime = 0;
var lastTime = 0;
var deltaTime = 0;
var timePassedFromLastRandomShot = 0;
var timePassedFromLastDirectionChanged = 0;
var currentInvadersDirection = 1;

var ship = new Ship(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50, 50, 50);
var invaders;
var projectiles = [];

function setup() 
{
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    frameRate(TARGET_FRAME_RATE);

    invaders = createInvaders();
}

function keyPressed()
{
    if(keyCode == UP_ARROW)
    {
        console.log("Shoot");
        projectiles.push(ship.createProjectile());
    }
}

function draw() 
{
    processTime();

    background(0);
    processInput();

    ship.draw();
    processInvaders();
    processCollisions();
    processProjectiles();
}

function createInvaders()
{
    let invadersArray = [];
    let invaderPos = [INVADER_SIZE, INVADER_SIZE];

    for(let column = 0; column < INVADERS_ROWS; column++)
    {
        let invadersRow = [];
        invaderPos[0] = INVADER_SIZE * 2;
        for(let row = 0; row < INVADERS_COLUMNS; row++)
        {
            invadersRow.push(new Invader(invaderPos[0], invaderPos[1], INVADER_SIZE))
            invaderPos[0] += INVADER_SIZE + INVADERS_SPACING;
        }

        invadersArray.push(invadersRow);
        invaderPos[1] += INVADER_SIZE + INVADERS_SPACING;
    }

    return invadersArray;
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

function processTime()
{
    currentTime = Date.now();            
    deltaTime = currentTime - lastTime;  
    lastTime = currentTime;

    timePassedFromLastRandomShot += deltaTime;
    timePassedFromLastDirectionChanged += deltaTime;
}

function processInvaders()
{
    let invadersLeft = 0;

    for(let column = 0; column < invaders.length; column++)
        for(let row = 0; row < invaders[column].length; row++)
        {
            invadersLeft++;
            moveInvader(invaders[column][row]);
            invaders[column][row].draw();
        }

    if(invadersLeft < 1)
    {
        win();
        return;
    }

    if(timePassedFromLastRandomShot < PAUSE_PETWEEN_RANDOM_SHOTS)
        return;

    for(let shotNumber = 0; shotNumber < SHOT_PERFORMED_AT_ONCE_FROM_INVADERS; shotNumber++)
    {
        let randomCollmn = Math.floor(Math.random() * invaders.length);
        let randomRow = Math.floor(Math.random() * invaders[randomCollmn].length);
        let invader = invaders[randomCollmn][randomRow];
        
        if(invader)
            projectiles.push(invader.createProjectile());
        
        timePassedFromLastRandomShot = 0;
    }
}

function moveInvader(invader)
{
    if(timePassedFromLastDirectionChanged > PAUSE_BETWEEN_CHANGING_HORIZONTAL_DIRECTION)
    {
        currentInvadersDirection = -currentInvadersDirection;
        timePassedFromLastDirectionChanged = 0;
    }

    invader.posX += currentInvadersDirection * INVADERS_HORIZONTAL_SPEED;
    invader.posY += INVADERS_VERTICAL_SPEED;
}

function processProjectiles()
{
    for(let i = 0; i < projectiles.length; i++)
    {
        let isProjectileOutOfScene = projectiles[i].posX < 0 
        || projectiles[i].posX > CANVAS_WIDTH
        || projectiles[i].posY < 0 
        || projectiles[i].posY > CANVAS_HEIGHT
        
        if(isProjectileOutOfScene)
        {
            projectiles.splice(i, 1);
            continue;
        }

        projectiles[i].move();
        projectiles[i].draw();
    }
}

function processCollisions()
{
    for(let projI = 0; projI < projectiles.length; projI++)
    {
        let projectile = projectiles[projI];

        if(projectile.collideWithShip)
        {
            let isProjectileCollidedWithShip = 
            checkCollisionBewtweenRectAndCircl
            (
                projectile.posX,
                projectile.posY,
                projectile.size, 
                ship.posX,
                ship.posY, 
                ship.widthX,
                ship.heightY
            );

            if(isProjectileCollidedWithShip)
            {
                loose();
                return;
            }
        }

        if(!projectile.colideWithInvader)
            continue;

        for(let column = 0; column < invaders.length; column++)
        {
            if(!projectile)
            break;

            for(let row = 0; row < invaders[column].length; row++)
            {
                let invader = invaders[column][row];

                if(!projectile)
                    break;

                let collisionDistance = projectile.size + invader.size / 2;

                if(calculateDistance(projectile.posX, projectile.posY, invader.posX, invader.posY) < collisionDistance)
                {
                    projectiles.splice(projI, 1);
                    invaders[column].splice(row, 1);
                }
            }
        }
    }
}

function checkCollisionBewtweenRectAndCircl(circPosX, circPosY, circSize, rectPosX, rectPosY, rectWidth, rectHeight)
{
    let dx = abs(circPosX - rectPosX) - rectWidth / 2;
    let dy = abs(circPosY - rectPosY) - rectHeight / 2;

    if (dx > circSize / 2 || dy > circSize / 2) 
        return false;
    if (dx <= 0 || dy <= 0) 
        return true;

    return (dx * dx + dy * dy <= Math.pow(circSize / 2, 2));
}

function calculateDistance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function loose()
{
    console.log('Loose');
}

function win()
{
    console.log('win');
}