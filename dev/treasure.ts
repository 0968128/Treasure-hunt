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

        // Locatie in het scherm is willekeurig 
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
    }

    // Functionaliteit bij een botsing met een gegeven gameobject
    public onCollision(gameObject:GameObject):void {
        if(gameObject instanceof PlayerShip) {
            // Punt optellen bij score
            Game.getInstance().addScore()
            
            // Piratenschepen moeten varen naar waar de vorige schat was, dus die waardes sla ik op in een aparte variabele
            this._previousChestX = this.x
            this._previousChestY = this.y
            
            // De locatie van de schat verandert naar een willekeurige andere plek
            this.x = Math.random() * window.innerWidth
            this.y = Math.random() * window.innerHeight
        }
    }
}

window.customElements.define("treasure-chest", Treasure as any)
