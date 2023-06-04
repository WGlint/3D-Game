import { Float,Text, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState } from 'react'
import { useRef } from 'react'
import * as THREE from 'three'

THREE.ColorManagement.legacyMode = false

const boxGeometry = new THREE.BoxGeometry(1,1,1)
const cylindreGeometry = new THREE.CylinderGeometry(2,2,5,50)

const floor1Material = new THREE.MeshStandardMaterial({ color : '#111111', metalness:0, roughness: 0 })
const floor2Material = new THREE.MeshStandardMaterial({ color : '#222222', metalness:0, roughness: 0 })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color : '#ff0000', metalness:0, roughness: 1 })
const wallMaterial = new THREE.MeshStandardMaterial({ color : '#887777', metalness:0, roughness: 0 })

export function BlockStart({ position= [ 0,0,0 ] })
{
    return <group position={position} >
        <Float floatIntensity={0.25} >
            <Text 
                font='./bebas-neue-v9-latin-regular.woff' 
                scale={0.3} 
                maxWidth={5}
                lineHeight={0.75}
                textAlign="center"
                position={[ 0.95, 0.65,0 ]}
                position-y={ 0.85 }
                > 
            TESLA MODEL 3 {'<3'} 
            <meshBasicMaterial toneMapped={ false } />
            </Text>
        </Float>
        <mesh geometry={boxGeometry} scale={[ 4,0.2,4 ]} receiveShadow position={[ 0, -0.1,0 ]} material={floor1Material} />
    </group>
}

export function BlockSpinner({ position= [ 0,0,0 ] })
{
    const obstacle = useRef()
    const [ speed ] = useState( () => { return (Math.random()*( Math.random() > 0.5 ? 1 : -1 )) } )

    useFrame((state) =>
    {
        const time = state.clock.elapsedTime

        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time*speed*2 , 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    return <group position={position} >
        <mesh geometry={boxGeometry} scale={[ 4,0.2,4 ]} receiveShadow position={[ 0, -0.1,0 ]} material={floor2Material} />
        <RigidBody colliders="hull" ref={obstacle} type='kinematicPosition' position={[ 0,1.1,0 ]} restitution={0.3} friction={ 0 } >
            <mesh geometry={cylindreGeometry} scale={[ 0.2,0.5,0.2 ]} receiveShadow castShadow material={obstacleMaterial}/>
            <mesh geometry={boxGeometry} scale={[ 3.5,0.3,0.2 ]} position={[ 0,0,0 ]} rotation-y={Math.PI/2} receiveShadow castShadow material={obstacleMaterial}/>
            <mesh geometry={boxGeometry} scale={[ 3.5,0.3,0.2 ]} position={[ 0,0.8,0 ]} receiveShadow castShadow material={obstacleMaterial}/>
            <mesh geometry={boxGeometry} scale={[ 3.5,0.3,0.2 ]} position={[ 0,-0.8,0 ]} receiveShadow castShadow material={obstacleMaterial}/>
        </RigidBody>
    </group>
}

export function BlockLimbo({ position= [ 0,0,0 ] })
{
    const obstacle = useRef()
    const [ timeOffset ] = useState( () => { return (Math.random()* Math.PI*2 ) } )

    useFrame((state) =>
    {
        const time = state.clock.elapsedTime

        const amplitube = 0.6

        obstacle.current.setNextKinematicTranslation({ x:position[0], y:position[0] + amplitube*Math.sin(time+timeOffset)+amplitube+0.15,z:position[2]})

    })

    return <group position={position} >
        <mesh geometry={boxGeometry} scale={[ 4,0.2,4 ]} receiveShadow position={[ 0, -0.1,0 ]} material={floor2Material} />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[ 0,0.3,0 ]} restitution={0.3} friction={ 0 } >
            <mesh geometry={boxGeometry} scale={[ 3.5,0.3,0.2 ]} receiveShadow castShadow material={obstacleMaterial}/>
        </RigidBody>
    </group>
}

export function BlockAxe({ position= [ 0,0,0 ] })
{
    const obstacle = useRef()
    const [ timeOffset ] = useState( () => { return (Math.random()* Math.PI*2 ) } )

    useFrame((state) =>
    {
        const time = state.clock.elapsedTime

        const amplitube = 1.25

        obstacle.current.setNextKinematicTranslation({ x:position[0] + amplitube*Math.sin(time+timeOffset), y:position[0]+0.75,z:position[2]})

    })

    return <group position={position} >
        <mesh geometry={boxGeometry} scale={[ 4,0.2,4 ]} receiveShadow position={[ 0, -0.1,0 ]} material={floor2Material} />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[ 0,0.3,0 ]} restitution={0.3} friction={ 0 } >
            <mesh geometry={boxGeometry} scale={[ 1.5,1.5,0.3 ]} receiveShadow castShadow material={obstacleMaterial}/>
        </RigidBody>
    </group>
}

export function BlockEnd({ position= [ 0,0,0 ] })
{
    const hamburger = useGLTF('./hamburger.glb')

    hamburger.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })

    return <group position={position} >
        <Float floatIntensity={0.25} >
            <Text 
                font='./bebas-neue-v9-latin-regular.woff' 
                scale={1.3} 
                maxWidth={5}
                lineHeight={0.75}
                textAlign="center"
                position={[ 0.25, 0.65,0 ]}
                position-y={ 2.85 }
                > 
            ! FINISH ! 
            <meshBasicMaterial toneMapped={ false } />
            </Text>
        </Float>
        <RigidBody type='fixed' colliders="hull" friction={0} restitution={0.2}  >
            <primitive object={ hamburger.scene } scale={0.2} position={[ 0,0.3,0 ]} />
        </RigidBody>
        <mesh geometry={boxGeometry} scale={[ 4,0.3,4 ]} receiveShadow position={[ 0, -0.05,0 ]} material={floor1Material} />
    </group>
}

export function Bounds({ length=1 })
{
    return <>
    <RigidBody type='fixed' restitution={0.2} friction={0} >
        <mesh   
            position = {[ 2.15, 0.75, -(length*2) + 2 ]}
            geometry = { boxGeometry }
            material = { wallMaterial }
            scale= { [ 0.3, 1.5, 4*length ] }
            castShadow
        />
        <mesh   
            position = {[ -2.15, 0.75, -(length*2) + 2 ]}
            geometry = { boxGeometry }
            material = { wallMaterial }
            scale= { [ 0.3, 1.5, 4*length ] }
            receiveShadow
        />
        <mesh   
            position = {[ 0, 0.75, -(length*4) + 2 ]}
            geometry = { boxGeometry }
            material = { wallMaterial }
            scale= { [ 4, 1.5, 0.3 ] }
            receiveShadow
        />
        <CuboidCollider
            args={[ 2, 0.1, 2*length ]}
            position={ [ 0, -0.1, -(length*2) + 2 ] }
            restitution={0.2}
            friction={1}
        />
    </RigidBody>
    </>
}

export function Level( { count = 5, types = [ BlockSpinner, BlockLimbo, BlockAxe ], seed = 0  } ) {


    const block = useMemo(() => 
    {
        const block = []

        for(let i = 0; i < count; i++)
        {
            block.push(types[ Math.floor( Math.random() * types.length ) ])
        }

        return block


    }, [ count, types, seed ])


    return <>

        <BlockStart position={[0,0,0]} />
        { block.map((Block, index) => < Block key={index} position={[ 0,0, -4*(index+1) ]}  />) }
        <BlockEnd position={[0,0,-(count+1)*4]} />

        <Bounds length={count + 2} />
        
    </>
}