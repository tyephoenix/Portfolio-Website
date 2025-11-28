import gsap from 'gsap'
import * as THREE from 'three'

const SCENE = new THREE.Scene()

export function setupNetwork() {
    const CANVAS = document.getElementById("gl-rendering")
    CANVAS!.style.height = "100vh"
    CANVAS!.style.width = "100%"

    gsap.from(CANVAS, {
        duration: 3,

        opacity: 0,

        ease: 'linear',
        delay: 1.5
    })

    const CAMERA = new THREE.PerspectiveCamera(50, CANVAS!.offsetWidth / CANVAS!.offsetHeight, 0.1, 1000)

    const renderer = new THREE.WebGLRenderer({
        canvas: CANVAS!,
        alpha: true
    })
    renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    window.addEventListener("resize", 
        function () {
            CANVAS!.style.width = "100%"
            CANVAS!.style.height = "100vh"
            renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
            CAMERA.aspect = CANVAS!.offsetWidth / CANVAS!.offsetHeight
            CAMERA.updateProjectionMatrix()
        }
    )

    const pointLight = new THREE.DirectionalLight(0xffffff, 3)
    pointLight.position.set(1, 1, 1)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    SCENE.add(ambientLight, pointLight)


    CAMERA.position.set(0, 0, 10)
    CAMERA.lookAt(new THREE.Vector3(0, 0, 0))

    window.addEventListener("mousemove", (event) => {
        const mouseX = event.clientX / window.innerWidth * 2 - 1
        const mouseY = event.clientY / window.innerHeight * 2 - 1
        CAMERA.position.set(mouseX, mouseY, 10)

        CAMERA.lookAt(new THREE.Vector3(0, 0, 0))
    })


    const network = createNetwork([6, 7, 3, 4, 8])
    network.position.add(new THREE.Vector3(0, 0.5, 0))
    network.rotation.set(-Math.PI / 4, 0, 0)

    function animate() {
        requestAnimationFrame(animate)
        renderer.render(SCENE, CAMERA)
    }
    animate()
}

function createNetwork(layers: number[], nodeRadius: number = 0.25, edgeRadius: number = 0.01, gap: number = 1) {
    const network = new THREE.Group()
    SCENE.add(network)
    
    const nodes: THREE.Mesh[][] = []
    const edges: Map<number, Map<number, THREE.Mesh[]>> = new Map()
    for (let i = 0; i < layers.length; i++) {
        const group = new THREE.Group()
        network.add(group)
        
        const layerNodes: THREE.Mesh[] = []
        for (let j = 0; j < layers[i]; j++) {
            const node = new THREE.Mesh(
                new THREE.SphereGeometry(nodeRadius, 32, 32),
                new THREE.MeshStandardMaterial({ color: getComputedStyle(document.body).getPropertyValue('--cyan') })
            )
            const origin = new THREE.Vector3(0, j * gap, 0)
            node.position.copy(origin)
            gsap.to(node.position, {
                duration: () => Math.random() * 7 + 5,

                y: () => origin.y + nodeRadius / 1.5 * (Math.random() - 0.5),
                x: () => origin.x + nodeRadius / 1.5 * (Math.random() - 0.5),

                ease: 'sine.inOut',
                
                repeat: -1,
                repeatRefresh: true
            })
            group.add(node)
            layerNodes.push(node)

            if (i > 0) {
                for (let k = 0; k < layers[i - 1]; k++) {
                    const edge = createEdge(
                        new THREE.Vector3(-2 * gap, k * gap + (layers[i] - layers[i - 1]) * gap / 2, 0),
                        new THREE.Vector3(0, j * gap, 0),
                        edgeRadius,
                        new THREE.MeshStandardMaterial({ color: getComputedStyle(document.body).getPropertyValue('--violet'), opacity: 0.25, transparent: true })
                    )
                    group.add(edge)

                    if (!edges.has(i - 1)) {
                        edges.set(i - 1, new Map())
                    }
                    if (!edges.get(i - 1)!.has(k)) {
                        edges.get(i - 1)!.set(k, [])
                    }
                    edges.get(i - 1)!.set(k, edges.get(i - 1)!.get(k)!.concat([edge]))
                }
            }
        }
        nodes.push(layerNodes)

        group.position.set(2 * i * gap, -layers[i] * gap / 2, 0)
    }
    network.position.set(-(layers.length - 1) * gap, 0, 0)

    function animateRandomPath() {
        const path = [Math.floor(Math.random() * layers[0])]

        for (let i = 1; i < layers.length; i++) {
            path.push(Math.floor(Math.random() * layers[i]))
        }

        for (let i = 0; i < path.length; i++) {
            const start = nodes[i][path[i]]
            const delay = 0.3 * i

            gsap.to(start.scale, {
                duration: 0.3,

                x: 1.1,
                y: 1.1,
                z: 1.1,

                ease: 'power2.inOut',
                delay: delay
            })
            gsap.to(start.scale, {
                duration: 0.3,

                x: 1,
                y: 1,
                z: 1,

                ease: 'power2.inOut',
                delay: delay + 0.5
            })

            if (i < path.length - 1) {
                const edge = edges.get(i)!.get(path[i])![path[i + 1]]

                gsap.to(edge.scale, {
                    duration: 0.3,

                    x: 3,
                    z: 3,

                    ease: 'power2.inOut',  
                    delay: delay + 0.3
                })
                gsap.to(edge.material, {
                    duration: 0.3,

                    opacity: 1,

                    ease: 'power2.inOut',
                    delay: delay + 0.3
                })
                gsap.to(edge.scale, {
                    duration: 0.3,

                    x: 1,
                    z: 1,

                    ease: 'power2.inOut',
                    delay: delay + 0.6
                })
                gsap.to(edge.material, {
                    duration: 0.3,

                    opacity: 0.25,

                    ease: 'power2.inOut',
                    delay: delay + 0.6
                })
            }
        }
        setTimeout(animateRandomPath, Math.random() * 1000 + 1500)
    }
    animateRandomPath()

    return network
}

function createEdge(start: THREE.Vector3, end: THREE.Vector3, radius = 0.1, material: THREE.Material = new THREE.MeshStandardMaterial({ color: 0xffffff })): THREE.Mesh {
    const direction = new THREE.Vector3().subVectors(end, start)
    const length = direction.length()
  
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16, 1, false)
  
    const mesh = new THREE.Mesh(geometry, material)
  
    const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    mesh.position.copy(midpoint)
  
    const axis = new THREE.Vector3(0, 1, 0)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
        axis,
        direction.clone().normalize()
    )
    mesh.quaternion.copy(quaternion)
  
    return mesh;
  }