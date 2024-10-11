import * as THREE from 'three'
import { FBXLoader, OBJLoader } from 'three/examples/jsm/Addons.js'
import {SCENE} from './engine'

export {
    setup
}

function setup() {
    const objLoader = new OBJLoader()
    const fbxLoader = new FBXLoader

    fbxLoader.load("assets/island.fbx", 
    function (object) {
        object.scale.set(0.01, 0.01, 0.01)
        SCENE.add(object)
    })

    fbxLoader.load("assets/mountain.fbx", 
    function (object) {
        object.scale.set(0.07, 0.07, 0.07)
        SCENE.add(object)
    })

    objLoader.load("assets/cloud.obj", 
    function (object) {
        function place(obj: THREE.Group<THREE.Object3DEventMap>) {
            var randDepth = THREE.MathUtils.randFloat(20, 30)
            var randAngle = THREE.MathUtils.randFloat(0, 2*Math.PI)
            var randY = THREE.MathUtils.randFloat(10, 12)
            var randScale = THREE.MathUtils.randFloat(0.1, 0.2)
            var randRot = THREE.MathUtils.randFloat(0, 2*Math.PI)

            obj.traverse( 
            function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0xffffff
                    })
                }
            })
            obj.position.set(randDepth*Math.sin(randAngle), randY, randDepth*Math.cos(randAngle))
            obj.scale.set(randScale, randScale, randScale)
            obj.rotateY(randRot)

            SCENE.add(obj)
        }

        place(object)

        for (var i = 1; i < 20; i++) {
            place(object.clone())
        }
    })

    objLoader.load("assets/dome.obj", 
        function (object) {
            object.traverse( 
            function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFD700})
                }
            })
            object.scale.set(0.05, 0.05, 0.05)
            object.rotateX(-Math.PI / 2)
            object.rotateZ(-Math.PI / 4.4)
            var angle = (125) * (Math.PI / 180)
            var depth = 12
            object.position.set(depth*Math.cos(angle), -2.4, depth*Math.sin(angle))
            SCENE.add(object)
        }
    )

    objLoader.load("assets/crane.obj", 
        function (object) {
            object.traverse( 
            function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFD700})
                }
            })
            object.scale.set(0.002, 0.002, 0.002)
            // object.rotateX(-Math.PI / 2)
            object.rotateY(-Math.PI / 2)
            var angle = (200) * (Math.PI / 180)
            var depth = 12
            object.position.set(depth*Math.cos(angle), 0, depth*Math.sin(angle))
            SCENE.add(object)
        }
    )

    objLoader.load("assets/laboratory.obj", 
        function (object) {
            object.traverse( 
            function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFD700})
                }
            })
            object.scale.set(1, 1, 1)
            // object.rotateX(-Math.PI / 2)
            object.rotateY(-Math.PI / 4)
            var angle = (265) * (Math.PI / 180)
            var depth = 11
            object.position.set(depth*Math.cos(angle), 0, depth*Math.sin(angle))
            SCENE.add(object)
        }
    )

    objLoader.load("assets/rainbow.obj", 
        function (object) {
            object.traverse( 
            function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({color: 0xFFD700})
                }
            })
            object.scale.set(0.05, 0.05, 0.05)
            object.rotateX(-Math.PI / 2)
            object.rotateZ(-Math.PI / 2.8)
            var angle = (340) * (Math.PI / 180)
            var depth = 10
            object.position.set(depth*Math.cos(angle), -1, depth*Math.sin(angle))
            SCENE.add(object)
        }
    )

    objLoader.load("assets/humanoid.obj", 
    function (object) {
        object.traverse( 
        function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({color: 0xFFD700})
            }
        })
        object.scale.set(1, 1, 1)
        // object.rotateX(-Math.PI / 2)
        object.rotateY(Math.PI / 4)
        var angle = (55) * (Math.PI / 180)
        var depth = 14
        object.position.set(depth*Math.cos(angle), -0.5, depth*Math.sin(angle))
        SCENE.add(object)
    }
)
}
