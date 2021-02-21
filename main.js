document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector("#pacman");
    const scoreDisplay = document.querySelector(".score");
    const width = 19;
    let score = 0;
    let power = false;

    const map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 3, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 3, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0],
        [4, 4, 4, 0, 1, 0, 4, 4, 4, 2, 4, 4, 4, 0, 1, 0, 4, 4, 4],
        [0, 0, 0, 0, 1, 0, 4, 0, 0, 4, 0, 0, 4, 0, 1, 0, 0, 0, 0],
        [4, 4, 4, 4, 1, 4, 4, 0, 2, 2, 2, 0, 4, 4, 1, 4, 4, 4, 4],
        [0, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0],
        [4, 4, 4, 0, 1, 0, 4, 4, 4, 4, 4, 4, 4, 0, 1, 0, 4, 4, 4],
        [0, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 0, 4, 0, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
        [0, 3, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 3, 0],
        [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    // 0 = WALL
    // 1 = DOT
    // 2 = PHANTOM
    // 3 = POWER-PELLET
    // 4 = EMPTY

    // Create the map
    let rows = [];
    let squares = [];

    function createMap() {
        for (let i = 0; i < map.length; i++) {
            const row = document.createElement("div");
            grid.appendChild(row);
            row.classList.add("row")
            for (let j = 0; j < map[i].length; j++) {
                const square = document.createElement("div");
                row.appendChild(square);
                squares.push(square);
                if (map[i][j] == 0) {
                    squares[j].classList.add("wall")
                }
                else if (map[i][j] == 1) {
                    squares[j].classList.add("pac-dot")
                }
                else if (map[i][j] == 2) {
                    squares[j].classList.add("phantom")
                }
                else if (map[i][j] == 3) {
                    squares[j].classList.add("power-pellet")
                }
            }
            squares.forEach(element => {
                rows.push(element);
            });
            squares.splice(0);
        }
    }
    createMap();
    function removeMap() {
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }
    }
    function resetMap() {
        removeMap();
        rows.splice(0);
        createMap();
        spawn();
        score = 0;
        scoreDisplay.innerHTML = "SCORE : " + score;
    }

    // Spawn The Player
    let spawnPos;
    function spawn() {
        spawnPos = 237;
        rows[spawnPos].classList.add("pacman");
    }
    spawn();

    document.addEventListener("keyup", controls);

    let directionDOWN = [+width, spawnPos + width < width * (width + 3)];
    let directionLEFT = [-1, spawnPos % width !== 0];
    let directionRIGHT = [+ 1, spawnPos % width < width - 1];
    let directionUP = [-width, spawnPos - width >= 0];
    let direction = directionLEFT;

    // MOVE UNTIL THERE'S A WALL
    let timerMove = setInterval(movePlayer, 250);
    let previousDir;

    function controls(event) {
        if (event != undefined) {
            switch (event.which) {
                case 37:
                    if (directionLEFT[1] && !rows[spawnPos + directionLEFT[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionLEFT;
                        if (direction != previousDir) {
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 250);
                        }
                    }
                    // // IF c'est la sortie de gauche
                    // if (spawnPos == 190) {
                    //     spawnPos = 208
                    // }
                    // // IF c'est un phantom
                    // if (rows[spawnPos].classList.contains("phantom") && power == false) {
                    //     alert("YOU ARE DEAD");
                    //     resetMap();
                    // }
                    break;
                case 38:
                    if (directionUP[1] && !rows[spawnPos + directionUP[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionUP;
                        if (direction != previousDir) {
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 250);
                        }
                    }
                    // // IF c'est un phantom
                    // if (rows[spawnPos].classList.contains("phantom") && power == false) {
                    //     alert("YOU ARE DEAD");
                    //     resetMap();
                    // }
                    break;
                case 39:
                    if (directionRIGHT[1] && !rows[spawnPos + directionRIGHT[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionRIGHT;
                        if (direction != previousDir) {
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 250);
                        }
                    }
                    //     // IF c'est la sortie de droite
                    //     if (spawnPos == 208) {
                    //         spawnPos = 190
                    //     }
                    //     // IF c'est un phantom
                    //     if (rows[spawnPos].classList.contains("phantom") && power == false) {
                    //         alert("YOU ARE DEAD");
                    //         resetMap();
                    //     }
                    break;
                case 40:
                    if (directionDOWN[1] && !rows[spawnPos + directionDOWN[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionDOWN;
                        if (direction != previousDir) {
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 250);
                        }
                    }
                    //     // IF c'est un phantom
                    //     if (rows[spawnPos].classList.contains("phantom") && power == false) {
                    //         alert("YOU ARE DEAD");
                    //         resetMap();
                    //     }
                    break;
            }
        }
    }

    function movePlayer() {
        rows[spawnPos].classList.remove("pacman");

        if (direction[1] && !rows[spawnPos + direction[0]].classList.contains("wall")) {
            spawnPos += direction[0];
        }
        if (rows[spawnPos + direction[0]].classList.contains("wall")) {
            stopMove();
        }

        dotEaten();
        powerEaten();
        phantomsEaten();
        phantomsScared();
        win();

        rows[spawnPos].classList.add("pacman");
    }

    function stopMove() {
        clearInterval(timerMove);
    }

    // Score by dot eaten
    function dotEaten() {
        if (rows[spawnPos].classList.contains("pac-dot")) {
            score++;
            scoreDisplay.innerHTML = "SCORE : " + score;
            rows[spawnPos].classList.remove("pac-dot")
        }
    }

    // Power-Pellet boolean
    let timer;
    function powerEaten() {
        if (rows[spawnPos].classList.contains("power-pellet")) {
            rows[spawnPos].classList.remove("power-pellet");
            score += 10;
            scoreDisplay.innerHTML = "SCORE : " + score;
            if (power == true) {
                clearTimeout(timer);
                timer = setTimeout(outOfPower, 5000);
            }
            else {
                power = true;
                timer = setTimeout(outOfPower, 5000);
            }
        }
    }
    function outOfPower() {
        power = false;
    }

    // Phantoms eaten
    function phantomsEaten() {
        if (rows[spawnPos].classList.contains("phantom") && power == true) {
            score += 15;
            scoreDisplay.innerHTML = "SCORE : " + score;
            rows[spawnPos].classList.remove("phantom")
        }
    }

    let phantoms = document.querySelectorAll(".phantom");
    function phantomsScared() {
        if (power == true) {
            phantoms.forEach(element => {
                // Add class scared
                element.style.backgroundColor = "lightblue";
            });
        }
        else {
            phantoms.forEach(element => {
                // Remove class scared
                element.style.backgroundColor = "red";
            });
        }
    }

    // WINS
    function win() {
        // if (score == 193) {
        //     alert("WINS");
        //     resetMap();
        // }
        let i = 418;
        rows.forEach(element => {
            if (element.classList.contains("pac-dot") || element.classList.contains("power-pellet")) {
                i++
            }
            else {
                i--
            }
            if (i == 0) {
                alert("WINS");
                resetMap();
            }
        });
    }
})

// https://www.youtube.com/watch?v=CeUGlSl2i4Q

// https://www.youtube.com/watch?v=wRcR4y7Z2MM

// https://www.youtube.com/watch?v=9TcU2C1AACw


// ----------------------------------------------------------------------------------------
// https://github.com/weibenfalk/vanilla-js-pacman/tree/master/js-pacman-FINISHED
// https://www.youtube.com/watch?v=YBtzzVwrTeE&ab_channel=TraversyMedia
// ----------------------------------------------------------------------------------------
