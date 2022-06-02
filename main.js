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
        [0, 0, 0, 0, 1, 0, 4, 0, 0, 5, 0, 0, 4, 0, 1, 0, 0, 0, 0],
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
    // 2 = GHOST
    // 3 = POWER-PELLET
    // 4 = EMPTY
    // 5 = ghostSpawn

    // Create the map
    let rows = [];
    let squares = [];
    let gridPos = [];
    let ghost = [
        "red",
        "blue",
        "orange",
        "pink",
    ];
    let k = 0;

    function createMap() {
        let jTemp = 0;
        for (let i = 0; i < map.length; i++) {
            const row = document.createElement("div");
            grid.appendChild(row);
            row.classList.add("row")
            for (let j = 0; j < map[i].length; j++) {
                const square = document.createElement("div");
                row.appendChild(square);
                squares.push(square);
                gridPos[i + j + jTemp] = [];
                gridPos[i + j + jTemp].x = j;
                gridPos[i + j + jTemp].y = i;
                if (map[i][j] == 0) {
                    square.classList.add("wall");
                }
                else if (map[i][j] == 1) {
                    square.classList.add("pac-dot");
                }
                else if (map[i][j] == 2) {
                    square.classList.add("ghost");
                    square.classList.add(ghost[k]);
                    k++;
                }
                else if (map[i][j] == 3) {
                    square.classList.add("power-pellet");
                }
                else if (map[i][j] == 5) {
                    square.classList.add("ghostSpawn");
                }
            }
            squares.forEach(element => {
                rows.push(element);
            });
            squares.splice(0);
            jTemp += 18;
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
    let timerMove = setInterval(movePlayer, 200);
    let previousDir;
    let dirTemp = direction;

    function controls(event) {
        if (event != undefined) {
            switch (event.which) {
                case 37:
                    if (directionLEFT[1] && !rows[spawnPos + directionLEFT[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionLEFT;
                        if (direction != previousDir) {
                            dirTemp = direction;
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 200);
                        }
                    }
                    else {
                        dirTemp = directionLEFT;
                    }
                    // // IF c'est un ghost
                    // if (rows[spawnPos].classList.contains("ghost") && power == false) {
                    //     alert("YOU ARE DEAD");
                    //     resetMap();
                    // }
                    break;
                case 38:
                    if (directionUP[1] && !rows[spawnPos + directionUP[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionUP;
                        if (direction != previousDir) {
                            dirTemp = direction;
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 200);
                        }
                    }
                    else {
                        dirTemp = directionUP;
                    }
                    // // IF c'est un ghost
                    // if (rows[spawnPos].classList.contains("ghost") && power == false) {
                    //     alert("YOU ARE DEAD");
                    //     resetMap();
                    // }
                    break;
                case 39:
                    if (directionRIGHT[1] && !rows[spawnPos + directionRIGHT[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionRIGHT;
                        if (direction != previousDir) {
                            dirTemp = direction;
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 200);
                        }
                    }
                    else {
                        dirTemp = directionRIGHT;
                    }
                    //     // IF c'est un ghost
                    //     if (rows[spawnPos].classList.contains("ghost") && power == false) {
                    //         alert("YOU ARE DEAD");
                    //         resetMap();
                    //     }
                    break;
                case 40:
                    if (directionDOWN[1] && !rows[spawnPos + directionDOWN[0]].classList.contains("wall")) {
                        previousDir = direction;
                        direction = directionDOWN;
                        if (direction != previousDir) {
                            dirTemp = direction;
                            clearInterval(timerMove);
                            timerMove = setInterval(movePlayer, 200);
                        }
                    }
                    else {
                        dirTemp = directionDOWN;
                    }
                    //     // IF c'est un ghost
                    //     if (rows[spawnPos].classList.contains("ghost") && power == false) {
                    //         alert("YOU ARE DEAD");
                    //         resetMap();
                    //     }
                    break;
            }
        }
    }

    function movePlayer() {
        rows[spawnPos].classList.remove("pacman");

        // Teleportations 
        if (spawnPos == 190 && direction == directionLEFT) {
            spawnPos = 209
        }
        else if (spawnPos == 208 && direction == directionRIGHT) {
            spawnPos = 189
        }

        // MOVES
        // If direction change then clearInterval && reset Interval with new direction && if no wall next
        if (dirTemp[1] && !rows[spawnPos + dirTemp[0]].classList.contains("wall") && direction != dirTemp) {
            spawnPos += dirTemp[0];
            clearInterval(timerMove);
            timerMove = setInterval(movePlayer, 200);
            direction = dirTemp;
        }
        // if no wall next
        else if (direction[1] && !rows[spawnPos + direction[0]].classList.contains("wall")) {
            spawnPos += direction[0];
            clearInterval(timerMove);
            timerMove = setInterval(movePlayer, 200);
        }

        dotEaten();
        powerEaten();
        ghostEaten();
        ghostScared();
        win();

        rows[spawnPos].classList.add("pacman");
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

    // ghosts eaten
    function ghostEaten() {
        if (rows[spawnPos].classList.contains("ghost") && power == true) {
            score += 15;
            scoreDisplay.innerHTML = "SCORE : " + score;
            rows[spawnPos].className = "";
        }
    }

    let ghosts = document.querySelectorAll(".ghost");
    function ghostScared() {
        if (power == true) {
            ghosts.forEach(element => {
                element.classList.add("ghostScared")
            });
        }
        else {
            ghosts.forEach(element => {
                element.classList.remove("ghostScared")
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
                i++;
            }
            else {
                i--;
            }
            if (i == 0) {
                alert("WINS");
                resetMap();
            }
        });
    }

    let redPos = 161;
    let redDirectionDOWN = [+width, redPos + width < width * (width + 3), "down"];
    let redDirectionLEFT = [-1, redPos % width !== 0, "left"];
    let redDirectionRIGHT = [+ 1, redPos % width < width - 1, "right"];
    let redDirectionUP = [-width, redPos - width >= 0, "up"];
    let redDirection = redDirectionLEFT;
    // AI behavior
    function moveAI() {
        rows[redPos].classList.remove("ghost", "red");

        let dist1, dist2, dist3
        let wallDir = "";
        let min;
        switch (redDirection[2]) {
            case "up":
                console.log("up");
                // up, left, right

                // CHECK WALLS TO LEFT, UP & DOWN
                // NO WALL UP
                if (redDirection[1] && !rows[redPos + redDirectionUP[0]].classList.contains("wall")) {
                    dist1 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y + 1), 2)
                }
                // NO WALL LEFT
                if (redDirection[1] && !rows[redPos + redDirectionLEFT[0]].classList.contains("wall")) {
                    dist2 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x - 1), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y), 2)
                }
                // NO WALL RIGHT
                if (redDirection[1] && !rows[redPos + redDirectionRIGHT[0]].classList.contains("wall")) {
                    dist3 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x + 1), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y), 2)
                }

                if (dist1 == undefined) {
                    // console.log("dist1");
                    wallDir += "1";
                }
                if (dist2 == undefined) {
                    // console.log("dist2");
                    wallDir += "2";
                }
                if (dist3 == undefined) {
                    // console.log("dist3");
                    wallDir += "3";
                }

                switch (wallDir) {
                    case "":
                        min = Math.min(dist1, dist2, dist3);
                        break;
                    case "1":
                        min = Math.min(dist2, dist3);
                        break;
                    case "2":
                        min = Math.min(dist1, dist3);
                        break;
                    case "3":
                        min = Math.min(dist1, dist2);
                        break;
                    case "12":
                        min = dist3
                        break;
                    case "13":
                        min = dist2
                        break;
                    case "23":
                        min = dist1;
                        break;

                    default:
                        break;
                }

                // console.log(min);

                if (dist1 == dist2) {
                    // dist2 WINS (UP)
                }
                else if (dist1 == dist3) {
                    // dist1 WINS (LEFT)
                }
                else if (dist2 == dist3) {
                    // dist2 WINS (UP)
                }

                if (min == dist1) {
                    redPos += redDirectionUP[0];
                    redDirection = redDirectionUP;
                }
                else if (min == dist2) {
                    redPos += redDirectionLEFT[0];
                    redDirection = redDirectionLEFT;
                }
                else if (min == dist3) {
                    redPos += redDirectionRIGHT[0];
                    redDirection = redDirectionRIGHT;
                }

                break;

            case "left":
                // left, up, down
                console.log("left");

                // CHECK WALLS TO LEFT, UP & DOWN
                // NO WALL LEFT
                if (redDirection[1] && !rows[redPos + redDirectionLEFT[0]].classList.contains("wall")) {
                    dist1 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x - 1), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y), 2)
                }
                // NO WALL UP
                if (redDirection[1] && !rows[redPos + redDirectionUP[0]].classList.contains("wall")) {
                    dist2 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y + 1), 2)
                }
                // NO WALL DOWN
                if (redDirection[1] && !rows[redPos + redDirectionDOWN[0]].classList.contains("wall") && !rows[redPos + redDirectionDOWN[0]].classList.contains("ghostSpawn")) {
                    dist3 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y - 1), 2)
                }

                if (dist1 == undefined) {
                    // console.log("dist1");
                    wallDir += "1";
                }
                if (dist2 == undefined) {
                    // console.log("dist2");
                    wallDir += "2";
                }
                if (dist3 == undefined) {
                    // console.log("dist3");
                    wallDir += "3";
                }

                switch (wallDir) {
                    case "":
                        min = Math.min(dist1, dist2, dist3);
                        break;
                    case "1":
                        min = Math.min(dist2, dist3);
                        break;
                    case "2":
                        min = Math.min(dist1, dist3);
                        break;
                    case "3":
                        min = Math.min(dist1, dist2);
                        break;
                    case "12":
                        min = dist3
                        break;
                    case "13":
                        min = dist2
                        break;
                    case "23":
                        min = dist1;
                        break;

                    default:
                        break;
                }

                // console.log(min);

                if (dist1 == dist2) {
                    // dist2 WINS (UP)
                }
                else if (dist1 == dist3) {
                    // dist1 WINS (LEFT)
                }
                else if (dist2 == dist3) {
                    // dist2 WINS (UP)
                }

                if (min == dist1) {
                    redPos += redDirectionLEFT[0];
                    redDirection = redDirectionLEFT;
                }
                else if (min == dist2) {
                    redPos += redDirectionUP[0];
                    redDirection = redDirectionUP;
                }
                else if (min == dist3) {
                    redPos += redDirectionDOWN[0];
                    redDirection = redDirectionDOWN;
                }

                break;

            case "down":
                console.log("down");
                // down, left, right

                // NO WALL DOWN
                if (redDirection[1] && !rows[redPos + redDirectionDOWN[0]].classList.contains("wall") && !rows[redPos + redDirectionDOWN[0]].classList.contains("ghostSpawn")) {
                    dist1 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y - 1), 2)
                }
                // NO WALL LEFT
                if (redDirection[1] && !rows[redPos + redDirectionLEFT[0]].classList.contains("wall")) {
                    dist2 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x - 1), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y), 2)
                }
                // NO WALL RIGHT
                if (redDirection[1] && !rows[redPos + redDirectionRIGHT[0]].classList.contains("wall")) {
                    dist3 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x + 1), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y), 2)
                }

                if (dist1 == undefined) {
                    // console.log("dist1");
                    wallDir += "1";
                }
                if (dist2 == undefined) {
                    // console.log("dist2");
                    wallDir += "2";
                }
                if (dist3 == undefined) {
                    // console.log("dist3");
                    wallDir += "3";
                }

                switch (wallDir) {
                    case "":
                        min = Math.min(dist1, dist2, dist3);
                        break;
                    case "1":
                        min = Math.min(dist2, dist3);
                        break;
                    case "2":
                        min = Math.min(dist1, dist3);
                        break;
                    case "3":
                        min = Math.min(dist1, dist2);
                        break;
                    case "12":
                        min = dist3
                        break;
                    case "13":
                        min = dist2
                        break;
                    case "23":
                        min = dist1;
                        break;

                    default:
                        break;
                }

                // console.log(min);
                // 2, 1, 3
                if (dist1 == dist2) {
                    alert("dist2 wins")
                    // dist2 WINS (LEFT)
                }
                else if (dist1 == dist3) {
                    alert("dist3 wins")
                    // dist1 WINS (RIGHT)
                }
                else if (dist2 == dist3) {
                    alert("dist2 wins")
                    // dist2 WINS (LEFT)
                }

                if (min == dist1) {
                    redPos += redDirectionDOWN[0];
                    redDirection = redDirectionDOWN;
                }
                else if (min == dist2) {
                    redPos += redDirectionLEFT[0];
                    redDirection = redDirectionLEFT;
                }
                else if (min == dist3) {
                    redPos += redDirectionRIGHT[0];
                    redDirection = redDirectionRIGHT;
                }
                break;

            case "right":
                console.log("right");
                // right, top, down

                // CHECK WALLS TO RIGHT, UP & DOWN
                // NO WALL RIGHT
                if (redDirection[1] && !rows[redPos + redDirectionRIGHT[0]].classList.contains("wall")) {
                    dist1 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x + 1), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y), 2)
                }
                // NO WALL UP
                if (redDirection[1] && !rows[redPos + redDirectionUP[0]].classList.contains("wall")) {
                    dist2 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y + 1), 2)
                }
                // NO WALL DOWN
                if (redDirection[1] && !rows[redPos + redDirectionDOWN[0]].classList.contains("wall") && !rows[redPos + redDirectionDOWN[0]].classList.contains("ghostSpawn")) {
                    dist3 = Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y - 1), 2)
                }

                if (dist1 == undefined) {
                    // console.log("dist1");
                    wallDir += "1";
                }
                if (dist2 == undefined) {
                    // console.log("dist2");
                    wallDir += "2";
                }
                if (dist3 == undefined) {
                    // console.log("dist3");
                    wallDir += "3";
                }

                switch (wallDir) {
                    case "":
                        min = Math.min(dist1, dist2, dist3);
                        break;
                    case "1":
                        min = Math.min(dist2, dist3);
                        break;
                    case "2":
                        min = Math.min(dist1, dist3);
                        break;
                    case "3":
                        min = Math.min(dist1, dist2);
                        break;
                    case "12":
                        min = dist3
                        break;
                    case "13":
                        min = dist2
                        break;
                    case "23":
                        min = dist1;
                        break;

                    default:
                        break;
                }

                // console.log(min);

                if (dist1 == dist2) {
                    // dist2 WINS (UP)
                }
                else if (dist1 == dist3) {
                    // dist1 WINS (LEFT)
                }
                else if (dist2 == dist3) {
                    // dist2 WINS (UP)
                }

                if (min == dist1) {
                    redPos += redDirectionRIGHT[0];
                    redDirection = redDirectionRIGHT;
                }
                else if (min == dist2) {
                    redPos += redDirectionUP[0];
                    redDirection = redDirectionUP;
                }
                else if (min == dist3) {
                    redPos += redDirectionDOWN[0];
                    redDirection = redDirectionDOWN;
                }
                break;

            default:
                break;
        }

        // dist² = x² + y² 

        // IF DIST² is the same as another THEN 
        // Up, Left, Down, Right

        // if red direction == left
        // left, top or down

        // if nothing up
        // else if nothing left
        // else if nothing down
        // else if nothing right

        // console.log(Math.pow(Math.abs(gridPos[spawnPos].x - gridPos[redPos].x), 2) + Math.pow(Math.abs(gridPos[spawnPos].y - gridPos[redPos].y), 2))




        // // if (AIdirection[1] && !rows[redPos + AIdirection[0]].classList.contains("wall")) {
        // //     AIdirection[0];
        // // }
        // if (AIdirectionUP[1] && !rows[redPos + AIdirectionUP[0]].classList.contains("wall")) {
        //     redPos += AIdirectionUP[0];
        // }
        // else if (AIdirectionLEFT[1] && !rows[redPos + AIdirectionLEFT[0]].classList.contains("wall")) {
        //     redPos += AIdirectionLEFT[0];
        // }
        // else if (AIdirectionDOWN[1] && !rows[redPos + AIdirectionDOWN[0]].classList.contains("wall")) {
        //     redPos += AIdirectionDOWN[0];
        // }
        // else if (AIdirectionRIGHT[1] && !rows[redPos + AIdirectionRIGHT[0]].classList.contains("wall")) {
        //     redPos += AIdirectionRIGHT[0];
        // }

        rows[redPos].classList.add("ghost", "red");
    }
    let timerMoveAI = setInterval(moveAI, 250);
})


// https://www.youtube.com/watch?v=ataGotQ7ir8&ab_channel=RetroGameMechanicsExplained
// 4 States
// SCATTER
// CHASE
// FRIGHTENED
// EATEN

// https://www.youtube.com/watch?v=qwhXIzNrb9w&ab_channel=CodeBullet
// AI Algorithme