import type { Geometry } from ".";
import { Vector2 } from "../math/linear/vector";
import type { Arc } from "./arc";
import type { Line } from "./line";


export class Polygon implements Geometry {

    edges: (Line | Arc)[]

    constructor(edges: (Line | Arc)[]) {
        this.edges = edges
    }

    // Geometry
    center(): Vector2 {
        const center = new Vector2([0, 0])
        this.edges.forEach(edge => center.add(edge.center()))
        center.scale(1 / this.edges.length)
        return center as Vector2
    }

    translate(translation: Vector2): void {
        this.edges.forEach(edge => edge.translate(translation))
    }

    rotate(rotation: number): void {
        this.edges.forEach(edge => edge.rotate(rotation))
    }

    scale(scale: Vector2): void {
        this.edges.forEach(edge => edge.scale(scale))
    }

    // PhysicsGeometry
    trace(point: Vector2): Vector2 {
        var closest = this.edges[0].trace(point)
        for (let i = 1; i < this.edges.length; i++) {
            const edge = this.edges[i]
            const bound = edge.trace(point)
            if (bound.distance(point) < closest.distance(point)) {
                closest = bound
            }
        }
        return closest
    }

    contains(_: Vector2): boolean {
        throw new Error("TODO: Not implemented")
    }

    intersect(edge: Line | Arc): Vector2[] | undefined {
        const intersections: Vector2[] = []
        for (let i = 0; i < this.edges.length; i++) {
            const intersection = this.edges[i].intersect(edge)
            if (intersection) {
                intersections.push(...intersection)
            }
        }
        return intersections.length > 0 ? intersections : undefined
    }

    clone(): Geometry {
        return new Polygon(this.edges.map(edge => edge.clone() as Line | Arc))
    }
}