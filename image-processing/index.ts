import { ImageAnnotatorClient } from "@google-cloud/vision"
import { google } from "@google-cloud/vision/build/protos/protos"
import fs from "fs/promises"
import path from "path"
import * as config from "./private.config.json"

const client = new ImageAnnotatorClient({
   credentials: {
      client_email: config.client_email,
      private_key: config.private_key
   }
})

const makeRequest = async (file: Buffer) => {
   const [response] = await client.annotateImage({
      image: {
         content: file.toString('base64')
      },
      features: [
         {
            type: "LABEL_DETECTION"
         }
      ]
   })
   return response
}

const main = async () => {
   const folder = await fs.opendir("./testFiles")
   let img = await folder.read()
   let count = 0;
   const data: Record<string, google.cloud.vision.v1.IAnnotateFileResponse> = {}
   while (img !== null) {
      if (img.isFile() && ['.JPG', '.PNG'].includes(path.extname(img.name))) {
         const file = await fs.readFile("./testFiles/" + img.name)
         data[img.name] = await makeRequest(file)
      }
      img = await folder.read()
      count++
      console.log('Done', count)
   }

   await fs.writeFile("./output/response.json", JSON.stringify(data))
   console.log('saved')

}

main()