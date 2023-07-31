const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const SPACE = 32;


let model = {
    boardsize: 10,
    treasures: 6,
    walls: 10,
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


    setUpBoard: function() {
        let size = this.boardsize;
        let boardPlace = document.querySelector('.table');
        let table = ' ';
        let docLives = document.querySelector('.lives');
        docLives.innerHTML = this.lives;
        let docPoints = document.querySelector('.score');
        docPoints.innerHTML = this.points;


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
        console.log(table);
        boardPlace.innerHTML = table;
        this.generatePlayerLoc();
        this.setHighscore();
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

    },

    generatePlayerLoc: function() {
        playerLocation = document.getElementById(`${this.playerLoc}`);
        playerLocation.classList.add("player");
        this.generateEnemyLocation();
    },

    generateEnemyLocation: function() {
        for (let i=1; i<=this.enemies; i++) {
        model.enemyLoc = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
        while (model.enemyLoc >= 100) {
            model.enemyLoc = Math.floor(Math.random() * this.boardsize * this.boardsize) + 10;
        }
        enemyLocation = document.getElementById(`${this.enemyLoc}`);
        enemyLocation.classList.add("enemy");
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
            console.log(wallsLocations);
        }
        this.setWalls(wallsLocations); 
    },

    setWalls: function(wallsNumbers) {
        wallsNumbers.forEach(wall => {
            let chosenWall = document.getElementById(`${wall}`);
            chosenWall.classList.add("wall");
        });
        this.generateTreasures(wallsNumbers);
    },

    generateTreasures: function(wallsLocations) {

        let treasureLocations = new Array();
        console.log('inside other function and the wallslocations are :' + wallsLocations);
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
        this.setTreasures(treasureLocations);
        console.log(treasureLocations);
    },

    setTreasures: function(treasureLocations) {
        treasureLocations.forEach(treasure => {
            let chosenTreasure = document.getElementById(`${treasure}`);
            chosenTreasure.classList.add("treasure");
        });
    },

    handleKeyDown: function(event) {
        const keyCode = event.keyCode;
    
        // Check the arrow keys and move the player accordingly
        switch (keyCode) {
            case KEY_UP:
                this.movePlayer(-this.boardsize);
                this.moveEnemy();
                break;
            case KEY_DOWN:
                this.movePlayer(this.boardsize);
                this.moveEnemy();
                break;
            case KEY_LEFT:
                this.movePlayer(-1);
                this.moveEnemy();
                break;
            case KEY_RIGHT:
                this.movePlayer(1);
                this.moveEnemy();
                break;
            case SPACE:
                this.startTimer();
                break;
            
        }
    },

    movePlayer: function(offset) {
        let newPlayerLoc;
        if (this.playerLoc >= 10 && this.playerLoc < 20 && offset == -this.boardsize) {
            newPlayerLoc = this.playerLoc + ((this.boardsize * this.boardsize) - this.boardsize - this.boardsize);
        } else if (this.playerLoc >= 90 && this.playerLoc < 100 && offset == this.boardsize) {
            newPlayerLoc = this.playerLoc - ((this.boardsize * this.boardsize) - this.boardsize - this.boardsize);
            } else {
            newPlayerLoc = Number(this.playerLoc) + offset;
            }

        // Check if the new player location is valid
        if (this.isValidMove(newPlayerLoc)) {
            let checkPlayerLoc = document.getElementById(newPlayerLoc);
            console.log(newPlayerLoc);
            // if you're on a teasure: 
            if (checkPlayerLoc.classList.contains("treasure")) {
                const currentPlayerLoc = document.getElementById(`${this.playerLoc}`);
                currentPlayerLoc.classList.remove("player");

                this.playerLoc = newPlayerLoc;

                const newPlayerLocation = document.getElementById(`${this.playerLoc}`);
                newPlayerLocation.classList.add("pickUpTreasure");
                this.updatePoints();
                // if you're taken by the enemy:
            } else if (checkPlayerLoc.classList.contains("enemy") ) {
                const currentPlayerLoc = document.getElementById(`${this.playerLoc}`);
                currentPlayerLoc.classList.remove("player");

                this.playerLoc = newPlayerLoc;

                const newPlayerLocation = document.getElementById(`${this.playerLoc}`);
                newPlayerLocation.classList.add("dead"); 
            } else { // if none of the above:

            // Remove player class from the current location
            const currentPlayerLoc = document.getElementById(`${this.playerLoc}`);
            if (currentPlayerLoc.classList.contains("pickUpTreasure")) {
            currentPlayerLoc.classList.remove("pickUpTreasure");
            currentPlayerLoc.classList.remove("treasure");

            } else {
                currentPlayerLoc.classList.remove("player");
                currentPlayerLoc.classList.remove("dead");
            }
    
            // Update playerLoc with the new location
            this.playerLoc = newPlayerLoc;
    
            // Add player class to the new location
            const newPlayerLocation = document.getElementById(`${this.playerLoc}`);
            newPlayerLocation.classList.add("player");
            }
        }

    },

    moveEnemy: function() {
        // const newEnemyLoc = Number(this.enemyLoc) + offset;
        newEnemyLoc = this.enemyLoc;
        let unitDiff = this.enemyLoc - this.playerLoc;
        console.log(unitDiff);
        console.log("enemy loc is " + this.enemyLoc);
        console.log("player loc is " + this.playerLoc);
        console.log("unit difference is " + unitDiff);
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
            this.updateLives();
        }

        // Check if the new player location is valid
        if (this.isValidMove(newEnemyLoc)) {
            // Remove player class from the current location
            const currentEnemyLoc = document.getElementById(`${this.enemyLoc}`);
            currentEnemyLoc.classList.remove("enemy");
    
            // Update playerLoc with the new location
            this.enemyLoc = newEnemyLoc;
    
            // Add player class to the new location
            const newEnemyLocation = document.getElementById(`${this.enemyLoc}`);
            newEnemyLocation.classList.add("enemy");
        }
    },

    isValidMove: function(newUnitLoc) {
        // Check if the new player location is within the board bounds
        if (newUnitLoc < 0 || newUnitLoc >= this.boardsize * this.boardsize) {
            return false;
        }
    
        // Check if the new player location is a wall or treasure
        let locString = newUnitLoc < 10 ? `0${newUnitLoc}` : `${newUnitLoc}`;
        let newLocation = document.getElementById(locString);
        return newLocation && !newLocation.classList.contains("wall");
    },

    updatePoints: function() {
        this.points += 10;
        document.querySelector('.score').innerHTML = this.points;
        if (this.points == (this.treasures * 10)) {
            this.pause();
            this.calculateScore();
        }
    },

    updateLives: function() {
        this.lives -= 1;
        this.deaths += 1;
        document.querySelector('.lives').innerHTML = this.lives;
        if (this.lives == 0) {
            this.pause();
            alert('YOU LOST THE GAME');
        }
    },

    calculateScore: function() {
        let finalPoints;
        if (this.second <= 2 && this.second >= 1) {
            // this.points *= 1.5;
            Math.round((this.points *= 1.6));
            finalPoints = this.points  - (this.deaths * 15);
            this.setHighscore(finalPoints);
        }
        if (this.second <= 3 && this.second >= 2) {
            // this.points *= 1.5;
            Math.round((this.points *= 1.5));
            finalPoints = this.points  - (this.deaths * 15);
            this.setHighscore(finalPoints);
        }
        if (this.second <= 4 && this.second >= 3) {
            // this.points *= 1.4;
            Math.round((this.points *= 1.4));
            finalPoints = this.points  - (this.deaths * 15);
            this.setHighscore(finalPoints);
        }
        if (this.second <= 5 && this.second >= 4) {
            // this.points *= 1.35;
            Math.round((this.points *= 1.35));
            finalPoints = this.points  - (this.deaths * 15);
            this.setHighscore(finalPoints);
        }
        if (this.second <= 6 && this.second >= 5) {
            // this.points *= 1.3;
            Math.round((this.points *= 1.3));
            finalPoints = this.points  - (this.deaths * 15);
            this.setHighscore(finalPoints);
        }
        if (this.second <= 7 && this.second >= 6) {
            // this.points *= 1.25;
            Math.round((this.points *= 1.25));
            finalPoints = this.points  - (this.deaths * 15);
            this.setHighscore(finalPoints);
        } else {
            this.setHighscore(this.points);
        }
        
        setTimeout(() => {
            console.log(this.second);
            alert(`your score for this game is ${this.points}, you had 
            ${this.lives} lives left, your all time highscore is
        ${localStorage.getItem('highscore')}`);
        }, 2000);
    },

    setHighscore: function(points) {
        if(this.highscore !== null) {
            if (points > this.highscore) {
                localStorage.setItem("highscore", points);
            }
        } else {
            localStorage.setItem("highscore", points);
        }
        document.querySelector('.highscore').innerHTML = localStorage.getItem('highscore');
    },

    startTimer: function() {
        this.pause();
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

        document.getElementById('minutes').innerText = this.returnData(this.minute);
        document.getElementById('seconds').innerText = this.returnData(this.second);
        document.getElementById('milliseconds').innerText = this.returnData(this.millisecond);
    },

    returnData: function(input) {
        return input > 10 ? input : `0${input}`
    },

    pause: function() {
        clearInterval(this.cron);
    }

}


model.setUpBoard();
alert('Press the Spacebar to begin after clicking OK')