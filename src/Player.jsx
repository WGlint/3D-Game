import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three"
import useGame from "./Store/useGame";



export default function Player()
{
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const body = useRef()

    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(100,100,100))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const { rapier, world } = useRapier()
    const rapiertWorld = world.raw()

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

    const jump = () =>
    {
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = {x:0, y:-1, z:0}
        const ray = new rapier.Ray( origin, direction )
        const hit = rapiertWorld.castRay(ray, 10, true)

        if (hit.toi < 0.15)
            body.current.applyImpulse({x:0, y:0.5, z:0})
    }

    const Reset = () =>
    {
        body.current.setTranslation({ x:0, y:1, z:0 })
        body.current.setLinvel({ x:0, y:0, z:0 })
        body.current.setAngvel({ x:0, y:0, z:0 })
    }


    useEffect(() =>
    {
        const unSubReset = useGame.subscribe(
            (state) => state.phase,
            (value) =>
            {
                if(value === "ready")
                    Reset()
            }
        )

        const unSub = subscribeKeys( (state) => state.jump, (value) => 
        {
            if(value)
                jump()
        } )

        const unSubAny = subscribeKeys(
            () =>
            {
                start()
            }
        )

        return () => 
        {
            unSub()
            unSubAny()
            unSubReset()
        }
    }, [])

    useFrame((state, delta) =>
    {
        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x:0, y:0, z:0 }
        const torque = { x:0, y:0, z:0 }

        const impulseStrength = 0.6*delta
        const torqueStrength = 0.2*delta

        if(forward)
        {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }

        if(rightward)
        {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        if(backward)
        {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        if(leftward)
        {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        const bodyPosition = body.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 5.25
        cameraPosition.y += 2.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp( cameraPosition, 5*delta )
        smoothedCameraTarget.lerp( cameraTarget, 5*delta )

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        if(bodyPosition.z < -(blocksCount*4 +2))
            end()

        if(bodyPosition.y < -4)
            restart()
    })

    return <>
    <RigidBody ref={body}  colliders='ball' restitution={0.2} friction={1} linearDamping={0.5} angularDamping={0.5} position={[ 0,1,0 ]} >
        <mesh castShadow >
            <icosahedronGeometry  args={[ 0.3, 1 ]} />
            <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
    </RigidBody>
    </>
}