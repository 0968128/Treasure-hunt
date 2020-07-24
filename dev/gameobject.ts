abstract class GameObject extends HTMLElement {
    // Fields
    private _x:number = Math.random() * window.innerWidth
    private _y:number = Math.random() * window.innerHeight
    private _speedX:number = 0
    private _speedY:number = 0
    private _rotation:number = 0
    private _rotationSpeed:number = 2

    // Getters
    public get x():number { return this._x }
    public get y():number { return this._y }
    public get speedX() { return this._speedX }
    public get speedY() { return this._speedY }
    public get rotation():number { return this._rotation }
    public get rotationSpeed():number { return this._rotationSpeed }
    public get width():number { return this.clientWidth }
    public get height():number { return this.clientHeight }

    // Setters
    public set x(value:number) { this._x = value }
    public set y(value:number) { this._y = value }
    public set speedX(value:number) { this._speedX = value}
    public set speedY(value:number) { this._speedY = value }
    public set rotation(value:number) { this._rotation = value }
    public set rotationSpeed(value:number) { this._rotationSpeed = value }

    // Methods
    public update():void {
        this.draw()
    }

    // Gameobject op de juiste manier in het speelveld laten verschijnen
    private draw():void {
        this.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`
    }

    // Graden naar radialen omrekenen
    public degToRad(degrees:number):number {
        return degrees * Math.PI / 180
    }

    // Check op botsing van dit gameobject met een gegeven ander gameobject
    public hasCollision(gameObject:GameObject):boolean {
        return (
            this._x < gameObject._x + gameObject.width &&
            this._x + this.width > gameObject._x &&
            this._y < gameObject._y + gameObject.height &&
            this._y + this.height > gameObject._y
        )
    }

    public abstract onCollision(gameObject:GameObject):void
}
