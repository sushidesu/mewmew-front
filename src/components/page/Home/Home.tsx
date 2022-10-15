import { useState } from "react"
import { useSketch } from "../../model/Sketch"
import { blobToBase64 } from "../../../utils/blobToBase64"
import styles from "./Home.module.css"

export const Home = () => {
  const [getBlob, resetSketch, renderSketch] = useSketch({ color: "#000" })

  type MewMewResponse = {
    result: string
    variance: number
    sd: number
    average: number
  }

  const [result, setResult] = useState<MewMewResponse | undefined>(undefined)
  const isCircle = (): boolean => {
    if (result === undefined) {
      return false
    }

    if (result.sd > 4) {
      return false
    }
    return true
  }

  return (
    <main className={styles["container"]}>
      <h2>Draw Circle</h2>
      {renderSketch()}
      <button onClick={() => {
        resetSketch()
        setResult(undefined)
      }}>RESET</button>
      <button onClick={async () => {
        const blob = await getBlob()
        if (blob === null) {
          return
        }
        const base64 = await blobToBase64(blob)
        try {
          const res = await fetch("https://mewmew.vercel.app/api/detection", {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ image: base64 }),
            mode: "cors"
          })
          if (!res.ok) {
            const message = await res.text()
            window.alert(message)
            return
          }
          const result = await res.json() as MewMewResponse
          setResult(result)
          console.log(result)
        } catch (err) {
          if (err instanceof Error) {
            window.alert(err.message)
          }
          console.log(err)
        }
      }}>OK</button>
      <hr />
      <h2>RESULT</h2>
      <div>
        <p>{result ?
          isCircle() ? `これは円です` : `これは円ではありません`
          : `・・・`
        }</p>
        <p>{`標準偏差: ${result?.sd ?? ""}`}</p>
        <p>{`分散: ${result?.variance ?? ""}`}</p>
        <p>{`平均: ${result?.average ?? ""}`}</p>
      </div>
      <img width={"400px"} src={"data:image/png;base64," + (result?.result ?? "")} />
    </main>
  )
}
