

export class RigidBody {

    mass: number

    position: [number, number]
    velocity: [number, number]
    rotation: number

    constructor(position: [number, number], mass: number) {
        this.position = position
        this.velocity = [0, 0]
        this.rotation = 0
        this.mass = mass
    }

    update(deltaTime: number) {
        this.position[0] += this.velocity[0] * deltaTime
        this.position[1] += this.velocity[1] * deltaTime
    }

    geometry() {
    }

    render(_: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.")
    }
}  