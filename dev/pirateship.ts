class PirateShip extends GameObject implements Observer {
    // Fields
    private treasure:Treasure
    private behavior:Behavior

    // PirateShip krijgt het spelerschip en de schat als parameter, want daar moet hij iets mee
    constructor(playership:PlayerShip, treasure:Treasure) {
        super()

        // Bij het spawnen krijgt het schip een willekeurige locatie in het speelveld
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        
        // Vaarsnelheid bepalen
        this.speedX = this.speedY = 3

        // Aanmelden als observer bij de speler als onderwerp
        playership.subscribe(this)

        this.treasure = treasure
        
        // Gedrag bepalen
        this.behavior = new RandomDirection(this)
    }

    // Methods
    notify():void {
        // Gedrag verandert als het onderwerp de observers op de hoogte stelt
        this.behavior = new Hunting(this)

        // Het gedrag gaat terug naar normaal na 2 seconde
        setTimeout(() => {
            this.behavior = new RandomDirection(this)
        }, 2000)
    }

    // Updatemethod die bestaat uit de geërfde updatefunctie en de updatefunctie van het gedrag
    public update():void {
        super.update()
        this.behavior.update(this.treasure.previousChestX, this.treasure.previousChestY, this.x, this.y)
    }

    // Functionaliteit bepalen bij een botsing met een gegeven gameobject
    public onCollision(gameObject:GameObject):void {
        if(gameObject instanceof PlayerShip) {
            // Als een piratenschip de speler raakt, is het game over
            Game.getInstance().gameOver = true
        }
    }
}

window.customElements.define("pirate-ship", PirateShip as any)
