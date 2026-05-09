// 1. SCENE SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 15);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const canvas = document.querySelector('#scene-container');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. MAIN OBJECT: BIOFOLD WRAP
const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);
const material = new THREE.MeshPhongMaterial({ 
    color: 0xffcc33, 
    side: THREE.DoubleSide,
    shininess: 80
});
const wrap = new THREE.Mesh(geometry, material);
scene.add(wrap);

// 3. FLOATING BIO-ICONS
const iconGroup = new THREE.Group();
const organicIcon = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.3, 0), 
    new THREE.MeshPhongMaterial({ color: 0x22ff88, wireframe: true })
);
organicIcon.position.set(-3, 2, 1);

const resinIcon = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.6, 6), 
    new THREE.MeshPhongMaterial({ color: 0xffaa00, wireframe: true })
);
resinIcon.position.set(3, -2, 1);

iconGroup.add(organicIcon, resinIcon);
scene.add(iconGroup);

// 4. LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 5, 5);
scene.add(spotLight);

// 5. INTERACTION LOGIC
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Product Toggle Function
let isBag = false;
function changeProduct() {
    isBag = !isBag;
    
    // Premium Spin Transition
    gsap.to(wrap.rotation, { y: wrap.rotation.y + Math.PI * 4, duration: 1.2, ease: "power2.inOut" });

    if(isBag) {
        gsap.to(wrap.material.color, { r: 0.5, g: 0.35, b: 0.2, duration: 1 });
        gsap.to(wrap.scale, { x: 0.7, y: 1.4, duration: 1 });
        document.querySelector('.cta').innerText = "Back to Wraps";
    } else {
        gsap.to(wrap.material.color, { r: 1, g: 0.8, b: 0.2, duration: 1 });
        gsap.to(wrap.scale, { x: 1, y: 1, duration: 1 });
        document.querySelector('.cta').innerText = "Explore Materials";
    }
}
document.querySelector('.cta').addEventListener('click', changeProduct);

// 6. ANIMATION LOOP (The "Sick" Animation Math)
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.003; // Speed of the ripple

    // The Complex Ripple
    const pos = wrap.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const wave = Math.sin(x + time) * 0.15 + Math.sin(y + time * 0.5) * 0.1;
        pos.setZ(i, wave);
    }
    pos.needsUpdate = true;

    // Smooth Interactive Motion
    wrap.rotation.y += (mouseX * 0.4 - wrap.rotation.y) * 0.08;
    wrap.rotation.x += (-mouseY * 0.4 - wrap.rotation.x) * 0.08;

    // Icon floating
    organicIcon.rotation.y += 0.02;
    resinIcon.rotation.x += 0.02;
    iconGroup.position.y = Math.sin(time * 0.5) * 0.3;

    renderer.render(scene, camera);
}

// 7. SCROLL HANDLING
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    gsap.to(wrap.position, {
        z: Math.min(scrollY * 0.004, 2.2),
        x: -(scrollY * 0.0015),
        duration: 0.6
    });
});

// 8. RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();