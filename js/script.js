const Game = function () {
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

    this.newPose = function() {
        let maxWidth = window.innerWidth - 140;
        let maxHeight = window.innerHeight - 140;
        let x = Math.floor(Math.random() * maxWidth) + 70;
        let y = Math.floor(Math.random() * maxHeight) + 70;
        if (this.px > 0 || this.py > 0) {
            let d2 = (x - this.px) ** 2 + (y - this.py) ** 2;
            while (d2 < 4900) {
                x = Math.floor(Math.random() * maxWidth) + 70;
                y = Math.floor(Math.random() * maxHeight) + 70;
                d2 = (x - this.px) ** 2 + (y - this.py) ** 2;
            }
        }
        this.px = x;
        this.py = y;
        const mouse = document.getElementById("back-to-top");
        mouse.style.left = x + "px";
        mouse.style.top = y + "px";
    };

    this.check = function() {
        let t = Math.abs(new Date() - game.startAt) / 1000;
        if (game.catchTimes >= game.totalTimes) {
            game.over();
            document.getElementById("message").innerText = "You win!";
            document.getElementById("game-over-message").style.display = "block";
        } else if (t >= 1) {
            game.over();
            document.getElementById("message").innerText = "You lose!";
            document.getElementById("game-over-message").style.display = "block";
        }
    };

    this.over = function() {
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

    this.checkMouse = function() {
        const topButton = document.getElementById("back-to-top");
        if (topButton.matches(":hover")) {
            let seconds = Math.abs(new Date() - game.startAt) / 1000;
            if (seconds >= 2) {
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

document.addEventListener("DOMContentLoaded", (event) => {
    const topButton = document.getElementById("back-to-top");

    topButton.addEventListener("mouseover", function (event) {
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
    });

    topButton.addEventListener("mouseleave", function (event) {
        if (game.isStart) {
            game.isStart = false;
            if (game.timer) {
                clearInterval(game.timer);
            }
        }
    });

    const yesButton = document.getElementById("btn-yes");
    const noButton = document.getElementById("btn-no");
    const okButton = document.getElementById("btn-ok");

    yesButton.addEventListener("click", function (event) {
        const prompt = document.getElementById("play-game-prompt");
        prompt.style.display = "none";
        game.start();
        game.newPose();
        game.timer = setInterval(game.check, 10);
    });

    noButton.addEventListener("click", function (event) {
        const prompt = document.getElementById("play-game-prompt");
        prompt.style.display = "none";
    });

    okButton.addEventListener("click", function (event) {
        const prompt = document.getElementById("game-over-message");
        prompt.style.display = "none";
    });
});