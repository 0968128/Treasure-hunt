class Game {
    // Fields
    private static instance: Game
    private gameObjects:GameObject[] = []
    private playership:PlayerShip
    private treasure:Treasure
    private score:number = 0
    private _gameOver:boolean = false
    private ui:Element = document.getElementsByTagName("ui")[0]

    // Setters
    public set gameOver(value:boolean) { this._gameOver = value }

    private constructor() {
        // Schepen laten spawnen
        this.playership = new PlayerShip()
        this.treasure = new Treasure()
        this.gameObjects.push(this.playership, this.treasure)
        this.spawnNewPirateShip()

        // Gameloop starten
        this.gameLoop()
    }

    private gameLoop():void {
        // Score bijwerken
        this.ui.innerHTML = "Score: " + this.score

        // Gameobjecten updaten zolang het niet game over is
        for (const gameObject of this.gameObjects) {
            gameObject.update()
            this.checkCollision(gameObject)
        }

        // Gameloop aan de gang houden
        if(!this._gameOver) {
            requestAnimationFrame(() => this.gameLoop())
        } else {
            for(const gameObject of this.gameObjects) {
                gameObject.remove()
                this.ui.innerHTML = "Je score is " + this.score + ". Herlaad de pagina (F5 of 'opnieuwpijl' linksbovenin de browser) om opnieuw te spelen."
            }
            this.score = 0
        }
    }

    public static getInstance():Game {
        if(!Game.instance) {
            Game.instance = new Game()
        }
        return Game.instance
    }

    private checkCollision(gameObject1:GameObject):void {
        // Code die objecten nagaat op botsingen
        for(const gameObject2 of this.gameObjects) {
            if(gameObject1.hasCollision(gameObject2)) {
                gameObject1.onCollision(gameObject2)
            }
        }
    }

    public removeGameObject(gameObject:GameObject):void {
        let index = this.gameObjects.indexOf(gameObject)
        this.gameObjects.splice(index, 1)
    }

    public spawnNewPirateShip():void {
        this.gameObjects.push(new PirateShip(this.playership, this.treasure))
    }

    public addScore():void {
        this.score++
    }
}

window.addEventListener("load", () => Game.getInstance())