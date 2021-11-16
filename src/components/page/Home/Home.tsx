import { useSketch } from "../../model/Sketch"
import { blobToBase64 } from "../../../utils/blobToBase64"

export const Home = () => {
  const [getBlob, renderSketch] = useSketch({ color: "#000" })

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
        console.log(base64)
      }}>OK</button>
    </main>
  )
}
