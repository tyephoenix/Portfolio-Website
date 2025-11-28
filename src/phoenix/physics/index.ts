import type { Arc } from "../geomtry/arc";
import type { Line } from "../geomtry/line";
import type { Vector2 } from "../math/linear/vector";


export interface PhysicsGeometry {
    trace(point: Vector2): Vector2

    contains(point: Vector2): boolean
    intersect(edge: Line | Arc): Vector2[] | undefined
}