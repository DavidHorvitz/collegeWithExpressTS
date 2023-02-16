import express, { Request, Response } from "express"
import { DB } from "../index";

export function createLecturerRouter(db: DB) {
    const lecturerRouter = express.Router();

    // lecturerRouter.get('/:courseId', async (req: Request, res: Response) => {
    //     const course = await db.Course.searchById(req.body.Id);
    //     if (!course) {
    //         res.status(404).json({ course: "Not Found" })
    //     }
    //     res.json(course);
    // });
    // lecturerRouter.get('/course/:course_name', async (req: Request, res: Response) => {
    //     const course = await db.Student_courses.getCourseWithItsUser(req.body.Course_name);
    //     if (!course) {
    //         res.status(404).json({ course: "Not Found" })
    //     }
    //     res.json(course);
    // })


    //Note that I removed :courseId from the route path as it is not required for creating a new course
    lecturerRouter.post('/', async (req: Request, res: Response) => {
        const lecturer = await db.Lecturer.insert(req.body);
        res.json(lecturer);
    })
    return lecturerRouter;
}