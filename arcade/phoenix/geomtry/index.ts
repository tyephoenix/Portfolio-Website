import type { Vector2 } from "../math/linear/vector";


export interface Geometry {
    clone(): Geometry

    center(): Vector2

    translate(translation: Vector2): void
    rotate(rotation: number): void
    scale(scale: Vector2): void
}