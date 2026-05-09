// 1. SCENE SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 15);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#scene-container'), 
    antialias: true, 
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. MAIN OBJECT
const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);
const material = new THREE.MeshPhongMaterial({ 
    color: 0xffcc33, 
    side: THREE.DoubleSide,
    shininess: 100, // Boosted for more "pop"
    specular: 0xffffff
});
const wrap = new THREE.Mesh(geometry, material);
scene.add(wrap);

// 3. THE "POLLEN" FIELD (Fills the emptiness)
const particlesGeometry = new THREE.BufferGeometry();
const count = 2500; // Way more particles
const positions = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20; // Spread them wide
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ 
    size: 0.015, 
    color: 0xffcc33, 
    transparent: true, 
    opacity: 0.6 
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 4. LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const light1 = new THREE.PointLight(0xffffff, 2);
light1.position.set(2, 3, 4);
scene.add(light1);

// 5. LOGIC & INTERACTION
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

let isBag = false;
document.querySelector('.cta').addEventListener('click', () => {
    isBag = !isBag;
    gsap.to(wrap.rotation, { y: wrap.rotation.y + Math.PI * 2, duration: 1, ease: "power2.inOut" });
    if(isBag) {
        gsap.to(wrap.material.color, { r: 0.6, g: 0.4, b: 0.2, duration: 0.8 });
        gsap.to(wrap.scale, { x: 0.8, y: 1.4, duration: 0.8 });
        document.querySelector('.cta').innerText = "Back to Wraps";
    } else {
        gsap.to(wrap.material.color, { r: 1, g: 0.8, b: 0.2, duration: 0.8 });
        gsap.to(wrap.scale, { x: 1, y: 1, duration: 0.8 });
        document.querySelector('.cta').innerText = "Explore Materials";
    }
});

// 6. ANIMATION
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.002;

    // Organic Ripple
    const pos = wrap.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const wave = Math.sin(x + time) * 0.2 + Math.cos(y + time) * 0.1;
        pos.setZ(i, wave);
    }
    pos.needsUpdate = true;

    // Follow Mouse
    wrap.rotation.y += (mouseX * 0.4 - wrap.rotation.y) * 0.05;
    wrap.rotation.x += (-mouseY * 0.4 - wrap.rotation.x) * 0.05;

    // Scroll effect
    const scrollY = window.scrollY;
    wrap.position.z = Math.min(scrollY * 0.005, 2.5);
    wrap.position.x = -(scrollY * 0.0015);

    // Particle movement (Drifting effect)
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    renderer.render(scene, camera);
}
animate();