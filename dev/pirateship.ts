class PirateShip extends GameObject implements Observer {
    // Fields
    private treasure:Treasure
    private behavior:Behavior

    constructor(playership:PlayerShip, treasure:Treasure) {
        super()

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)

        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.speedX = this.speedY = 3

        playership.subscribe(this)

        this.treasure = treasure
        this.behavior = new RandomDirection(this)
    }

    // Methods
    notify():void {
        this.behavior = new Hunting(this)

        setTimeout(() => {
            this.behavior = new RandomDirection(this)
        }, 2000)
    }

    public update():void {
        super.update()
        this.behavior.update(this.treasure.previousChestX, this.treasure.previousChestY, this.x, this.y)
    }

    public onCollision(gameObject:GameObject):void {
        if(gameObject instanceof PlayerShip) {
            Game.getInstance().gameOver = true
        }
    }
}

window.customElements.define("pirate-ship", PirateShip as any)