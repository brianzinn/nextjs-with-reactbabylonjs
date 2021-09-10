import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial' // needed for side-effect
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Scene } from '@babylonjs/core/scene'
import { Nullable } from '@babylonjs/core/types'
import SceneComponent from 'babylonjs-hook'
import React from 'react'
import tw from 'twin.macro'

// not good for hot reloading (should be a ref instead)
let box: Nullable<Mesh> = null

const onSceneReady = (scene: Scene) => {
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene)

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero())

  const canvas = scene.getEngine().getRenderingCanvas()

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true)

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox('box', { size: 2 }, scene)

  // Move the box upward 1/2 its height
  box.position.y = 1

  const boxMat = new StandardMaterial('box', scene)
  boxMat.diffuseColor = Color3.Red()
  boxMat.specularColor = Color3.Black()
  box.material = boxMat

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  if (box !== null) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime()

    const rpm = 10
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
  }
}

const Wave = () => {
  // const minZ = -((config.amount.z * config.separation) / 2)

  return (
    <div css={[tw`flex-auto`]}>
      <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="wave-canvas" />
    </div>
  )
}

export default Wave
