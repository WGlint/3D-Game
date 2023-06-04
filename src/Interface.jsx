import { useKeyboardControls } from "@react-three/drei"
import { addEffect } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import useGame from "./Store/useGame"


export default function Interface()
{
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    const Timer = useRef()

    useEffect(() =>
    {
        const unSubEffect = addEffect(() =>
        {
            const state = useGame.getState()

            let elapsedTime = 0

            if(state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if (state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            if(Timer.current)
                Timer.current.textContent = elapsedTime
        })

        return () =>
        {
            unSubEffect()
        }
    }, [])

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)


    return <div className="interface" >
        <div className="time" ref={Timer} > 0.00 </div>

        { phase === 'ended' && <div className="restart" onClick={restart} > Restart </div> }

        <div className="controls">
            <div className="raw">
                <div className={ `key ${ forward ? 'active' : '' }` }></div>
            </div>
            <div className="raw">
                <div className={ `key ${ leftward ? 'active' : '' }` }></div>
                <div className={ `key ${ backward ? 'active' : '' }` }></div>
                <div className={ `key ${ rightward ? 'active' : '' }` }></div>
            </div>
            <div className="raw">
                <div className={ `key large ${ jump ? 'active' : '' }` }></div>
            </div>
        </div>

    </div>
}