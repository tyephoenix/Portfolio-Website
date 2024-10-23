import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/Addons.js'
import {SCENE} from './engine'

export {
    setup
}

function setup() {
    const objLoader = new OBJLoader()

    objLoader.load("/dome.obj", 
        function (object) {
            function place(obj: THREE.Group<THREE.Object3DEventMap>) {
                var randRot = THREE.MathUtils.randFloat(0, 2*Math.PI)
    
                obj.traverse( 
                function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.color = 0x000000
                    }
                })
                obj.scale.set(0.05, 0.05, 0.05)
                obj.rotateY(randRot)
                obj.rotateX(-Math.PI/4)
                obj.rotateZ(randRot)
    
                randomlyPlace(obj)
                SCENE.add(obj)
            }
    
            place(object)
    
            for (var i = 1; i < 100; i++) {
                place(object.clone())
            }
        }
    )
}

function randomlyPlace(obj: any) {
    var randY = THREE.MathUtils.randFloat(-1000, 10)
    var randX = THREE.MathUtils.randFloat(-70, 70)
    var randZ = THREE.MathUtils.randFloat(-50, -30)

    obj.position.set(randX, randY, randZ)
}