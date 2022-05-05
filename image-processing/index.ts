import { ImageAnnotatorClient } from "@google-cloud/vision"
import fs from "fs/promises"
import path from "path"
import * as config from "./private.config.json"

const makeRequest = async (file: Buffer) => {
   const client = new ImageAnnotatorClient({
      credentials: {
         client_email: config.client_email,
         private_key: config.private_key
      }
   })

   const [response] = await client.labelDetection(file)
   console.log(response.labelAnnotations)
}

const main = async () => {
   const folder = await fs.opendir("./testFiles")
   const img = await folder.read()
   while (img !== null) {
      if (img.isFile() && ['.JPG', '.PNG'].includes(path.extname(img.name))) {
         const file = await fs.readFile("./testFiles/" + img.name)
         console.log(file.toString('base64').slice(0, 10))
      }
   }
}

main()