import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { NearestFilter } from 'three'
import gsap from 'gsap'


//#region global variables
const parameters = { materialColor: '#00c8ff'}
//#endregion global variables





//#region Debug
/**
 * Add the color change control to the UI
 * 
 * NOTES
 * To be removed to reduce loading time...
 * To be tested...
 */

//const gui = new dat.GUI()

/* gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    }) */
//#endregion Debug





//#region 3d objects
/**
 * Add three.js elements to the page
 * 
 * NOTES:
 * Using individual objects...
 * Create one material and apply to all objects...
 */

const canvas    = document.querySelector('canvas.webgl') //-->Fetch the canvas from the HTML...
const scene     = new THREE.Scene()

const textureLoader         = new THREE.TextureLoader()
const gradientTexture       = textureLoader.load('textures/gradients/5.jpg')
gradientTexture.magFilter   = NearestFilter //--> Added to improve visualization of the elements...

const material = new THREE.MeshToonMaterial({
    color:          parameters.materialColor,
    gradientMap:    gradientTexture
})

material.wireframe = true

const objectsDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(1.8,23,23),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.5,23,23),
    material
)

mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2

mesh1.position.x =  0
mesh2.position.x = -4
mesh3.position.x =  3

mesh1.position.z =  0.5

scene.add(mesh1 , mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3, mesh3, mesh3]

/** #8 PARTICLES */
const particlesCount    = 200
const positions         = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) 
{
    positions[i * 3 + 0] = (Math.random() -0.5) * 10 
    positions[i * 3 + 1] =  objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length 
    positions[i * 3 + 2] = (Math.random() -0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color:              parameters.materialColor,
    sizeAttenuation:    true,
    size:               0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/** Required for toon material */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)

//#endregion 3d objects





//#region screen rezising
/**
 * Dinamically change the size of the screen
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    /** Update sizes */
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    /** Update camera */
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    /** Update renderer */
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
//#endregion screen rezising


/** Create a group to fix moving camera with the mouse move issue */
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)


/** Base camera */ 
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas:     canvas,
    alpha:      true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



/**4 SCROLLING CAMERA ENABLE */
/**9 TRIGGERED ANIMATION */
let scrollY         = window.scrollY
let currentSection  = 0

let executed    = false
let executed2   = false 

const descriptionText = 'I\'m an informatics engineer and I\'m currently working for the hot steel rolling industry in Mexico'+
' as a process automation engineer also known as a level 2 engineer. By applying my skills and learning'+
' new ones I\'m always looking to contribute and improve the level 2 automation.'+
'<br><br>'+
'As a process automation engineer I\'m able to analyze field signals from the process, analyze the steel '+ 
'cooling process, make a diagnostic and understand step by step all the possible factors involved '+ 
'in the process.'+
'<br><br>'+
'By using my programming skills I\'m able to make my own C++ prototypes to test and improve the steel cooling control process.'+
'<br><br>'+
'Also I have been able to apply my web development skills to create web portals that improves process and '+ 
'administrative activities using different techniques like AJAX, JQUERY, BOOTSTRAP, etc. '+ 
'Right now I\'m improving my skills on Three.JS and Javascript in order to create our own tools using '+ 
'web developments and add now a 3D functionality to web developments as the background shapes you see.'

const projectTypingDescription = 'A brief showcase of some projects I have been working on and can give you an idea of what I can do for you.'

var typingOptions = {
    strings: [descriptionText],
    typeSpeed: 5,
    showCursor:true,
    loop:false
    };

window.addEventListener('scroll',() =>
{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)
    console.log("NEW: ",newSection,"CURRENT: ",currentSection)

    if (newSection != currentSection) 
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration:   1.5,
                ease:       'power2.inOut',
                x:          '+=6',
                y:          '+=3'
            }
        )    


        var typed
        if (currentSection == 1 && executed == false)
        {
            typingOptions.strings = [descriptionText]
            typed = new Typed('.typing_anim2', typingOptions)
            executed = true
        }
        
        if ( currentSection == 2 && executed2 == false) 
        {
            typingOptions.strings = [projectTypingDescription]
            typed = new Typed('.typing_anim3', typingOptions)
            
            typingOptions.strings = ["C++ algorithm that process temperatures signals from field measurements and determines if there might "+
            "be external factors involved like water or strip surface defects that cause noise into the automation process."]
            typed = new Typed('.typing_anim4', typingOptions)

            executed2 = true
        }
         
        
       
        
        
        
    }

})


/**5 CURSOR POSITION FOR PARALLAX */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove',(event)=>
{
    cursor.x = event.clientX / sizes.width  -0.5
    cursor.y = event.clientY / sizes.height -0.5

    //console.log(cursor)
})

//Animation
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime   = clock.getElapsedTime()
    const deltTime      = elapsedTime - previousTime
    previousTime        = elapsedTime

    /**5 Animate camera to move with scrolling */
    camera.position.y = -scrollY / sizes.height * objectsDistance
    
    /**6 Parallax effect */
    const parallaxX = cursor.x  * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x +=  (parallaxX - cameraGroup.position.x) * 1.5 * deltTime
    cameraGroup.position.y +=  (parallaxY - cameraGroup.position.y) * 1.5 * deltTime


    for(const individualMeshOnArray of sectionMeshes)
    {
        individualMeshOnArray.rotation.x += deltTime * 0.1
        individualMeshOnArray.rotation.y += deltTime * 0.1
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()