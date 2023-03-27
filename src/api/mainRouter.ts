import express from "express"
import { createLecturerRoute } from "./lecturerRouter"
import { createCourseRoute } from './courseRouter';
import { createStudentRoute } from './studentRouter';
import { createClassDateRoute } from "./classDateRouter";
import { createSyllabusRoute } from "./syllabusRouter";
import { createRoomRoute } from "./roomRouter";
import { initDB } from "../db"
import cors from 'cors';

export async function createServer() {
    const db = await initDB()
    const lecturerRouter = createLecturerRoute(db);
    const courseRouter = createCourseRoute(db);
    const studentRouter = createStudentRoute(db);
    const syllabusRouter = createSyllabusRoute(db);
    const class_DateRouter = createClassDateRoute(db);
    const roomRouter = createRoomRoute(db)


    const app = express();
    app.use(cors());
    app.use(express.json())
    app.use("/lecturer", lecturerRouter);
    app.use("/course", courseRouter);
    app.use("/student", studentRouter);
    app.use("/classDate", class_DateRouter);
    app.use("/syllabus", syllabusRouter);
    app.use("/room",roomRouter);


    app.listen(8080, () => {
        console.log("listening")
    })
}
