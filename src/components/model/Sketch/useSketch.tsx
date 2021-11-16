import { useState, useRef, useCallback, PointerEventHandler } from "react"
import { Sketch } from "./Sketch"

type UseSketchProps = {
  color?: string
}

export const useSketch = ({
  color = "#000",
}: UseSketchProps): [() => Promise<Blob | null>, () => JSX.Element] => {
  const [drag, setDrag] = useState(false)
  const [fromX, setFromX] = useState(0)
  const [fromY, setFromY] = useState(0)

  const canvas = useRef<HTMLCanvasElement>(null)

  const offset = useCallback(
    (
      clientX: number,
      clientY: number,
      canvasElement: HTMLCanvasElement
    ): [number, number] => {
      const rect = canvasElement.getBoundingClientRect()
      return [clientX - rect.left, clientY - rect.top]
    },
    []
  )

  const onPointerUp = useCallback<
    PointerEventHandler<HTMLCanvasElement>
  >(() => {
    setDrag(false)
  }, [])

  const onPointerDown = useCallback<PointerEventHandler<HTMLCanvasElement>>(
    (e) => {
      if (!canvas.current) {
        return
      }
      setDrag(true)
      // from
      const [x, y] = offset(e.clientX, e.clientY, canvas.current)
      setFromX(x)
      setFromY(y)
    },
    []
  )

  const onPointerMove = useCallback<PointerEventHandler<HTMLCanvasElement>>(
    (e) => {
      if (!drag) {
        return
      }
      if (!canvas.current) {
        return
      }
      const ctx = canvas.current?.getContext("2d")
      if (!ctx) {
        return
      }
      // paint
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.moveTo(fromX, fromY)
      const [x, y] = offset(e.clientX, e.clientY, canvas.current)
      ctx.lineTo(x, y)
      ctx.stroke()
      setFromX(x)
      setFromY(y)
    },
    [drag, fromX, fromY]
  )

  const getBlob = useCallback(
    () =>
      new Promise<Blob | null>((resolve) => {
        if (canvas.current === null) {
          resolve(null)
          return
        }
        canvas.current.toBlob((blob) => {
          resolve(blob)
        })
      }),
    []
  )

  return [
    getBlob,
    () => (
      <Sketch
        width={"100px"}
        height={"100px"}
        ref={canvas}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      />
    ),
  ]
}
