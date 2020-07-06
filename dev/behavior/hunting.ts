class Hunting implements Behavior {
    // Fields
    private object:PirateShip

    constructor(object:PirateShip) {
        this.object = object
    }

    // Methods
    update(destinationX:number, destinationY:number, myPosX:number, myPosY:number) {
        this.object.rotation = this.calculateRotationToPoint(destinationX, destinationY, myPosX, myPosY)

        this.object.x += Math.cos(this.object.degToRad(this.object.rotation)) * this.object.speedX
        this.object.y += Math.sin(this.object.degToRad(this.object.rotation)) * this.object.speedY

        this.object.rotation += this.object.rotationSpeed
    }

    private calculateRotationToPoint(destinationX:number, destinationY:number, myPosX:number, myPosY:number):number {
        let xdist = destinationX - myPosX
        let ydist = destinationY - myPosY
        
        // Angle in radians
        let rotation = Math.atan2(ydist, xdist)
        // from radians to degrees
        rotation = rotation * 180 / Math.PI

        return rotation
    }
}