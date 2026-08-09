export default class Area {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number,
    ) {
        this.bottom = this.y + this.height
        this.centerX = this.x + this.width / 2
        this.centerY = this.y + this.height / 2
        this.left = this.x
        this.right = this.x + this.width
        this.top = this.y
    }
    public readonly bottom: number
    public readonly centerX: number
    public readonly centerY: number
    public readonly left: number
    public readonly right: number
    public readonly top: number
    public intersects(that: Area) {
        return this.left < that.right && this.right > that.left && this.top < that.bottom && this.bottom > that.top
    }
    public toString() {
        return `[Rectangle (${this.x}, ${this.y}) ${this.width} x ${this.height}]`
    }
}
