class Hunting implements Behavior {
    // Fields
    private object:PirateShip

    constructor(object:PirateShip) {
        // Field gelijkstellen aan de parameter
        this.object = object
    }

    // Methods
    update(destinationX:number, destinationY:number, myPosX:number, myPosY:number) {
        // Schip laten varen volgens zijn snelheid, rotatie en gedrag
        this.object.rotation = this.calculateRotationToPoint(destinationX, destinationY, myPosX, myPosY)

        this.object.x += Math.cos(this.object.degToRad(this.object.rotation)) * this.object.speedX
        this.object.y += Math.sin(this.object.degToRad(this.object.rotation)) * this.object.speedY

        this.object.rotation += this.object.rotationSpeed
    }

    private calculateRotationToPoint(destinationX:number, destinationY:number, myPosX:number, myPosY:number):number {
        // Afstand per as berekenen
        let xdist = destinationX - myPosX
        let ydist = destinationY - myPosY
        
        // Hoek in radialen
        let rotation = Math.atan2(ydist, xdist)
        
        // Omrekenen van radialen naar graden
        rotation = rotation * 180 / Math.PI

        return rotation
    }
}
