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

    // Deze class is een singleton, dus heeft een private constructor
    private constructor() {
        // Schip van de speler en de schat laten spawnen
        this.playership = new PlayerShip()
        this.treasure = new Treasure()
        
        // Spelerschip en schat in de gameObjects array zetten
        this.gameObjects.push(this.playership, this.treasure)
        
        // Vijandelijke schepen spawnen
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

        // Gameloop aan de gang houden zolang het geen game over is
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
        // De eerste keer (als het window wordt geladen) is er nog geen game, dus die wordt aangemaakt als hij niet bestaat
        if(!Game.instance) {
            Game.instance = new Game()
        }
        
        // Geef de (zojuist aangemaakte) game terug
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
        // Verwijder het meegegeven gameobject door zijn plek in de array te traceren
        let index = this.gameObjects.indexOf(gameObject)
        this.gameObjects.splice(index, 1)
    }

    public spawnNewPirateShip():void {
        // Nieuw piratenschip aanmaken en in de gameObjects array zetten
        this.gameObjects.push(new PirateShip(this.playership, this.treasure))
    }

    public addScore():void {
        // Punten toekennen voor verzamelde schatten
        this.score++
    }
}

window.addEventListener("load", () => Game.getInstance())
