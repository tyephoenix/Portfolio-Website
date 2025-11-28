import type { Geometry } from ".";
import { Matrix } from "../math/linear/matrix";
import { Vector2 } from "../math/linear/vector";
import type { PhysicsGeometry } from "../physics";
import { Line } from "./line";



export class Arc implements Geometry, PhysicsGeometry {

    a: Vector2
    b: Vector2
    sagitta: number

    constructor(a: Vector2, b: Vector2, sagitta: number) {
        this.a = a
        this.b = b
        this.sagitta = sagitta
    }

    // Geometry
    center(): Vector2 {
        const midPoint = this.a.clone()
        midPoint.add(this.b)
        midPoint.scale(0.5)

        const distance = this.b.clone() as Vector2
        distance.subtract(this.a)
        distance.normalize()
        const normal = new Vector2([-distance.y, distance.x])
        normal.scale(this.sagitta)
        midPoint.add(normal)

        const center = midPoint.clone()
        center.add(midPoint)
        center.add(this.a)
        center.add(this.b)
        center.scale(1/3)

        return center as Vector2
    }

    translate(translation: Vector2): void {
        this.a.add(translation)
        this.b.add(translation)
    }

    rotate(rotation: number): void {
        const matrix = Matrix.rotation(2, rotation, 0, 1)
        this.a = matrix.apply(this.a) as Vector2
        this.b = matrix.apply(this.b) as Vector2
    }

    scale(scale: Vector2): void {
        this.a.scale(scale.x)
        this.b.scale(scale.y)
    }

    // PhysicsGeometry
    trace(point: Vector2): Vector2 {
        const distance = this.a.distance(this.b)
        const radius = this.sagitta / 2 + (distance * distance) / (8 * this.sagitta)

        const midpoint = this.a.clone()
        midpoint.add(this.b)
        midpoint.scale(0.5)

        const tangent = this.b.clone() as Vector2
        tangent.subtract(this.a)
        tangent.normalize()

        const center = this.center()

        const vector = point.clone() as Vector2
        vector.subtract(center)

        const thetaA = Math.atan2(this.a.y - center.y, this.a.x - center.x)
        const thetaB = Math.atan2(this.b.y - center.y, this.b.x - center.x)

        const thetaP = Math.atan2(vector.y, vector.x)

        const thetaClamped = Math.max(thetaA, Math.min(thetaP, thetaB))

        return new Vector2([center.x + radius * Math.cos(thetaClamped), center.y + radius * Math.sin(thetaClamped)])
    }

    contains(_: Vector2): boolean {
        return false
    }

    intersect(edge: Line | Arc): Vector2[] | undefined {
        if (edge instanceof Line) {
            return edge.intersect(this)
        } else {
            throw new Error("TODO: Not implemented")
        }
    }

    clone(): Geometry {
        return new Arc(this.a.clone() as Vector2, this.b.clone() as Vector2, this.sagitta)
    }
}