import gsap from 'gsap'
import * as THREE from 'three'
import { DecalGeometry, GLTFLoader } from 'three/examples/jsm/Addons.js'

const SCENE = new THREE.Scene()

const gltfLoader = new GLTFLoader()
export function setupCamera() {
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 2)
    SCENE.add(ambientLight, pointLight)

    var camera: THREE.Group<THREE.Object3DEventMap> | null = null
    gltfLoader.load("/photography/camera_canon_eos_400d.glb", (gltf) => {
        SCENE.add(gltf.scene)
        gltf.scene.rotation.set(Math.PI / 3, 0, 0)
        gltf.scene.scale.set(0.8, 0.8, 0.8)
        camera = gltf.scene
    })

    CAMERA.position.set(0, 0, 15)
    CAMERA.lookAt(new THREE.Vector3(0, 0, 0))

    projectCanvas("/photography/collections/0/P1020555.JPG").then((model) => {
        model.position.set(1.75, -1, 2)
        model.rotateX(Math.PI / 4)
        model.rotateY(-Math.PI / 12)
        
        gsap.to(model.position, {
            duration: 3,

            y: '+=0.2',

            ease: 'sine.inOut',

            repeat: -1,
            yoyo: true
        })
        gsap.to(model.rotation, {
            duration: 2,

            y: '-=0.1',

            ease: 'sine.inOut',

            repeat: -1,
            yoyo: true
        })
    })
    projectCanvas("/photography/collections/0/P1020552.JPG").then((model) => {
        model.position.set(-3, 1, -2)
        model.rotateX(Math.PI / 6)
        model.rotateY(Math.PI / 12)

        gsap.to(model.position, {
            duration: 3,

            y: '+=0.2',

            ease: 'sine.inOut',

            repeat: -1,
            yoyo: true,
            delay: 1
        })
        gsap.to(model.rotation, {
            duration: 2,

            y: '-=0.1',

            ease: 'sine.inOut',

            repeat: -1,
            yoyo: true
        })
    })

    function animate() {
        requestAnimationFrame(animate)
        renderer.render(SCENE, CAMERA)

        if (camera) {
            const save = camera
            gsap.to(camera.position, {
                duration: 5,

                y: 0.4,

                ease: 'sine.inOut',

                repeat: -1,
                yoyo: true
            })
            gsap.to(camera.rotation, {
                duration: 30,

                y: 2 * Math.PI,

                ease: 'linear',

                repeat: -1
            })
            camera = null
        }
    }
    animate()
}

const textureLoader = new THREE.TextureLoader()
async function projectCanvas(url: string): Promise<THREE.Group<THREE.Object3DEventMap>> {
    const image = new Image()
    image.src = url
    await image.decode()

    const width = image.width
    const height = image.height
    const aspectRatio = width / height

    const group = new THREE.Group()
    SCENE.add(group)
    return new Promise((resolve) => {
        const texture = textureLoader.load(url)
        texture.flipY = false

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: -30,
            polygonOffsetUnits: -30
        })
        material.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <map_fragment>`,
                `
                #include <map_fragment>
        
                if (diffuseColor.a > 0.0) {
                    // luma coefficients (Rec. 709)
                    float gray = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
                    diffuseColor.rgb = vec3(gray);
                }
                `
            )
        }

        gltfLoader.load("/photography/canvas.glb", (gltf) => {
            const target: THREE.Mesh = gltf.scene.children[0].children[0].children[0] as THREE.Mesh
            const size = height > width ? new THREE.Vector3(1.12 * aspectRatio,-1.12,2) : new THREE.Vector3(0.85 * aspectRatio,-0.85,2)
            const geometry = new DecalGeometry(target, new THREE.Vector3(0.005, 0.44, 1), new THREE.Euler(0, 0, height > width ? Math.PI / 2 : 0), size)
            const mesh = new THREE.Mesh(geometry, material)
            group.add(mesh)
            gltf.scene.scale.set(0.89, 1, 1)
            group.add(gltf.scene)
            resolve(group)
            group.position.set(0, 0, 2)
            group.scale.set(3, 3, 3)
            if (height > width) {
                group.rotation.set(0, 0, -Math.PI / 2)
            }
        })
    })
}