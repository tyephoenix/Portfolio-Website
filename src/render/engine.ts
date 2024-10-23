import * as THREE from 'three'
import * as WORLD from './world'

export {
    SCENE,
    CAMERA
}

const CANVAS = document.getElementById("gl-rendering")
CANVAS!.style.height = "100%"
CANVAS!.style.width = "100%"
CANVAS!.style.opacity = "20%"

const SCENE = new THREE.Scene()
const CAMERA = new THREE.PerspectiveCamera(75, CANVAS!.offsetWidth / CANVAS!.offsetHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
    canvas: CANVAS!,
    alpha: true
})
renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
renderer.setPixelRatio(window.devicePixelRatio)
// renderer.setClearColor(0xff0000)

window.addEventListener("resize", 
function () {
    CANVAS!.style.width = "100%"
    CANVAS!.style.height = "100%"
    renderer.setSize(CANVAS!.offsetWidth, CANVAS!.offsetHeight)
    CAMERA.aspect = CANVAS!.offsetWidth / CANVAS!.offsetHeight
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
var cards = document.getElementsByClassName("card")
var navbar = document.getElementById("navbar")

for (var i = 0; i < cards.length; i++) {
    const card = cards[i]
    if (card instanceof HTMLElement) {
        card.style.top = top + "px"

        for (var j = 0; j < navbar!.childNodes.length; j++) {
            var child = navbar!.childNodes[j]
            if (child instanceof HTMLElement) {
                if (child.innerText == card.id) {
                    child.onclick = () => {
                        window.scrollTo({
                            top: card.offsetTop,
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
}
function animate() {
    requestAnimationFrame(animate);

    var point = tick % cycle
    // var sinusoidal_point = point * ((2*Math.PI)/cycle)
    
    // var inset_weight = Math.pow(Math.sin((num_of_insets*Math.PI*point)/cycle), 14)
    // CAMERA.position.setZ((20 * inset_weight + 60 * (1 - inset_weight)) * Math.cos(sinusoidal_point))
    // CAMERA.position.setX((20 * inset_weight + 60 * (1 - inset_weight)) * Math.sin(sinusoidal_point))
    CAMERA.position.setY((1/10) * point)

    // CAMERA.lookAt(0, 0, 0)

    renderer.render(SCENE, CAMERA);
}
animate();