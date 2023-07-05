
// global variables
var laserSpeed = 0.1;
var spaceShipSpeed = 20;
var enemySpeed = 1;
var enemyLaserSpeed = 0.1;
var enemyLaserInterval = 1000;
var score = 0;
var level = 1;
var currentLaser = 0;
var currentEnemyLaser = 0;
var laserReloadTime = 1000;
var isFinished = false;
var lastShootTime = 0
var userWin;
const enemyInitialPosX = 831;
const enemyInitialPosY = 95;
const shipInitialPosX = 814;
const shipInitialPosY = 600;


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
    isFinished = false;
    userWin = false;
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keydown", shootLaserFromShip);
    document.addEventListener("keyup", shipStop);
    levelTxt.textContent = "Level: " + level;
    musicPlay();
    moveEnemy();
    shootLaserFromEnemy();
    startBtn.style.display = "none";
    instruction.style.display = "none";

}

function debugging(){
    var timeInterval = setInterval(function(){
        if((500 + 10 >= shipX && 500 <= shipX + 100) &&
        (500 > shipY + 60)
    ){
        // showExplosion(500, 500, shipOrEnemy);
        allLasersEnmey[0].style.display = "none";
        isHit = true;
        console.log("hit detected");
    }

    }, 20)
}

function moveEnemy(){
    var timePass = 0;
    var timeInterval = setInterval(function(){
        if(isFinished){
            clearInterval(timeInterval);
        }
        enemyX += enemySpeed;

        if(enemyX >= 1600){
            enemyX = 0;
        }
        timePass++;
        enemyShip.style.left = enemyX + "px";


    }, 20);
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
      console.log(shipX);
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
    if(event.key === " " && (Date.now() - lastShootTime) >= laserReloadTime) {
        lastShootTime = Date.now(); 
        if(currentLaser >= allLasersShip.length - 1){
            currentLaser = 0;
        }
        getLaserPos(currentLaser, allLasersShip);
        laserMoveShip(currentLaser, allLasersShip);
        currentLaser++;
    }
    
}

function shootLaserFromEnemy(){
    var timeInterval = setInterval(function(){
        if(isFinished){
            clearInterval(timeInterval);
        }
        if(currentEnemyLaser >= allLasersShip.length - 1){
            currentEnemyLaser = 0;
        }
        getLaserPos(currentEnemyLaser, allLasersEnmey, 1);
        laserMoveShip(currentEnemyLaser, allLasersEnmey, 1);
        currentEnemyLaser++;

    }, enemyLaserInterval);
    
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
            showExplosion(x, y, shipOrEnemy);
            allLasers[index].style.display = "none";
            isHit = true;
            userWin = true;
        }
    }
    // when the laser was shot from the enemy
    else {
        
        if((x + 10 >= shipX - 30 && x <= shipX + 124) &&
        (y > shipY + 67)
        ){
            showExplosion(x, y, shipOrEnemy);
            allLasers[index].style.display = "none";
            isHit = true;
            userWin = false;
        }
    }

    if(isHit == true){
        endGame();
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
    allLasers[index].style.display = "block";
    if(soe == 1){
        var laserLoc = enemyY + 20;
        var laserX = enemyX + 30;
    } else {
        var laserLoc = shipY - 30;
        var laserX = shipX + 54;
    }
    var timePass = 1;
    var timeInterval = setInterval(function(){
        if(isFinished){
            clearInterval(timeInterval);
        }
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
    
    // triggered when either one of the ship was hit by a laser
    // shows a modal (prompt) that lets the user upgrade either their ship speed, or laser speed
    // increments level by 1
    // increases enemy's ship speed and laser speed
    // removes any event listener
    // after user answers prompt resets positions for player, enemy, and all lasers
    isFinished = true;
    document.removeEventListener("keydown", moveShip);
    document.removeEventListener("keydown", shootLaserFromShip);
    document.removeEventListener("keyup", shipStop);
    
    resetShipPos();
    
    var doContinue; 
    setTimeout(function(){
        doContinue = confirm("Do you wish to continue?");
        if(doContinue){
            if(userWin){
                askUpgrade();
                resetShipPos();
                level++;
                enemySpeed += (level * 0.5);
                enemyLaserSpeed += (level * 0.2);
                enemyLaserInterval -= 70;
            }
            else {
                resetShipPos();
                enemySpeed = 1;
                enemyLaserSpeed = 0.1;
                enemyLaserInterval = 1000;
                level = 1;
            }
            
            startGame();
        } else {
            startBtn.style.display = "block";
            level = 1;
            levelTxt.textContent = "Level: " + level;
            instruction.style.display = "block";
            musicPause();
        }
    }, 1100);
    
}

function askUpgrade(){
    var upgrade;
    upgrade = prompt("Choose upgrade\n1: Laser Speed\n2: Ship's moving speed\n3: Laser Reload Time");
    if (upgrade !== null) {
        upgrade = parseInt(upgrade);
        
        switch (upgrade) {
          case 1:
            laserSpeed += 0.5;
            break;
          case 2:
            spaceShipSpeed += 2.5;
            break;
          case 3:
            laserReloadTime -= 50;
            break;
          default:
            alert("If you ain't gonna follow the direction then no upgrade :)");
            break;
        }
      } else {
        // Handle the case when the user clicks "Cancel"
        alert("Upgrade canceled.");
      }

}

function resetShipPos(){
    spaceShip.style.transitionDuration = "0s";
    enemyShip.style.transitionDuration = "0s";
    spaceShip.style.transform = "none";


    enemyShip.style.top = enemyInitialPosY + "px";
    enemyShip.style.left = enemyInitialPosX + "px";
    enemyShip.style.display = "block";
    
    spaceShip.style.top = shipInitialPosY + "px";
    spaceShip.style.left = shipInitialPosX + "px";
    spaceShip.style.display = "block";
    
    enemyX = enemyInitialPosX;
    enemyY = enemyInitialPosY;
    shipX = shipInitialPosX;
    shipY = shipInitialPosY;

    for(var i = 0; i < allLasersShip.length; i++){
        allLasersShip[i].style.left = "-100px";
        allLasersShip[i].style.display = "none";
    }
    for(var i = 0; i < allLasersEnmey.length; i++){
        allLasersEnmey[i].style.left = "-100px";
        allLasersEnmey[i].style.display = "none";
    }

    spaceShip.style.transitionDuration = "0.3s";
    enemyShip.style.transitionDuration = "0s";
    
}

startBtn.addEventListener("click", startGame);