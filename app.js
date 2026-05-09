// 1. SETUP
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 1, 15);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#scene-container'), antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. OBJECTS
const wrap = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4, 64, 64),
    new THREE.MeshPhongMaterial({ color: 0xffcc33, side: THREE.DoubleSide, shininess: 80 })
);
scene.add(wrap);

// 3D Bio-Icons
const iconGroup = new THREE.Group();
const organicIcon = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), new THREE.MeshPhongMaterial({ color: 0x22ff88, wireframe: true }));
organicIcon.position.set(-3, 2, 1);
const resinIcon = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 6), new THREE.MeshPhongMaterial({ color: 0xffaa00, wireframe: true }));
resinIcon.position.set(3, -2, 1);
iconGroup.add(organicIcon, resinIcon);
scene.add(iconGroup);

// 3. LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 5, 5);
scene.add(spotLight);

// 4. INTERACTION
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

let isBag = false;
function changeMaterial(type) {
    gsap.to(wrap.rotation, { y: wrap.rotation.y + Math.PI * 4, duration: 1.2, ease: "power2.inOut" });
    if(type === 'bag') {
        gsap.to(wrap.material.color, { r: 0.5, g: 0.35, b: 0.2, duration: 1 });
        gsap.to(wrap.scale, { x: 0.7, y: 1.4, duration: 1 });
        document.querySelector('.cta').innerText = "Back to Wraps";
    } else {
        gsap.to(wrap.material.color, { r: 1, g: 0.8, b: 0.2, duration: 1 });
        gsap.to(wrap.scale, { x: 1, y: 1, duration: 1 });
        document.querySelector('.cta').innerText = "Explore Materials";
    }
}
document.querySelector('.cta').addEventListener('click', () => {
    isBag = !isBag;
    changeMaterial(isBag ? 'bag' : 'wrap');
});

// 5. ANIMATE
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    // Ripple
    const pos = wrap.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        pos.setZ(i, Math.sin(pos.getX(i) + time * 2) * 0.12);
    }
    pos.needsUpdate = true;

    // Interaction & Scroll
    const scrollY = window.scrollY;
    wrap.rotation.y += (mouseX * 0.5 - wrap.rotation.y) * 0.05;
    wrap.rotation.x += (-mouseY * 0.5 - wrap.rotation.x) * 0.05;
    wrap.position.z = Math.min(scrollY * 0.005, 2.5);
    wrap.position.x = -(scrollY * 0.002);

    organicIcon.rotation.y += 0.01;
    resinIcon.rotation.x += 0.01;
    iconGroup.position.y = Math.cos(time * 0.5) * 0.2;

    renderer.render(scene, camera);
}
animate();