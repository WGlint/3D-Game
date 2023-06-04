import { OrbitControls } from '@react-three/drei'
import { Debug, Physics } from '@react-three/rapier'
import Effect from './Effect.jsx'
import {Level} from './Level.jsx'
import Lights from './Lights.jsx'
import Player from './Player.jsx'
import useGame from './Store/useGame.jsx'

export default function Experience()
{
    const BlockCount = useGame((state) => state.blocksCount)
    const blockSeed = useGame((state) => state.blockSeed)


    return <>

        <Physics>

            <Lights />
            <Level count={BlockCount} seed={blockSeed} />
            <Player />
        </Physics>

        <Effect />

    </>
}