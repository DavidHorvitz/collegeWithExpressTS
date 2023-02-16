import express from 'express';
import { main as initDB } from '../index';
import { createCourseRouter  } from './courseRouter';
import { createStudentRoute} from './studentRouter';

export async function mainRouter() {
    const app = express()
  
    const db = await initDB()
    app.use(express.json({ limit: "10kb" }))
    app.use("/course", createCourseRouter(db))
    app.use("/student", createStudentRoute(db))
    
    app.listen(8080, () => {
      console.log(`Example app listening on port 8088`)
    })
  }
  
  mainRouter().then(() => {
    console.log("Exiting")
  })
