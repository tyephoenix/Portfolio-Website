import type { Geometry } from "."
import { Matrix } from "../math/linear/matrix"
import { Vector2 } from "../math/linear/vector"
import type { PhysicsGeometry } from "../physics"
import type { Arc } from "./arc"
import { Line } from "./line"


export class Circle implements Geometry, PhysicsGeometry {

    origin: Vector2
    radius: number

    constructor(radius: number, center: Vector2 = new Vector2([0,0])) {
        this.origin = center
        this.radius = radius
    }

    // Geometry
    center(): Vector2 {
        return this.origin.clone() as Vector2
    }

    translate(translation: Vector2): void {
        this.origin.add(translation)
    }

    rotate(rotation: number): void {
        const matrix = Matrix.rotation(2, rotation, 0, 1)
        this.origin = matrix.apply(this.origin) as Vector2
    }

    scale(scale: Vector2): void {
        this.origin.scale(scale.x)
        this.radius *= scale.y
    }

    // PhysicsGeometry
    trace(point: Vector2): Vector2 {
        const intersection = point.clone() as Vector2
        intersection.subtract(this.origin)
        intersection.normalize()
        intersection.scale(this.radius)
        intersection.add(this.origin)
        return intersection
    }

    contains(point: Vector2): boolean {
        const distance = point.distance(this.origin)
        return distance <= this.radius
    }

    intersect(edge: Line | Arc): Vector2[] | undefined {
        if (edge instanceof Line) {
            const center = this.center()
            const p1 = edge.a.clone() as Vector2
            const p2 = edge.b.clone() as Vector2
    
            const d = p2.clone()
            d.subtract(p1)
            const f = p1.clone()
            f.subtract(center)
    
            const a = d.dot(d)
            const b = 2 * f.dot(d)
            const c = f.dot(f) - this.radius * this.radius
    
            const discriminant = b*b - 4*a*c
            if (discriminant < 0) 
                return undefined
    
            const intersections: Vector2[] = []
            const sqrtD = Math.sqrt(discriminant)
    
            const t1 = (-b - sqrtD) / (2*a)
            const t2 = (-b + sqrtD) / (2*a)
    
            if (t1 >= 0 && t1 <= 1) {
                const intersection = d.clone() as Vector2
                intersection.scale(t1)
                intersection.add(p1)
                intersections.push(intersection)
            }
            if (t2 >= 0 && t2 <= 1) {
                const intersection = d.clone() as Vector2
                intersection.scale(t2)
                intersection.add(p1)
                intersections.push(intersection)
            }
    
            return intersections.length > 0 ? intersections : undefined
        } else {
            throw new Error("TODO: Not implemented")
        }
    }

    clone(): Geometry {
        return new Circle(this.radius, this.origin.clone() as Vector2)
    }
}