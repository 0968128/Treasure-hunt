class RandomDirection implements Behavior {
    // Fields
    private object:PirateShip
    private counter:number = 0

    constructor(object:PirateShip) {
        // Field gelijkstellen aan parameter
        this.object = object
    }

    // Methods
    update(destinationX:number, destinationY:number, myPosX:number, myPosY:number) {
        this.counter++

        // Beweging vaststellen
        this.object.x += Math.cos(this.object.degToRad(this.object.rotation)) * this.object.speedX
        this.object.y += Math.sin(this.object.degToRad(this.object.rotation)) * this.object.speedY

        // Laat het schip een andere kant op varen als de teller 60 bereikt
        if(this.counter > 60) {
            this.counter = 0

            // Bepaal een willekeurige andere rotatie
            this.object.rotationSpeed = Math.round(Math.random() * 3)
            
            // Bepaal of het schip links- of rechtsom draait
            this.object.rotationSpeed *= Math.random() < 0.5 ? -1 : 1
        }
        this.object.rotation += this.object.rotationSpeed
    }
}
