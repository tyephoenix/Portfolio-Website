import { RigidBody } from "./body"

class Avatar extends RigidBody {

    skin: ImageBitmap

    constructor(skin: ImageBitmap, position: [number, number], mass: number) {
        super(position, mass)
        this.skin = skin
    }

    
}