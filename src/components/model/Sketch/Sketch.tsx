import {
  forwardRef,
  ForwardRefRenderFunction,
  PointerEventHandler,
} from "react"
import styles from "./Sketch.module.css"

export type SketchProps = {
  width?: string
  height?: string
  onPointerUp?: PointerEventHandler<HTMLCanvasElement>
  onPointerDown?: PointerEventHandler<HTMLCanvasElement>
  onPointerMove?: PointerEventHandler<HTMLCanvasElement>
}

const SketchWithoutRef: ForwardRefRenderFunction<
  HTMLCanvasElement,
  SketchProps
> = (props, ref) => {
  const {
    width = "200px",
    height = "200px",
    onPointerUp,
    onPointerDown,
    onPointerMove,
  } = props
  return (
    <div>
      <canvas
        className={styles.wrapper}
        ref={ref}
        width={width}
        height={height}
        style={{ border: "1px solid #333" }}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      />
    </div>
  )
}

export const Sketch = forwardRef(SketchWithoutRef)
