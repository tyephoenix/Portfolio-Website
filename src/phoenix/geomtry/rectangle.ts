import type { Geometry } from "."
import { Vector2 } from "../math/linear/vector"
import { Line } from "./line"
import { Polygon } from "./polygon"


export class Rectangle extends Polygon {

    max: Vector2 | undefined
    min: Vector2 | undefined

    constructor(max: Vector2, min: Vector2) {
        super([new Line(min, new Vector2([max.x, min.y])), new Line(new Vector2([max.x, min.y]), max), new Line(max, new Vector2([min.x, max.y])), new Line(new Vector2([min.x, max.y]), min)])
        if (max.x < min.x || max.y < min.y) {
            throw new Error("The max vector must be greater than the min vector")
        }
        this.max = max
        this.min = min
    }

    // Geometry
    center(): Vector2 {
        if (this.max && this.min) {
            const center = super.center()
            center.add(this.max)
            center.add(this.min)
            center.scale(0.5)
            return center as Vector2
        }
        return super.center()
    }

    translate(translation: Vector2): void {
        super.translate(translation)
        if (this.max && this.min) {
            this.max.add(translation)
            this.min.add(translation)
        }
    }

    rotate(rotation: number): void {
        if (rotation % Math.PI === 0) {
            return
        }
        this.max = undefined
        this.min = undefined
        super.rotate(rotation)
    }
    
    scale(scale: Vector2): void {
        super.scale(scale)
        if (this.max && this.min) {
            this.max.scale(scale.x)
            this.min.scale(scale.y)
        }
    }

    // PhysicsGeometry
    override contains(point: Vector2): boolean {
        if (this.min && this.max) {
            return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y
        }
        return super.contains(point)
    }

    clone(): Geometry {
        return new Rectangle(this.max?.clone() as Vector2, this.min?.clone() as Vector2)
    }
}