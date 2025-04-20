const Game = function () { // a "catch me 10 times" mini game
    this.isStart = false;
    this.startAt = 0;
    this.gameStart = false;
    this.x = 0;
    this.y = 0;
    this.px = 0;
    this.py = 0;
    this.timer = null;
    this.catchTimes = 0;
    this.totalTimes = 10;

    this.start = function() {
        this.gameStart = true;
        this.startAt = new Date();
        this.catchTimes = 0;
        this.totalTimes = 10;
        document.getElementById("back-to-top").style.backgroundColor = "aqua";
    };

    this.newPose = function() { // generate a new random position for "back to top" button
        let maxWidth = window.innerWidth - 140;
        let maxHeight = window.innerHeight - 140;
        let x = Math.floor(Math.random() * maxWidth) + 70;
        let y = Math.floor(Math.random() * maxHeight) + 70;
        if (this.px > 0 || this.py > 0) {
            let d2 = (x - this.px) ** 2 + (y - this.py) ** 2; // distance square
            while (d2 < 4900) { // loop generate new position, until the new position has >= minimum distance to previous position
                x = Math.floor(Math.random() * maxWidth) + 70;
                y = Math.floor(Math.random() * maxHeight) + 70;
                d2 = (x - this.px) ** 2 + (y - this.py) ** 2;
            }
        }
        this.px = x;
        this.py = y;
        const mouse = document.getElementById("back-to-top");
        mouse.style.left = x + "px"; // set new x
        mouse.style.top = y + "px"; // set new y
    };

    this.check = function() {
        let t = Math.abs(new Date() - game.startAt) / 1000;
        if (game.catchTimes >= game.totalTimes) { // catch more than 10 times
            game.over();
            document.getElementById("message").innerText = "You win!";
            document.getElementById("game-over-message").style.display = "block";
        } else if (t >= 1) { // not catch up, more than 1 second
            game.over();
            document.getElementById("message").innerText = "You lose!";
            document.getElementById("game-over-message").style.display = "block";
        }
    };

    this.over = function() { // clean and reinit values
        const mouse = document.getElementById("back-to-top");
        mouse.style.left = "";
        mouse.style.top = "";
        mouse.style.backgroundColor = "";
        this.isStart = false;
        this.gameStart = false;
        if (this.timer) {
            clearInterval(this.timer);
        }
    };

    this.checkMouse = function() { // check mouse hover time
        const topButton = document.getElementById("back-to-top");
        if (topButton.matches(":hover")) {
            let seconds = Math.abs(new Date() - game.startAt) / 1000;
            if (seconds >= 2) { // more than 2 seconds will trigger prompt for the mini game
                const prompt = document.getElementById("play-game-prompt");
                prompt.style.display = "block";
                this.isStart = false;
                if (this.timer) {
                    clearInterval(this.timer);
                }
            }
        }
    };
}

let game = new Game();
let timer = null;

document.addEventListener("DOMContentLoaded", (event) => { // bind event method after document fully loaded
    const topButton = document.getElementById("back-to-top");

    topButton.addEventListener("mouseover", function (event) {
        if (!isMobile()) { // disable mobile device mini game
            if (!game.isStart && !game.gameStart) {
                game.isStart = true;
                game.startAt = new Date();
                game.timer = setInterval(game.checkMouse, 200);
            } else if (game.gameStart) {
                game.newPose();
                game.catchTimes += 1;
                game.startAt = new Date();
                game.check();
            }
        }
    });

    topButton.addEventListener("mouseleave", function (event) {
        if (game.isStart) { // clear hover status
            game.isStart = false;
            if (game.timer) {
                clearInterval(game.timer);
            }
        }
    });

    const yesButton = document.getElementById("btn-yes");
    const noButton = document.getElementById("btn-no");
    const okButton = document.getElementById("btn-ok");

    yesButton.addEventListener("click", function (event) { // game start
        const prompt = document.getElementById("play-game-prompt");
        prompt.style.display = "none";
        game.start();
        game.newPose();
        game.timer = setInterval(game.check, 10);
    });

    noButton.addEventListener("click", function (event) { // not play
        const prompt = document.getElementById("play-game-prompt");
        prompt.style.display = "none";
    });

    okButton.addEventListener("click", function (event) { // confirm game result
        const prompt = document.getElementById("game-over-message");
        prompt.style.display = "none";
    });
});

function isMobile() { // check browser device
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}
