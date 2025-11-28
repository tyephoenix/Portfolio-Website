import type { Geometry } from "../geomtry"
import { Vector2 } from "../math/linear/vector"


export type Force = {
    direction: Vector2
    position?: Vector2
    time?: number
}

export class RigidBody {

    geometry: Geometry | Geometry[]
    mass: number

    position: Vector2
    velocity: Vector2

    rotation: number
    angularVelocity: number

    forces: Force[]

    constructor(geometry: Geometry | Geometry[], mass: number = 1, position: Vector2 = new Vector2([0, 0]), velocity: Vector2 = new Vector2([0, 0]), rotation: number = 0, angularVelocity: number = 0) {
        this.geometry = geometry
        this.mass = mass

        this.position = position
        this.velocity = velocity

        this.rotation = rotation
        this.angularVelocity = angularVelocity

        this.forces = []
    }

    applyForce(force: Force): void {
        this.forces.push(force)
    }

    update(deltaTime: number): void {
        for (let i = this.forces.length - 1; i >= 0; i--) {
            const force = this.forces[i]

            if (force.time === 0) {
                this.forces.splice(i, 1)
                continue
            }

            var time = deltaTime

            if (force.time) {
                if (force.time > deltaTime) {
                    force.time -= deltaTime
                } else {
                    time = force.time
                    force.time = 0
                }
            }

            const acceleration = force.direction.clone()
            acceleration.scale(1 / this.mass)
            acceleration.scale(time)

            this.velocity.add(acceleration)
        }

        this.position.add([this.velocity.x * deltaTime, this.velocity.y * deltaTime])
        this.rotation += this.angularVelocity * deltaTime
    }
}