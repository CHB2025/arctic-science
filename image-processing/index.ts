import { ImageAnnotatorClient } from "@google-cloud/vision"
import fs from "fs/promises"
import path from "path"
import * as config from "./private.config.json"

const client = new ImageAnnotatorClient({
   credentials: {
      client_email: config.client_email,
      private_key: config.private_key
   }
})

const makeRequest = async (files: Buffer[]) => {
   const [response] = await client.batchAnnotateImages({
      requests: files.map((val) => ({
         image: {
            content: val.toString('base64')
         }
      }))
   })
   return response
}

const main = async () => {
   const folder = await fs.opendir("./testFiles")
   let img = await folder.read()
   const files: Buffer[] = []
   while (img !== null) {
      if (img.isFile() && ['.JPG', '.PNG'].includes(path.extname(img.name))) {
         const file = await fs.readFile("./testFiles/" + img.name)
         files.push(file)
      }
      img = await folder.read()
   }
   await fs.writeFile("./output/response.json", "{}")
   const jsonResponse = await makeRequest(files)
   await fs.writeFile("./output/response.json", JSON.stringify(jsonResponse))

}

main()