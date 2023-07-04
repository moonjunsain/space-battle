
// global variables
var laserSpeed = 0.1;
var spaceShipSpeed = 10;
var enemySpeed = 1;
var enemyLaserSpeed = 0.1;
var score = 0;
var level = 1;
var currentLaser = 0;
var currentEnemyLaser = 0;

// Creating lasers
var lasers = document.querySelector("#laserSec");
for(var i = 0; i < 100; i++){
    let laser = document.createElement("img");
    laser.src = "./assets/image/laser.png";
    lasers.appendChild(laser);
}
var allLasersShip = lasers.querySelectorAll("img");
var laserX = 0;
var laserY = 0;

// positioning space ship
var spaceShip = document.querySelector("#ship");
var shipX = 814;
var shipY = 600;

// positioning enemy
var enemyShip = document.querySelector("#enemy");
var enemyX = 831;
var enemyY = 95;

// Creating lasers for enemy
var enemyLasers = document.querySelector("#enemyLaserSec");
for(var i = 0; i < 100; i++){
    let laser = document.createElement("img");
    laser.src = "./assets/image/laser.png";
    enemyLasers.appendChild(laser);
}
var allLasersEnmey = enemyLasers.querySelectorAll("img");
var eLaserX = enemyX + 30;
var eLaserY = enemyY + 20;

// explosion
var explosion = document.querySelector("#explosion");
var explX = 0;
var explY = 0;

// audio music
var music = document.querySelector("#serious");
function musicPlay(){
    music.play();
}
function musicPause(){
    music.pause();
}

// start button
var startBtn = document.querySelector("#playBtn");

// instruction
var instruction = document.querySelector("#instructions");

// level
var levelTxt = document.querySelector("#level");

function startGame(){
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keydown", shootLaserFromShip);
    document.addEventListener("keyup", shipStop);
    musicPlay();
    // moveEnemy();
    shootLaserFromEnemy();
    startBtn.style.display = "none";
    instruction.style.display = "none";

}

function moveEnemy(){
    var timePass = 0;
    var timeInterval = setInterval(function(){
        enemyX += timePass + enemySpeed;
        // once enemy reaches the end of screen(right)
        if(enemyX >= 1600){
            enemyX = 0;
        } 
        // once enemy reaches the end of left screen
        else if (enemyX <= 0){
            enemyX = 1600
        }
        timePass++;
        enemyShip.style.top = enemyX + "px";


    }, 50);
}

function moveShip(event){
    spaceShip.style.transitionDuration = "0.1s"; 
    switch (event.key) {
        case "ArrowUp":
            shipY -= spaceShipSpeed;
            spaceShip.style.transform = "skew(0, -10deg)"
          break;
        case "ArrowDown":
            if(shipY <= 600){
                shipY += spaceShipSpeed;
                spaceShip.style.transform = "skew(0, 10deg)"
            }
          break;
        case "ArrowLeft":
            if(shipX >= 0){
                shipX -= spaceShipSpeed;
                spaceShip.style.transform = "skew(10deg)";
            }
          break;
        case "ArrowRight":
            if(shipX <= 1500){
                shipX += spaceShipSpeed;
                spaceShip.style.transform = "skew(-10deg)";
            }
          break;
      }

      spaceShip.style.left = shipX + "px";
      spaceShip.style.top = shipY + "px";
}

function getLaserPos(index, allLasers, soe = 0){
    if(soe == 0){
        allLasers[index].style.top = (shipY - 7) + "px";
        allLasers[index].style.left = (shipX + 54) + "px";
        allLasers[index].style.display = "block"
    } else {
        allLasers[index].style.top = (enemyY + 20) + "px";
        allLasers[index].style.left = (enemyX + 30) + "px";
        allLasers[index].style.display = "block"
    }
}

function shootLaserFromShip(event){
    if(event.key == " "){
        if(currentLaser >= allLasersShip.length - 1){
            currentLaser = 0;
        }
        getLaserPos(currentLaser, allLasersShip);
        laserMoveShip(currentLaser, allLasersShip);
        currentLaser++;
        console.log("reached index: " + currentLaser);
    }
}

function shootLaserFromEnemy(){
    var timeInterval = setInterval(function(){
        if(currentEnemyLaser >= allLasersShip.length - 1){
            currentEnemyLaser = 0;
        }
        getLaserPos(currentEnemyLaser, allLasersEnmey, 1);
        laserMoveShip(currentEnemyLaser, allLasersEnmey, 1);
        currentEnemyLaser++;

    }, 1000)
    
}

function detectHit(x, y, shipOrEnemy, index, allLasers){
    var isHit = false
    // x is laser's x
    // y is laser's y
    // when the laser was shot from the player
    if(shipOrEnemy == 0){
        if((x + 10 >= enemyX && x <= enemyX + 100) &&
            (y + 80 < enemyY)
        ){
            alert("laser hit");
            showExplosion(x, y, shipOrEnemy);
            allLasers[index].style.display = "none";
            isHit = true;
        }
    }
    // when the laser was shot from the enemy
    else {
        if((x + 10 >= shipX && x <= shipX + 100) &&
            (y > shipY + 60)
        ){
            alert("laser hit");
            showExplosion(x, y, shipOrEnemy);
            allLasers[index].style.display = "none";
            isHit = true;
        }
    }

    return isHit;
}

function showExplosion(x, y, shipOrEnemy){
    explX = x;
    explY = y;
    if(shipOrEnemy == 0){
        // when the enemy got hit
        enemyShip.style.display = "none";
    }
    if(shipOrEnemy == 1){
        // when the player got hit
        spaceShip.style.display = "none";
    }
    explosion.style.display = "block";
    explosion.style.left = x + "px";
    explosion.style.top = y + "px";
    setTimeout(function(){
        explosion.style.display = "none";
    },700)
}

function laserMoveShip(index, allLasers, soe = 0){
    var laserLoc = shipY - 30;
    var laserX = shipX + 54;
    if(soe == 1){
        laserLoc = enemyY + 20;
        laserX = eLaserX + 30;
    }
    var timePass = 1;
    var timeInterval = setInterval(function(){
            if(laserLoc <= -100 || (laserLoc >= 780 && soe == 1)){
                clearInterval(timeInterval);
                allLasers[index].style.display = "none";
            }
            if(soe == 0){
                laserLoc -= laserSpeed + timePass;
            } else {
                laserLoc += enemyLaserSpeed + timePass;
            }
            timePass++;
            allLasers[index].style.top = laserLoc + "px";
            if(detectHit(laserX, laserLoc, soe, index, allLasers)){
                clearInterval(timeInterval);
            }
        
    }, 20)
}

function shipStop(){
    spaceShip.style.transform = "none";
    spaceShip.style.transitionDuration = "0.3s";
}

function endGame(){
    // triggered either one of the ship was hit by a laser
    // shows a modal (prompt) that lets the user upgrade either their ship speed, or laser speed
    // increments level by 1
    // increases enemy's ship speed and laser speed
    // removes any event listener
    // 
}

startBtn.addEventListener("click", startGame);