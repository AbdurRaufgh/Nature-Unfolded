// 1. SCENE SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0a0a0a, 1, 15);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ 
    canvas: document.querySelector('#scene-container'), 
    antialias: true, 
    alpha: true 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. THE OBJECT (Improved Fabric Material)
const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);
const material = new THREE.MeshStandardMaterial({ 
    color: 0xffcc33, 
    side: THREE.DoubleSide,
    roughness: 0.85, // High roughness = Matte Cloth
    metalness: 0.05, // Low metalness = Organic feel
    flatShading: false
});
const wrap = new THREE.Mesh(geometry, material);
scene.add(wrap);

// 3. BACKGROUND PARTICLES (Deep Atmosphere)
const particlesGeometry = new THREE.BufferGeometry();
const count = 1500;
const positions = new Float32Array(count * 3);
for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 25;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({ size: 0.012, color: 0xffcc33, transparent: true, opacity: 0.4 });
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// 4. STUDIO LIGHTING (Soft & Professional)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Bright room light
scene.add(ambientLight);

const softLight = new THREE.DirectionalLight(0xffffff, 0.4);
softLight.position.set(5, 5, 5);
scene.add(softLight);

// 5. INTERACTION LOGIC
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

let isBag = false;
document.querySelector('.cta').addEventListener('click', () => {
    isBag = !isBag;
    // Fast spin transition
    gsap.to(wrap.rotation, { y: wrap.rotation.y + Math.PI * 2, duration: 1.2, ease: "expo.out" });
    
    if(isBag) {
        gsap.to(wrap.material.color, { r: 0.55, g: 0.35, b: 0.2, duration: 1 }); // Brown Bag
        gsap.to(wrap.scale, { x: 0.75, y: 1.5, duration: 1 });
        document.querySelector('.cta').innerText = "Back to Wraps";
    } else {
        gsap.to(wrap.material.color, { r: 1, g: 0.8, b: 0.2, duration: 1 }); // Gold Wrap
        gsap.to(wrap.scale, { x: 1, y: 1, duration: 1 });
        document.querySelector('.cta').innerText = "Explore Materials";
    }
});

// 6. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.002;

    // Organic Cloth Ripple
    const pos = wrap.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Combining two waves for a natural fabric "wiggle"
        const wave = Math.sin(x + time) * 0.15 + Math.cos(y + time * 0.5) * 0.1;
        pos.setZ(i, wave);
    }
    pos.needsUpdate = true;

    // Smooth Interactive Motion
    wrap.rotation.y += (mouseX * 0.3 - wrap.rotation.y) * 0.05;
    wrap.rotation.x += (-mouseY * 0.3 - wrap.rotation.x) * 0.05;

    // Scroll Reaction
    const scrollY = window.scrollY;
    gsap.to(wrap.position, {
        z: Math.min(scrollY * 0.004, 2.2),
        x: -(scrollY * 0.0015),
        overwrite: true
    });

    particlesMesh.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();