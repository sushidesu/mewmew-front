export const blobToBase64 = (blob: Blob): Promise<string | undefined> => {
  return new Promise<string | undefined>(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result === "string") {
        resolve(result.slice(22))
      } else {
        resolve(undefined)
      }
    }
  })
}
