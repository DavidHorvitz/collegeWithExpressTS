import express from "express"
import { createLecturerRoute } from "./lecturerRouter"
import { createCourseRoute } from './courseRouter';
import { createStudentRoute } from './studentRouter';
import { initDB } from "../db"

export async function createServer() {
    const db = await initDB()
    const lecturerRouter = createLecturerRoute(db);
    const courseRouter = createCourseRoute(db);
    const studentRouter = createStudentRoute(db)


    const app = express();

    app.use(express.json())
    app.use("/lecturer", lecturerRouter);
    app.use("/course", courseRouter);
    app.use("/student", studentRouter)


    app.listen(8080, () => {
        console.log("listening")
    })
}