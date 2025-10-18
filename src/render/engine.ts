import * as THREE from 'three'
import * as WORLD from './world'


const CANVAS = document.getElementById("gl-rendering")
CANVAS!.style.height = "100%"
CANVAS!.style.width = "100%"
CANVAS!.style.opacity = "20%"

export const SCENE = new THREE.Scene()
export const CAMERA = new THREE.PerspectiveCamera(75, CANVAS!.offsetWidth / CANVAS!.offsetHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
    canvas: CANVAS!,
    alpha: true
})
renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)

window.addEventListener("resize", 
    function () {
        CANVAS!.style.width = "100%"
        CANVAS!.style.height = "100%"
        renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
        CAMERA.aspect = CANVAS!.offsetWidth / CANVAS!.offsetHeight
        CAMERA.updateProjectionMatrix()
    }
)


const pointLight = new THREE.DirectionalLight(0xffffff, 1)
pointLight.position.set(0, 1, 1)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
SCENE.add(ambientLight, pointLight)

WORLD.setup()

var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
var cycle = documentHeight - window.innerHeight
var tick = document.body.getBoundingClientRect().top


document.body.onscroll = () => {
    tick = document.body.getBoundingClientRect().top
}

function animate() {
    requestAnimationFrame(animate)

    var point = tick % cycle
    CAMERA.position.setY((1/10) * point)

    renderer.render(SCENE, CAMERA)
}
animate()