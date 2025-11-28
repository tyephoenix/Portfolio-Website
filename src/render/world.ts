import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/Addons.js'
import { SCENE } from './engine'
import gsap from 'gsap'


export function setup() {
    const objLoader = new OBJLoader()

    objLoader.load("/collateral/dome.obj", 
        function (object) {
            function place(obj: THREE.Group<THREE.Object3DEventMap>) {
                var randRot = THREE.MathUtils.randFloat(0, 2*Math.PI)
    
                obj.scale.set(0.05, 0.05, 0.05)
                obj.rotateY(randRot)
                obj.rotateX(-Math.PI/4)
                obj.rotateZ(randRot)
    
                randomlyPlace(obj)
                SCENE.add(obj)

                gsap.to(obj.position, {
                    duration: 20,

                    x: () => {
                        const x = obj.position.x
                        return 5 * (Math.random() - 0.5) + x
                    },
                    y: () => {
                        const y = obj.position.y
                        return 5 * (Math.random() - 0.5) + y
                    },
                    z: () => {
                        const z = obj.position.z
                        return 5 * (Math.random() - 0.5) + z
                    },
                    
                    ease: 'none',

                    repeat: -1,
                    repeatRefresh: true
                })
                gsap.to(obj.rotation, {
                    duration: 20,

                    x: () => {
                        const x = obj.rotation.x
                        return 2 * (Math.random() - 0.5) + x
                    },
                    y: () => {
                        const y = obj.rotation.y
                        return 2 * (Math.random() - 0.5) + y
                    },
                    z: () => {
                        const z = obj.rotation.z
                        return 2 * (Math.random() - 0.5) + z
                    },
                    
                    ease: 'none',

                    repeat: -1,
                    repeatRefresh: true
                })
            }
    
            place(object)
    
            for (var i = 1; i < 30; i++) {
                place(object.clone())
            }
        }
    )

    objLoader.load("/collateral/cloud.obj", 
        function (object) {
            function place(obj: THREE.Group<THREE.Object3DEventMap>) {
                var randRot = THREE.MathUtils.randFloat(0, 2*Math.PI)
    
                obj.scale.set(0.1, 0.1, 0.1)
                obj.rotateY(randRot)
    
                randomlyPlace(obj)
                SCENE.add(obj)

                gsap.to(obj.position, {
                    duration: 20,

                    x: () => {
                        const x = obj.position.x
                        return 6 * (Math.random() - 0.5) + x
                    },
                    y: () => {
                        const y = obj.position.y
                        return 6 * (Math.random() - 0.5) + y
                    },
                    z: () => {
                        const z = obj.position.z
                        return 6 * (Math.random() - 0.5) + z
                    },
                    
                    ease: 'none',

                    repeat: -1,
                    repeatRefresh: true
                })
                gsap.to(obj.rotation, {
                    duration: 20,

                    x: () => {
                        const x = obj.rotation.x
                        return 1 * (Math.random() - 0.5) + x
                    },
                    y: () => {
                        const y = obj.rotation.y
                        return 1 * (Math.random() - 0.5) + y
                    },
                    z: () => {
                        const z = obj.rotation.z
                        return 1 * (Math.random() - 0.5) + z
                    },
                    
                    ease: 'none',

                    repeat: -1,
                    repeatRefresh: true
                })
            }
    
            place(object)
    
            for (var i = 1; i < 80; i++) {
                place(object.clone())
            }
        }
    )

    objLoader.load("/collateral/humanoid.obj", 
        function (object) {
            function place(obj: THREE.Group<THREE.Object3DEventMap>) {
                var randRot = THREE.MathUtils.randFloat(0, 2*Math.PI)
    
                obj.scale.set(1, 1, 1)
                obj.rotateY(randRot)
                obj.rotateX(-Math.PI/4)
                obj.rotateZ(randRot)
    
                randomlyPlace(obj)
                SCENE.add(obj)

                gsap.to(obj.position, {
                    duration: 20,

                    x: () => {
                        const x = obj.position.x
                        return 7 * (Math.random() - 0.5) + x
                    },
                    y: () => {
                        const y = obj.position.y
                        return 7 * (Math.random() - 0.5) + y
                    },
                    z: () => {
                        const z = obj.position.z
                        return 7 * (Math.random() - 0.5) + z
                    },
                    
                    ease: 'none',

                    repeat: -1,
                    repeatRefresh: true
                })
                gsap.to(obj.rotation, {
                    duration: 20,

                    x: () => {
                        const x = obj.rotation.x
                        return 5 * (Math.random() - 0.5) + x
                    },
                    y: () => {
                        const y = obj.rotation.y
                        return 5 * (Math.random() - 0.5) + y
                    },
                    z: () => {
                        const z = obj.rotation.z
                        return 5 * (Math.random() - 0.5) + z
                    },
                    
                    ease: 'none',

                    repeat: -1,
                    repeatRefresh: true
                })
            }
    
            place(object)
    
            for (var i = 1; i < 20; i++) {
                place(object.clone())
            }
        }
    )
}

function randomlyPlace(obj: THREE.Group<THREE.Object3DEventMap>) {
    var randY = THREE.MathUtils.randFloat(-1000, 40)
    var randX = THREE.MathUtils.randFloat(-70, 70)
    var randZ = THREE.MathUtils.randFloat(-50, -30)

    obj.position.set(randX, randY, randZ)


    obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material = child.material.clone()
            child.material.color = new THREE.Color(0xffffff)
        }
    })
}