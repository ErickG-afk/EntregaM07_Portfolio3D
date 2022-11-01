import './style.css'

import * as THREE from 'three';
import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

//Creando escena
const scene = new THREE.Scene();

//Creando camara (Field of View, aspect ratio, visibilidad de objetos)
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

//Creando un renderer 
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background'),
});

renderer.setPixelRatio(window.devicePixelRatio);
//Hacer el navegador full screen
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

//LLamar al metodo render para renderizar la escena
renderer.render(scene,camera);

//TorusKnot
const geometry =new THREE.TorusKnotGeometry(2, 0.5, 81, 10)
const material = new THREE.MeshStandardMaterial({color:0x049ef4,map: new THREE.TextureLoader().load("NormalMap.png")})
material.metalness = 0.7
material.roughness= 0.2
const torus = new THREE.Mesh(geometry, material)
scene.add(torus)
torus.position.set(10,3,0)

//Dodecahedron
const geometry1 = new THREE.DodecahedronGeometry(5,0)
const material1 = new THREE.MeshLambertMaterial({color:0xF49F1C,wireframe:true })
const dodeCahedron = new THREE.Mesh(geometry1, material1)
scene.add(dodeCahedron)
dodeCahedron.position.set(10,3,0)



//Punto de luz
const lightSource = new THREE.PointLight(0x131111)
lightSource.position.set(5,5,5)
const ambientLight = new THREE.AmbientLight(0xffffff,0.9)
scene.add(lightSource, ambientLight)

//Controles de orbita para interactuar con el raton 
const orbitControls = new OrbitControls(camera, renderer.domElement);

//Popular la escena con elementos generados aleatoriamente 
function addStars(){
  const geometry = new THREE.SphereGeometry(0.10,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry,material);

  //Generar valores aleatorios de x, y ,z usando un array de 3 dimensiones con la funcion random spread
  const[x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

//Generar numero aleatorio de estrellas
Array(300).fill().forEach(addStars);

//Poner un background a la pagina 
const setBackground = new THREE.TextureLoader().load('space.jpg');
scene.background = setBackground

//Luna con un mapa de normal
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({map: moonTexture, normalMap:normalTexture})
);
scene.add(moon);
moon.position.z = -20;
moon.position.setX(5);


//Funcion para mover la camara con respecto a la posicion del usuario en la pagina web
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  
  moon.rotation.x+= 0.005;
  moon.rotation.y+= 0.0075;
  moon.rotation.z+= 0.005;
  moon.position.y = window.scrollY* .01

  
  camera.position.z = t*-0.01;
  camera.position.x = t*-0.0002;
  camera.position.y = t*-0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

//Interactuar con la luna segun movimiento del mouse
document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const widnowX = window.innerWidth/2
const windowY = window.innerHeight/2

function onDocumentMouseMove(event)
{
    mouseX = (event.clientX - widnowX)
    mouseY = (event.clientY - windowY)
}

const clock = new THREE.Clock()

//Funcion recursiva para el metodo render
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x+=0.001;
  torus.rotation.y+=0.0023;
  torus.rotation.z+=0.001;

  targetX = mouseX * .001
  targetY = mouseY * .001
  const elapsedTime = clock.getElapsedTime()

  moon.rotation.y = .5 * elapsedTime

  moon.rotation.x += .05*(targetY -moon.rotation.x)
  moon.rotation.y += .5*(targetX -moon.rotation.y)
  moon.position.z += -.05*(targetY -moon.rotation.x)

 
 
  // orbitControls.update();
  renderer.render(scene,camera);
}

animate()

//Hacer el proyecto responsive
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', ()=>
{
  sizes.width = window.innerWidth
  sizes.height=window.innerHeight

  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width,sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})






