import express from 'express';
import { main as initDB } from '../../index';
import { createRouter } from './courseRouter';

export async function mainRouter() {
    const app = express()
  
    const db = await initDB()
    app.use(express.json({ limit: "10kb" }))
    app.use("/course", createRouter(db))
    
    app.listen(8080, () => {
      console.log(`Example app listening on port 8088`)
    })
  }
  
  mainRouter().then(() => {
    console.log("Exiting")
  })
