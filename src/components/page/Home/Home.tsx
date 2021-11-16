import { useState } from "react"
import { useSketch } from "../../model/Sketch"
import { blobToBase64 } from "../../../utils/blobToBase64"

export const Home = () => {
  const [getBlob, renderSketch] = useSketch({ color: "#000" })

  type MewMewResponse = {
    result: string
    variance: number
    sd: number
    average: number
  }

  const [result, setResult] = useState("")

  return (
    <main>
      <h2>hello!</h2>
      {renderSketch()}
      <button onClick={async () => {
        const blob = await getBlob()
        if (blob === null) {
          return
        }
        const base64 = await blobToBase64(blob)
        const res = await fetch("https://mewmew.vercel.app/api/detection", {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ image: base64 }),
          mode: "cors"
        })
        const result = await res.json() as MewMewResponse
        setResult(result.result)
        console.log(result)
      }}>OK</button>
      <p>RESULT</p>
      <img width={"400px"} src={"data:image/png;base64," + result} />
    </main>
  )
}
