import express, { Request, Response } from "express"
import { DB } from "../index";

export function createCourseRouter(db: DB) {
    const courseRouter = express.Router();

    courseRouter.get('/:courseId', async (req: Request, res: Response) => {
        const course = await db.Course.searchById(req.body.Id);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
    });
    courseRouter.get('/course/:course_name', async (req: Request, res: Response) => {
        const course = await db.Student_courses.getCourseWithItsUser(req.body.Course_name);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
    })


    //Note that I removed :courseId from the route path as it is not required for creating a new course
    courseRouter.post('/', async (req: Request, res: Response) => {
        const course = await db.Course.insert(req.body);
        res.json(course);
    })
    return courseRouter;
}