/// <reference path="gameobject.ts"/>

class PlayerShip extends GameObject implements Subject {
    private turnLeft:boolean = false
    private turnRight:boolean = false
    private accelerate:boolean = false
    private observers:Observer[] = []

    constructor() {
        super()

        this.x = Math.random() * 100
        this.y = Math.random() * 100
        
        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)
        
        window.addEventListener("keydown", (e:KeyboardEvent) => this.handleKeyDown(e))
        window.addEventListener("keyup", (e:KeyboardEvent) => this.handleKeyUp(e))
    }

    // Methods
    private handleKeyDown(e : KeyboardEvent):void {
        if(e.key == "ArrowLeft") this.turnLeft   = true
        else if (e.key == "ArrowRight") this.turnRight  = true
        
        if(e.key == "ArrowUp") this.accelerate = true
    }
    
    private handleKeyUp(e:KeyboardEvent) {
        if(e.key == "ArrowLeft") this.turnLeft   = false
        else if (e.key == "ArrowRight") this.turnRight  = false

        if(e.key == "ArrowUp") this.accelerate = false
    }

    public update():void {
        // handle rotation if active
        if(this.turnLeft) this.rotation -= this.rotationSpeed
        else if(this.turnRight) this.rotation += this.rotationSpeed

        // handle movement if active
        if(this.accelerate)     {
            if(this.speedX < 5) this.speedX += 0.1
            if(this.speedY < 5) this.speedY += 0.1
        }

        // slow down the ship if not accelerating
        if (this.speedX >= 0) this.speedX -= 0.05
        if (this.speedY >= 0) this.speedY -= 0.05
              
        this.x += Math.cos(this.degToRad(this.rotation)) * this.speedX
        this.y += Math.sin(this.degToRad(this.rotation)) * this.speedY

        super.update()
    }

    public onCollision(gameObject:GameObject):void {
        if(gameObject instanceof Treasure) {
            Game.getInstance().spawnNewPirateShip()
            this.notifyObservers()
        }
    }

    subscribe(observer:Observer):void {
        this.observers.push(observer)
    }

    unsubscribe(observer:Observer):void {
        let index = this.observers.indexOf(observer)
        this.observers.splice(index, 1)
    }

    notifyObservers():void {
        for (const observer of this.observers) {
            observer.notify()
        }
    }
}

window.customElements.define("player-ship", PlayerShip)