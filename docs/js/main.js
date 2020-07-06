"use strict";
class Game {
    constructor() {
        this.gameObjects = [];
        this.score = 0;
        this._gameOver = false;
        this.ui = document.getElementsByTagName("ui")[0];
        this.playership = new PlayerShip();
        this.treasure = new Treasure();
        this.gameObjects.push(this.playership, this.treasure);
        this.spawnNewPirateShip();
        this.gameLoop();
    }
    set gameOver(value) { this._gameOver = value; }
    gameLoop() {
        this.ui.innerHTML = "Score: " + this.score;
        for (const gameObject of this.gameObjects) {
            gameObject.update();
            this.checkCollision(gameObject);
        }
        if (!this._gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
        else {
            for (const gameObject of this.gameObjects) {
                gameObject.remove();
                this.ui.innerHTML = "Je score is " + this.score + ". Herlaad de pagina (F5 of 'opnieuwpijl' linksbovenin de browser) om opnieuw te spelen.";
            }
            this.score = 0;
        }
    }
    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
    checkCollision(gameObject1) {
        for (const gameObject2 of this.gameObjects) {
            if (gameObject1.hasCollision(gameObject2)) {
                gameObject1.onCollision(gameObject2);
            }
        }
    }
    removeGameObject(gameObject) {
        let index = this.gameObjects.indexOf(gameObject);
        this.gameObjects.splice(index, 1);
    }
    spawnNewPirateShip() {
        this.gameObjects.push(new PirateShip(this.playership, this.treasure));
    }
    addScore() {
        this.score++;
    }
}
window.addEventListener("load", () => Game.getInstance());
class GameObject extends HTMLElement {
    constructor() {
        super(...arguments);
        this._x = Math.random() * window.innerWidth;
        this._y = Math.random() * window.innerHeight;
        this._speedX = 0;
        this._speedY = 0;
        this._rotation = 0;
        this._rotationSpeed = 2;
    }
    get x() { return this._x; }
    get y() { return this._y; }
    get speedX() { return this._speedX; }
    get speedY() { return this._speedY; }
    get rotation() { return this._rotation; }
    get rotationSpeed() { return this._rotationSpeed; }
    get width() { return this.clientWidth; }
    get height() { return this.clientHeight; }
    set x(value) { this._x = value; }
    set y(value) { this._y = value; }
    set speedX(value) { this._speedX = value; }
    set speedY(value) { this._speedY = value; }
    set rotation(value) { this._rotation = value; }
    set rotationSpeed(value) { this._rotationSpeed = value; }
    update() {
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
    }
    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
    hasCollision(gameObject) {
        return (this._x < gameObject._x + gameObject.width &&
            this._x + this.width > gameObject._x &&
            this._y < gameObject._y + gameObject.height &&
            this._y + this.height > gameObject._y);
    }
}
class PirateShip extends GameObject {
    constructor(playership, treasure) {
        super();
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.speedX = this.speedY = 3;
        playership.subscribe(this);
        this.treasure = treasure;
        this.behavior = new RandomDirection(this);
    }
    notify() {
        this.behavior = new Hunting(this);
        setTimeout(() => {
            this.behavior = new RandomDirection(this);
        }, 2000);
    }
    update() {
        super.update();
        this.behavior.update(this.treasure.previousChestX, this.treasure.previousChestY, this.x, this.y);
    }
    onCollision(gameObject) {
        if (gameObject instanceof PlayerShip) {
            Game.getInstance().gameOver = true;
        }
    }
}
window.customElements.define("pirate-ship", PirateShip);
class PlayerShip extends GameObject {
    constructor() {
        super();
        this.turnLeft = false;
        this.turnRight = false;
        this.accelerate = false;
        this.observers = [];
        this.x = Math.random() * 100;
        this.y = Math.random() * 100;
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        window.addEventListener("keydown", (e) => this.handleKeyDown(e));
        window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    }
    handleKeyDown(e) {
        if (e.key == "ArrowLeft")
            this.turnLeft = true;
        else if (e.key == "ArrowRight")
            this.turnRight = true;
        if (e.key == "ArrowUp")
            this.accelerate = true;
    }
    handleKeyUp(e) {
        if (e.key == "ArrowLeft")
            this.turnLeft = false;
        else if (e.key == "ArrowRight")
            this.turnRight = false;
        if (e.key == "ArrowUp")
            this.accelerate = false;
    }
    update() {
        if (this.turnLeft)
            this.rotation -= this.rotationSpeed;
        else if (this.turnRight)
            this.rotation += this.rotationSpeed;
        if (this.accelerate) {
            if (this.speedX < 5)
                this.speedX += 0.1;
            if (this.speedY < 5)
                this.speedY += 0.1;
        }
        if (this.speedX >= 0)
            this.speedX -= 0.05;
        if (this.speedY >= 0)
            this.speedY -= 0.05;
        this.x += Math.cos(this.degToRad(this.rotation)) * this.speedX;
        this.y += Math.sin(this.degToRad(this.rotation)) * this.speedY;
        super.update();
    }
    onCollision(gameObject) {
        if (gameObject instanceof Treasure) {
            Game.getInstance().spawnNewPirateShip();
            this.notifyObservers();
        }
    }
    subscribe(observer) {
        this.observers.push(observer);
    }
    unsubscribe(observer) {
        let index = this.observers.indexOf(observer);
        this.observers.splice(index, 1);
    }
    notifyObservers() {
        for (const observer of this.observers) {
            observer.notify();
        }
    }
}
window.customElements.define("player-ship", PlayerShip);
class Treasure extends GameObject {
    constructor() {
        super();
        this._previousChestX = 0;
        this._previousChestY = 0;
        let game = document.getElementsByTagName("game")[0];
        game.appendChild(this);
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
    }
    get previousChestX() { return this._previousChestX; }
    get previousChestY() { return this._previousChestY; }
    onCollision(gameObject) {
        if (gameObject instanceof PlayerShip) {
            Game.getInstance().addScore();
            this._previousChestX = this.x;
            this._previousChestY = this.y;
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
        }
    }
}
window.customElements.define("treasure-chest", Treasure);
class Hunting {
    constructor(object) {
        this.object = object;
    }
    update(destinationX, destinationY, myPosX, myPosY) {
        this.object.rotation = this.calculateRotationToPoint(destinationX, destinationY, myPosX, myPosY);
        this.object.x += Math.cos(this.object.degToRad(this.object.rotation)) * this.object.speedX;
        this.object.y += Math.sin(this.object.degToRad(this.object.rotation)) * this.object.speedY;
        this.object.rotation += this.object.rotationSpeed;
    }
    calculateRotationToPoint(destinationX, destinationY, myPosX, myPosY) {
        let xdist = destinationX - myPosX;
        let ydist = destinationY - myPosY;
        let rotation = Math.atan2(ydist, xdist);
        rotation = rotation * 180 / Math.PI;
        return rotation;
    }
}
class RandomDirection {
    constructor(object) {
        this.counter = 0;
        this.object = object;
    }
    update(destinationX, destinationY, myPosX, myPosY) {
        this.counter++;
        this.object.x += Math.cos(this.object.degToRad(this.object.rotation)) * this.object.speedX;
        this.object.y += Math.sin(this.object.degToRad(this.object.rotation)) * this.object.speedY;
        if (this.counter > 60) {
            this.counter = 0;
            this.object.rotationSpeed = Math.round(Math.random() * 3);
            this.object.rotationSpeed *= Math.random() < 0.5 ? -1 : 1;
        }
        this.object.rotation += this.object.rotationSpeed;
    }
}
//# sourceMappingURL=main.js.map