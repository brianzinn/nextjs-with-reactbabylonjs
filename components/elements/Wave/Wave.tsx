import { Animation, Vector3 } from '@babylonjs/core'
import React, { useEffect, useRef } from 'react'
import { Engine, Scene, useScene } from 'react-babylonjs'
import * as R from 'remeda'
import tw from 'twin.macro'

function combine<T>(list1: T[], list2: T[]): T[][] {
  return list1.map((x) => list2.map((y) => [x, y])).reduce((acc, tuple) => acc.concat(tuple), [])
}

const config = {
  amount: { x: 50, z: 50 },
  separation: 2,
  frameRate: 60,
  animation: {
    length: 360,
    speed: 8
  }
}

const WithAnimation = () => {
  const groupRef = useRef(null)
  const sphereRef = useRef([])
  const scene = useScene()

  const position = Vector3.Zero()

  useEffect(() => {
    if (!sphereRef.current || scene == null) {
      return
    }

    const refs = sphereRef.current
    refs.forEach(({ indexX, indexZ, el }) => {
      const animations = getYAnimation(indexX, indexZ)

      scene.beginDirectAnimation(
        el,
        animations,
        0,
        (config.animation.length * config.frameRate) / config.animation.speed, // TODO, what is the correct start = endpoint? currently its length of the animation
        true
      )
    })
  })

  const onCreated = () => {
    // console.timeLog('Timing', 'onCreated');
  }

  const spheres = getSpheres(config.amount, config.separation, sphereRef)

  return (
    <transformNode name="group" ref={groupRef} position={position} onCreated={onCreated}>
      {spheres}
    </transformNode>
  )
}

function getSpheres(
  amount: { x: number; z: number },
  separation: number,
  ref: React.MutableRefObject<{ [key: number]: unknown }>
) {
  const rangeX = R.range(0, amount.x)
  const rangeZ = R.range(0, amount.z)

  return combine(rangeX, rangeZ).map(([x, z], idx) => {
    const key = `sphere-${x}-${z}`

    return (
      <sphere
        name={key}
        key={key}
        ref={(el) => (ref.current[idx] = { indexX: x, indexZ: z, el })}
        diameter={0.5}
        segments={16}
        position={
          new Vector3(x * separation - (amount.x * separation) / 2, 0, z * separation - (amount.z * separation) / 2)
        }
      />
    )
  })
}

function getYAnimation(indexX: number, indexZ: number) {
  const { length, speed } = config.animation

  const scale = config.separation / 2
  /**
   * @param x : X Position in Sphere Grid
   * @param y : Y Position in Sphere Grid
   * @param t : time of animation frame
   * @return Y Position of Sphere at time T
   */
  const y = (x: number, z: number, t: number): number =>
    Math.sin((x + t) * 0.3) * scale + Math.sin((z + t) * 0.5) * scale

  const keys = R.range(0, length).map((t) => ({
    frame: (t * config.frameRate) / speed,
    value: y(indexX, indexZ, t)
  }))

  const animation = new Animation('animation', 'position.y', config.frameRate, 0, 1)
  animation.setKeys(keys)

  return [animation]
}

const Wave = () => {
  const minZ = -((config.amount.z * config.separation) / 2)

  return (
    <div css={[tw`flex-auto`]}>
      <Engine antialias adaptToDeviceRatio canvasId="wave-canvas">
        <Scene>
          <arcRotateCamera
            name="arc"
            target={new Vector3(0, 0, 0)}
            alpha={Math.PI - 0.15}
            beta={Math.PI / 2 + 0.15}
            radius={minZ}
          />

          <hemisphericLight name="light1" intensity={1} direction={Vector3.Up()} />
          <WithAnimation />
        </Scene>
      </Engine>
    </div>
  )
}

export default Wave
