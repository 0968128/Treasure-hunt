class RandomDirection implements Behavior {
    // Fields
    private object:PirateShip
    private counter:number = 0

    constructor(object:PirateShip) {
        this.object = object
    }

    // Methods
    update(destinationX:number, destinationY:number, myPosX:number, myPosY:number) {
        this.counter++

        this.object.x += Math.cos(this.object.degToRad(this.object.rotation)) * this.object.speedX
        this.object.y += Math.sin(this.object.degToRad(this.object.rotation)) * this.object.speedY

        // turn the ship every 60 frames
        if(this.counter > 60) {
            this.counter = 0

            // determine rotation
            this.object.rotationSpeed = Math.round(Math.random() * 3)
            // determine left or right rotation
            this.object.rotationSpeed *= Math.random() < 0.5 ? -1 : 1
        }
        this.object.rotation += this.object.rotationSpeed
    }
}