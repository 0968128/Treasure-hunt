/// <reference path="gameobject.ts"/>

class PlayerShip extends GameObject implements Subject {
    // Fields
    private turnLeft:boolean = false
    private turnRight:boolean = false
    private accelerate:boolean = false
    private observers:Observer[] = []

    constructor() {
        super()

        // Het schip spawnt ergens in de linkerbovenhoek
        this.x = Math.random() * 100
        this.y = Math.random() * 100
        
        let game = document.getElementsByTagName("game")[0]
        game.appendChild(this)
        
        // Window laten luisteren naar keyboardevents en doorverwijzen naar methods die deze events afhandelen
        window.addEventListener("keydown", (e:KeyboardEvent) => this.handleKeyDown(e))
        window.addEventListener("keyup", (e:KeyboardEvent) => this.handleKeyUp(e))
    }

    // Methods
    private handleKeyDown(e:KeyboardEvent):void {
        // Richting bepalen door te controleren op keyboardevents
        if(e.key == "ArrowLeft") this.turnLeft = true
        else if (e.key == "ArrowRight") this.turnRight = true
        
        // Bepalen of er geaccelereerd moet worden door te controleren op een keyboardevent
        if(e.key == "ArrowUp") this.accelerate = true
    }
    
    private handleKeyUp(e:KeyboardEvent) {
        // Stoppen met draaien/accelereren als het keyboardevent niet meer van toepassing is
        if(e.key == "ArrowLeft") this.turnLeft = false
        else if (e.key == "ArrowRight") this.turnRight = false

        if(e.key == "ArrowUp") this.accelerate = false
    }

    public update():void {
        // Zorgen dat het schip roteert met de juiste snelheid als dat gevraagd wordt
        if(this.turnLeft) this.rotation -= this.rotationSpeed
        else if(this.turnRight) this.rotation += this.rotationSpeed

        // Zorgen dat het schip snelheid maakt als dat gevraagd wordt
        if(this.accelerate)     {
            if(this.speedX < 5) this.speedX += 0.1
            if(this.speedY < 5) this.speedY += 0.1
        }

        // Tot stilstand komen
        if (this.speedX >= 0) this.speedX -= 0.05
        if (this.speedY >= 0) this.speedY -= 0.05
        
        // Voortbewegen in de juiste hoek
        this.x += Math.cos(this.degToRad(this.rotation)) * this.speedX
        this.y += Math.sin(this.degToRad(this.rotation)) * this.speedY

        // Ook de updatemethod van de parent uitvoeren
        super.update()
    }

    // Functionaliteit bij botsing met een gegeven object
    public onCollision(gameObject:GameObject):void {
        if(gameObject instanceof Treasure) {
            // Laat een nieuw piratenschip verschijnen in het speelveld
            Game.getInstance().spawnNewPirateShip()
            
            // Observers op de hoogte stellen
            this.notifyObservers()
        }
    }

    subscribe(observer:Observer):void {
        // Binnengekomen observer aanmelden door hem aan de array toe te voegen
        this.observers.push(observer)
    }

    unsubscribe(observer:Observer):void {
        // Binnengekomen observer afmelden door zijn plaats in de array te traceren
        let index = this.observers.indexOf(observer)
        this.observers.splice(index, 1)
    }

    notifyObservers():void {
        // Alle observers langsgaan en hun notify-method uitvoeren
        for (const observer of this.observers) {
            observer.notify()
        }
    }
}

window.customElements.define("player-ship", PlayerShip)
