import express from "express"
import path from "path";
import cors from 'cors'
import dotenv from "dotenv";
import { swagger } from "./module/swagger";
import { Api } from "./module/swagger/Api";
import apiRouter from "./router";

dotenv.config()

const app = express()

app.use(cors())

app.use("/public" , express.static(path.join(process.cwd() , 'public')))

app.use(express.urlencoded())

app.use(express.json())

app.use("/doc" , swagger.document())

app.use("/api" , apiRouter)

app.use( 
  Api({ method: "ANY" , url: "/404" , group: "404不存在接口" }) ,
  (req , resp , next) => { resp.status(404);resp.send("404 NOT FOUND") }
)

export default app