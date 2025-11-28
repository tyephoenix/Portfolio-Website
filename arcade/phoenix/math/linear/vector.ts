import { UnequalDimensionsError } from "../error"
import { Tensor } from "./tensor"

export class Vector extends Tensor {

    constructor(...components: number[]) {
        super([components.length], components)
    }

    get length(): number {
        return this.dimensions[0]
    }

    get(i: number): number {
        return super.get(i)
    }

    set(i: [number], value: number): void {
        super.set(i, value)
    }

    dot(other: Vector): number {
        return super.contract(other, 0, 0).get(0)
    }

    distance(other: Vector): number {
        if (this.dimensions !== other.dimensions) {
            throw new UnequalDimensionsError(this.dimensions, other.dimensions)
        }
        return Math.sqrt(this.dot(Vector.subtract(this, other)))
    }

    clone(): Vector {
        return new Vector(...this.data)
    }

    toString() {
        return `Vector(${this.data.join(", ")})`
    }

    static subtract(a: Vector, b: Vector): Vector {
        const clone = a.clone()
        clone.subtract(b)
        return clone
    }
}


export class Vector2 extends Vector {
    get x() {
        return this.get(0)
    }
    get y() {
        return this.get(1)
    }

    constructor(components: [number, number]) {
        super(...components)
    }

    cross(other: Vector2): number {
        return this.x * other.y - this.y * other.x
    }
}

export class Vector3 extends Vector {
    get x() {
        return this.get(0)
    }
    get y() {
        return this.get(1)
    }
    get z() {
        return this.get(2)
    }

    constructor(components: [number, number, number]) {
        super(...components)
    }

    cross(other: Vector3): Vector3 {
        return new Vector3([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ])
    }
}

export class Vector4 extends Vector {
    get x() {
        return this.get(0)
    }
    get y() {
        return this.get(1)
    }
    get z() {
        return this.get(2)
    }
    get w() {
        return this.get(3)
    }

    constructor(components: [number, number, number, number]) {
        super(...components)
    }
}