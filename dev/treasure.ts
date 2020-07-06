class Treasure extends GameObject {
    // Fields
    private _previousChestX:number = 0
    private _previousChestY:number = 0

    // Getters
    public get previousChestX():number { return this._previousChestX }
    public get previousChestY():number { return this._previousChestY }

    constructor() {
        super()

        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)

        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
    }

    public onCollision(gameObject: GameObject): void {
        if(gameObject instanceof PlayerShip) {
            Game.getInstance().addScore()
            this._previousChestX = this.x
            this._previousChestY = this.y
            this.x = Math.random() * window.innerWidth
            this.y = Math.random() * window.innerHeight
        }
    }
}

window.customElements.define("treasure-chest", Treasure as any)