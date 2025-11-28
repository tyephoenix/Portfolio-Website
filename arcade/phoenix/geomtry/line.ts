import type { Geometry } from ".";
import { Matrix } from "../math/linear/matrix";
import type { Vector2 } from "../math/linear/vector";
import type { PhysicsGeometry } from "../physics";
import type { Arc } from "./arc";


export class Line implements Geometry, PhysicsGeometry {

    a: Vector2
    b: Vector2

    constructor(a: Vector2, b: Vector2) {
        this.a = a
        this.b = b
    }

    // Geometry
    center(): Vector2 {
        const center = this.a.clone()
        center.add(this.b)
        center.scale(0.5)
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
        const ab = this.b.clone() as Vector2
        ab.subtract(this.a)

        const ap = point.clone() as Vector2
        ap.subtract(this.a)

        var t = ab.dot(ap) / ab.dot(ab)
        t = Math.max(0, Math.min(1, t))

        const parametric = ab.clone()
        parametric.scale(t)

        const intersection = this.a.clone()
        intersection.add(parametric)
        return intersection as Vector2
    }

    contains(_: Vector2): boolean {
        return false
    }

    intersect(edge: Line | Arc): Vector2[] | undefined {
        if (edge instanceof Line) {
            const r = this.b.clone() as Vector2
            r.subtract(this.a)

            const s = edge.b.clone() as Vector2
            s.subtract(edge.a)

            const rxs = r.cross(s)

            const qp = edge.a.clone() as Vector2
            qp.subtract(this.a)

            const qpxr = qp.cross(r)

            if (rxs === 0) {
                if (qpxr !== 0) {
                    return undefined
                }

                const rdot = r.dot(r)
                const t0 = qp.dot(r) / rdot
                const t1 = t0 + s.dot(r) / rdot

                const tmin = Math.max(0, Math.min(t0, t1))
                const tmax = Math.min(1, Math.max(t0, t1))

                if (tmax < tmin) {
                    return undefined
                }

                const intersection = r.clone()
                intersection.scale(tmin)
                intersection.add(this.a)
                return [intersection as Vector2]
            }

            const t = qp.cross(s) / rxs
            const u = qpxr / rxs

            if (t < 0 || t > 1 || u < 0 || u > 1) {
                return undefined
            }

            const intersection = r.clone()
            intersection.scale(t)
            intersection.add(this.a)
            return [intersection as Vector2]
        } else {
            throw new Error("TODO: Not implemented")
        }
    }

    clone(): Geometry {
        return new Line(this.a.clone() as Vector2, this.b.clone() as Vector2)
    }
}