import * as THREE from 'three'
import * as WORLD from './world'

export {
    SCENE,
    CAMERA
}

const IS_DESKTOP = () => window.innerWidth > window.innerHeight

const CANVAS_HEIGHT = () => IS_DESKTOP() ? "60%" : "40%"
const CANVAS_WIDTH = () => IS_DESKTOP() ? "60%" : "100%"
const CANVAS = document.getElementById("gl-rendering")
CANVAS!.style.width = CANVAS_WIDTH()
CANVAS!.style.height = CANVAS_HEIGHT()
CANVAS!.style.opacity = "0%"

const SCENE = new THREE.Scene()
const CAMERA = new THREE.PerspectiveCamera(75, CANVAS!.offsetWidth / CANVAS!.offsetHeight, 0.1, 1000)
const updateViewOffset = () => CAMERA.setViewOffset(CANVAS!.offsetWidth, CANVAS!.offsetHeight, (IS_DESKTOP() ? -0.4 : 0)*CANVAS!.offsetWidth, (IS_DESKTOP() ? -0.2 : 0)*CANVAS!.offsetHeight, (IS_DESKTOP() ? 1.2  : 1)*CANVAS!.offsetWidth, (IS_DESKTOP() ? 1.2 : 1)*CANVAS!.offsetHeight)
updateViewOffset()

const renderer = new THREE.WebGLRenderer({
  canvas: CANVAS!,
  alpha: true
})
renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)
// renderer.setClearColor(0xff0000)

window.addEventListener("resize", 
function () {
    CANVAS!.style.width = CANVAS_WIDTH()
    CANVAS!.style.height = CANVAS_HEIGHT()
    renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
    CAMERA.aspect = CANVAS!.offsetWidth / CANVAS!.offsetHeight
    updateViewOffset()
    CAMERA.updateProjectionMatrix()
})


const pointLight = new THREE.DirectionalLight(0xffffff, 1)
pointLight.position.set(0, 1, 1)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
SCENE.add(ambientLight, pointLight)

WORLD.setup()

var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight)
var cycle = documentHeight - window.innerHeight
var tick = document.body.getBoundingClientRect().top
var cards = document.getElementsByTagName("card")
var navbar = document.getElementById("navbar")
var num_of_insets = cards.length

for (var i = 0; i < cards.length; i++) {
    const card = cards[i]
    const top = (cycle * ((2 * (i + 1)) - 1) / (2 * num_of_insets)) 
    if (card instanceof HTMLElement) {
        card.style.top = top + "px"

        for (var j = 0; j < navbar!.childNodes.length; j++) {
            var child = navbar!.childNodes[j]
            if (child instanceof HTMLElement) {
                if (child.innerText == card.id) {
                    child.onclick = () => {
                        window.scrollTo({
                            top: top,
                            behavior: "smooth"
                        })
                    }
                }
            }
        }
    }
}


document.body.onscroll = () => {
    tick = document.body.getBoundingClientRect().top

    CANVAS!.style.opacity = 100*Math.min(-tick / window.innerHeight, 1) + "%"
}
function animate() {
    requestAnimationFrame(animate);

    var point = tick % cycle
    var sinusoidal_point = point * ((2*Math.PI)/cycle)
    
    var inset_weight = Math.pow(Math.sin((num_of_insets*Math.PI*point)/cycle), 14)
    CAMERA.position.setZ((20 * inset_weight + 60 * (1 - inset_weight)) * Math.cos(sinusoidal_point))
    CAMERA.position.setX((20 * inset_weight + 60 * (1 - inset_weight)) * Math.sin(sinusoidal_point))
    CAMERA.position.setY(2 * inset_weight + 12 * (1 - inset_weight))

    CAMERA.lookAt(0, 0, 0)

    renderer.render(SCENE, CAMERA);
}

animate();