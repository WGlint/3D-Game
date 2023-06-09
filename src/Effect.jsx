import { DepthOfField, EffectComposer, SSR } from "@react-three/postprocessing";

export default function Effect()
{


    return <>

    <EffectComposer>

        <DepthOfField
            focusDistance={0.01}
            focusLength={0.2}
            bokehScale={3}
        />
    </EffectComposer>

    </>
}