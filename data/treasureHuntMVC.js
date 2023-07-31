// treasure Hunt Game
let startGame = false;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const SPACE = 32;


let model = {
    boardsize: 10,
    treasures: 6,
    walls: 6,
    players: 1,
    enemies: 1,
    playerLoc: 90,
    lives: 4,
    deaths: 0,
    points: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    cron: 0,
    endscore :0,
    highscore: localStorage.getItem("highscore"), 

    generateEnemyLocation: function() {
        for (let i=1; i<=this.enemies; i++) {
        model.enemyLoc = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
        while (model.enemyLoc >= 100) {
            model.enemyLoc = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
        }
        view.displayEnemy();
    }
        this.generateWalls();
    },

    generateWalls: function() {
        let wallsLocations = [];
        for (let i=0; i<this.walls; i++) {
            let randomNumber = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
            while (randomNumber >= 100 || randomNumber == this.playerLoc || randomNumber == this.enemyLoc || wallsLocations.includes(randomNumber)) {
                randomNumber = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
            }
            wallsLocations.push(randomNumber);
        }
        view.displayWalls(wallsLocations); 
    },

    generateTreasures: function(wallsLocations) {

        let treasureLocations = new Array();
        for (let i=0; i<this.treasures; i++) {

            let randomNumber;
            let isCollision;

            do {
                isCollision = false;
                randomNumber = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
                while (randomNumber >= 100 || randomNumber == this.playerLoc || randomNumber == this.enemyLoc) {
                    randomNumber = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
            }
                if (wallsLocations.includes(randomNumber)) {
                    isCollision = true;
                }
                if (treasureLocations.includes(randomNumber)) {
                    isCollision = true;
                }
            } while (isCollision) {
                
            treasureLocations.push(randomNumber);
            }
        }
        view.displayTreasures(treasureLocations);
    },

    startTimer: function() {
        controller.pause();
        this.cron = setInterval(() => {
            this.timer();
        }, 10);
    },

    timer: function() {
        if ((this.millisecond += 10) == 1000) {
            this.millisecond = 0;
            this.second++; 
        }
        if (this.second == 60) {
            this.second = 0;
            this.minute++;
        }

        view.displayTimer();
    },

    returnData: function(input) {
        return input > 10 ? input : `0${input}`
    },

}





let view = {
    displayBoard: function() {
        let size = model.boardsize;
        let boardPlace = document.querySelector('.table');
        let table = ' ';
        let docLives = document.querySelector('.lives');
        docLives.innerHTML = model.lives;
        let docPoints = document.querySelector('.score');
        docPoints.innerHTML = model.points;


        for (i = 1; i < size; i++) {
            table += `		
            <tr>
            `
            for (j = 0; j < size; j++) {
                table += `
                <td class="grass" id="${i}${j}"></td>
                `
            }
            table += `
                </tr>
            `
        }
        boardPlace.innerHTML = table;
        this.displayPlayer();
        controller.setHighscore(); 
        document.addEventListener('keydown', controller.handleKeyDown.bind(controller));
    },

    displayPlayer: function() {
        playerLocation = document.getElementById(`${model.playerLoc}`);
        playerLocation.classList.add("player");
        model.generateEnemyLocation();
    },

    displayEnemy: function() {
        enemyLocation = document.getElementById(`${model.enemyLoc}`);
        enemyLocation.classList.add("enemy");
    },

    displayWalls: function(wallsLocations) {
        wallsLocations.forEach(wall => {
            let chosenWall = document.getElementById(`${wall}`);
            chosenWall.classList.add("wall");
        });
        model.generateTreasures(wallsLocations);
    },

    displayTreasures: function(treasureLocations) {
        treasureLocations.forEach(treasure => {
            let chosenTreasure = document.getElementById(`${treasure}`);
            chosenTreasure.classList.add("treasure");
        });
    },


    displayPoints: function() {
        document.querySelector('.score').innerHTML = model.points;
    },

    displayLives: function() {
        document.querySelector('.lives').innerHTML = model.lives;
    },

    displayPickUpTreasure: function(newPlayerLoc) {
        let currentPlayerLoc = document.getElementById(`${model.playerLoc}`);
        currentPlayerLoc.classList.remove("player");
    
        model.playerLoc = newPlayerLoc;
    
        let updatedPlayerLoc = document.getElementById(`${model.playerLoc}`);
        updatedPlayerLoc.classList.add("pickUpTreasure");
    
        controller.updatePoints();
    },

    displayDead: function(newPlayerLoc) {
        let currentPlayerLoc = document.getElementById(`${model.playerLoc}`);
        currentPlayerLoc.classList.remove("player");

        model.playerLoc = newPlayerLoc;

        let updatedPlayerLoc = document.getElementById(`${model.playerLoc}`);
        updatedPlayerLoc.classList.add("dead");
    },

    displayGrass: function(newPlayerLoc) {
        let currentPlayerLoc = document.getElementById(`${model.playerLoc}`);
        if (currentPlayerLoc.classList.contains("pickUpTreasure")) {
        currentPlayerLoc.classList.remove("pickUpTreasure");
        currentPlayerLoc.classList.remove("treasure");
            } else {
                currentPlayerLoc.classList.remove("player");
                currentPlayerLoc.classList.remove("dead");
            }
            model.playerLoc = newPlayerLoc;

        let updatedPlayerLoc = document.getElementById(`${model.playerLoc}`);
        updatedPlayerLoc.classList.add("player");
    },

    displayNewEnemyLocation: function(newEnemyLoc) {
        let currentEnemyLoc = document.getElementById(`${model.enemyLoc}`);
        currentEnemyLoc.classList.remove("enemy");
    
        model.enemyLoc = newEnemyLoc;
    
        let newEnemyLocation = document.getElementById(`${model.enemyLoc}`);
        newEnemyLocation.classList.add("enemy");
    },

    displayHighscore: function() {
        document.querySelector('.highscore').innerHTML = localStorage.getItem('highscore');
    },

    displayTimer: function() {
        document.getElementById('minutes').innerText = model.returnData(model.minute);
        document.getElementById('seconds').innerText = model.returnData(model.second);
        document.getElementById('milliseconds').innerText = model.returnData(model.millisecond);
    },

    
}

let controller = {
    handleKeyDown: function(event) {
        const keyCode = event.keyCode;
        if (startGame == true) {
        switch (keyCode) {
            case KEY_UP:
                this.movePlayer(-model.boardsize);
                this.updateBoardEnemy();
                break;
            case KEY_DOWN:
                this.movePlayer(model.boardsize);
                this.updateBoardEnemy();
                break;
            case KEY_LEFT:
                this.movePlayer(-1);
                this.updateBoardEnemy();
                break;
            case KEY_RIGHT:
                this.movePlayer(1);
                this.updateBoardEnemy();
                break;
        }
    } if (keyCode == SPACE) {
                model.startTimer();
                startGame = true;
            }
    },

    movePlayer: function(offset) {
        let newPlayerLoc;

        if (model.playerLoc >= 10 && model.playerLoc < 20 && offset == -model.boardsize) {
            newPlayerLoc = model.playerLoc + ((Math.pow(model.boardsize, 2)) - (model.boardsize * 2)) 
        } else if (model.playerLoc >= 90 && model.playerLoc < 100 && offset == model.boardsize) {
            newPlayerLoc = model.playerLoc - ((Math.pow(model.boardsize, 2)) - (model.boardsize * 2))
        } else {
            newPlayerLoc = Number(model.playerLoc) + offset
        }
        controller.updateBoardPlayer(newPlayerLoc);
    },

    isValidMove: function(newPlayerLoc) {
        if (newPlayerLoc < 0 || newPlayerLoc >= (Math.pow(model.boardsize, 2))) {
            return false;
        }

        let locString = newPlayerLoc < 10 ? `0${newPlayerLoc}` : `${newPlayerLoc}`;
        let newLocation = document.getElementById(locString);
        return newLocation && !newLocation.classList.contains("wall");
    },

    updatePoints: function() {
        model.points += 10;
        view.displayPoints();
        if ((model.points) == (model.treasures * 10)) {
            controller.pause(); 
            controller.calculateScore(); 
        }
    },

    updateLives: function() {
        model.lives -= 1;
        model.deaths += 1;
        view.displayLives();
        if(model.lives == 0) {
            controller.pause(); 
            alert("YOU LOST THE GAME");
        }
    },

    updateBoardPlayer: function(newPlayerLoc) {
        if (controller.isValidMove(newPlayerLoc)) {
            let checkPlayerLoc = document.getElementById(newPlayerLoc);
            if (checkPlayerLoc.classList.contains("treasure")) {
                view.displayPickUpTreasure(newPlayerLoc);
                
            } else if (checkPlayerLoc.classList.contains("enemy")) {
                view.displayDead(newPlayerLoc);
                
            } else {
                view.displayGrass(newPlayerLoc);
                
            }
        }
    },

    updateBoardEnemy: function() {
        newEnemyLoc = model.enemyLoc;
        let unitDiff = model.enemyLoc - model.playerLoc;
        if (unitDiff < -10) {
            newEnemyLoc+=10;
        }
        if (unitDiff > 10) {
            newEnemyLoc-=10;
        }
        if (unitDiff > 0 && unitDiff < 10) {
            newEnemyLoc -= 1;
        }
        if (unitDiff < 0 && unitDiff > -10) {
            newEnemyLoc += 1;
        }
        if (unitDiff == 1 || unitDiff == 0) {
            controller.updateLives(); 
        }

        if (this.isValidMove(newEnemyLoc)) {
            view.displayNewEnemyLocation(newEnemyLoc);
        }
    },

    calculateScore: function() {
        let multiplier = 1;
      
        switch (true) {
          case (model.second >= 0 && model.second <= 2):
            multiplier = 2;
            break;
          case (model.second >= 2 && model.second <= 3):
            multiplier = 1.8;
            break;
          case (model.second >= 3 && model.second <= 4):
            multiplier = 1.6;
            break;
          case (model.second >= 4 && model.second <= 5):
            multiplier = 1.35;
            break;
          case (model.second >= 5 && model.second <= 6):
            multiplier = 1.3;
            break;
          case (model.second >= 6 && model.second <= 7):
            multiplier = 1.25;
            break;
          default:
            multiplier = 1;
        }
      
        model.points = Math.round(model.points * multiplier - model.deaths * 15);
        this.setHighscore(model.points);
        setTimeout(() => {
            alert(`your score for this game is ${model.points}, you had 
            ${model.lives} lives left, your all time highscore is
        ${localStorage.getItem('highscore')}`);
        }, 2000);
    },

    setHighscore: function(points) {
        if(localStorage.getItem("highscore")) {
            if (points > model.highscore) {
                localStorage.setItem("highscore", model.points);
            }
        } else {
            localStorage.setItem("highscore", model.points);
        }
        view.displayHighscore();
    },

    pause: function() {
        clearInterval(model.cron);
    },

}


view.displayBoard();
alert('Press the Spacebar to begin after clicking OK');


