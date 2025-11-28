


const N_PARTICLES = 15
const ATTENUATION = 0.0013


export function animateHero() {
    const HERO_CANVAS = document.querySelector('#hero canvas') as HTMLCanvasElement

    HERO_CANVAS.width = HERO_CANVAS.getBoundingClientRect().width * window.devicePixelRatio
    HERO_CANVAS.height = HERO_CANVAS.getBoundingClientRect().height * window.devicePixelRatio

    var mouse: [number, number] | undefined = undefined
    document.addEventListener('mousemove', (e) => {
        const rect = HERO_CANVAS.getBoundingClientRect()

        if (mouse == undefined) {
            mouse = [0, 0]
        }

        mouse[0] = (e.clientX - rect.left)
        mouse[1] = (e.clientY - rect.top)
    })

    document.addEventListener('mouseup', () => {
        if (mouse != undefined) {
            for (const particle of particles) {
                const dx = mouse[0] - particle.pos[0]
                const dy = mouse[1] - particle.pos[1]
            
                const dist = Math.sqrt(dx * dx + dy * dy)
                const dirToMouse = dist > 0 ? [dx / dist, dy / dist] : [0, 0]

                const magnitude = Math.sqrt(particle.velocity[0] ** 2 + particle.velocity[1] ** 2)

            
                particle.velocity[0] = -dirToMouse[0] * magnitude
                particle.velocity[1] = -dirToMouse[1] * magnitude
            }
        }
    })

    // HERO
    const ctx = HERO_CANVAS.getContext('2d') as CanvasRenderingContext2D

    const particles: { pos: [number, number], velocity: [number, number], radius: number, color: string }[] = []
    for (let i = 0; i < N_PARTICLES; i++) {
        particles.push({
            pos: [Math.random() * (HERO_CANVAS.width / window.devicePixelRatio), Math.random() * (HERO_CANVAS.height / window.devicePixelRatio)],
            velocity: [(Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.1 + 0.05), (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.1 + 0.05)],
            radius: Math.random() * 10 + 10,
            color: getRandomVibrantHex()
        })
    }

    var lastTime = new Date().getTime()
    function loop() {
        requestAnimationFrame(loop)

        HERO_CANVAS.width = HERO_CANVAS.getBoundingClientRect().width * window.devicePixelRatio
        HERO_CANVAS.height = HERO_CANVAS.getBoundingClientRect().height * window.devicePixelRatio
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
        ctx.clearRect(0, 0, HERO_CANVAS.width, HERO_CANVAS.height)

        const currentTime = new Date().getTime()
        const deltaTime = currentTime - lastTime
        lastTime = currentTime

        for (const particle of particles) {
            var testX = particle.pos[0] + particle.velocity[0] * deltaTime
            var testY = particle.pos[1] + particle.velocity[1] * deltaTime

            // Collision detection
            // Wall
            if (testX - particle.radius < 0) {
                particle.velocity[0] = Math.abs(particle.velocity[0])
            }
            if (testX + particle.radius > (HERO_CANVAS.width / window.devicePixelRatio)) {
                particle.velocity[0] = -Math.abs(particle.velocity[0])
            }
            if (testY - particle.radius < 0) {
                particle.velocity[1] = Math.abs(particle.velocity[1])
            }
            if (testY + particle.radius > (HERO_CANVAS.height / window.devicePixelRatio)) {
                particle.velocity[1] = -Math.abs(particle.velocity[1])
            }

            // Other particles
            for (const otherParticle of particles) {
                if (otherParticle != particle) {
                    const dx = otherParticle.pos[0] - testX
                    const dy = otherParticle.pos[1] - testY
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    if (distance < particle.radius + otherParticle.radius) {
                        const angle = Math.atan2(dy, dx)
                        const magnitude = Math.sqrt(particle.velocity[0] * particle.velocity[0] + particle.velocity[1] * particle.velocity[1])
                        particle.velocity[0] = -magnitude * Math.cos(angle)
                        particle.velocity[1] = -magnitude * Math.sin(angle)

                        const otherMagnitude = Math.sqrt(otherParticle.velocity[0] * otherParticle.velocity[0] + otherParticle.velocity[1] * otherParticle.velocity[1])
                        otherParticle.velocity[0] = otherMagnitude * Math.cos(angle)
                        otherParticle.velocity[1] = otherMagnitude * Math.sin(angle)
                    }
                }
            }

            if (mouse != undefined) {
                const dx = mouse[0] - particle.pos[0]
                const dy = mouse[1] - particle.pos[1]
            
                const dist = Math.sqrt(dx * dx + dy * dy)
                const dirToMouse = dist > 0 ? [dx / dist, dy / dist] : [0, 0]
        
                const velMag = Math.sqrt(particle.velocity[0] ** 2 + particle.velocity[1] ** 2)
                const velDir = velMag > 0 ? [
                    particle.velocity[0] / velMag,
                    particle.velocity[1] / velMag
                ] : [0, 0]

                const timedAttenuation = ATTENUATION * deltaTime
        
                const blendedDir: [number, number] = [
                    (1 - timedAttenuation) * velDir[0] + timedAttenuation * dirToMouse[0],
                    (1 - timedAttenuation) * velDir[1] + timedAttenuation * dirToMouse[1]
                ]
            
                const blendedMag = Math.sqrt(blendedDir[0] ** 2 + blendedDir[1] ** 2)
                blendedDir[0] /= blendedMag
                blendedDir[1] /= blendedMag
            
                particle.velocity[0] = blendedDir[0] * velMag
                particle.velocity[1] = blendedDir[1] * velMag
            }


            // Render
            ctx.fillStyle = particle.color
            ctx.beginPath()
            ctx.arc(particle.pos[0], particle.pos[1], particle.radius, 0, 2 * Math.PI)
            ctx.fill()

            particle.pos[0] = testX
            particle.pos[1] = testY
        }
    }
    requestAnimationFrame(loop)
}


// Helpers
function getRandomVibrantHex() {
    const hue = Math.floor(Math.random() * 360)
    const saturation = Math.floor(Math.random() * 30) + 70
    const lightness = Math.floor(Math.random() * 20) + 50
  
    const h = hue / 360
    const s = saturation / 100
    const l = lightness / 100
  
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
        const k = (n + h * 12) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(color * 255)
    }
  
    const r = f(0)
    const g = f(8)
    const b = f(4)
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)}`
  }