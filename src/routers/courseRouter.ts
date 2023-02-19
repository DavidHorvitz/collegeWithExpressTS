import express, { Request, Response } from "express"
import { DB } from "../index";

export function createCourseRouter(db: DB) {
    const courseRouter = express.Router();
    //GET
    //find by ID (http://localhost:8080/course/e0cf2c14-4516-495f-ba2e-ebad798a8d95)
    courseRouter.get('/:courseId', async (req: Request, res: Response) => {

        const courseId = req.params.courseId;
        const course = await db.Course.searchById(courseId);
        console.log(course);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
    });
    //find course by name (http://localhost:8080/course?course_name=mos)
    courseRouter.get('/', async (req: Request, res: Response) => {
        const course_name = req.query.course_name as string;
        const course = await db.Course.searchByName(course_name);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
        console.log(course);

    })

    //POST
    //Note that I removed :courseId from the route path as it is not required for creating a new course 
    //you need to pass the Properties in the body of the request
    //insert a new course (http://localhost:8080/course/)
    courseRouter.post('/', async (req: Request, res: Response) => {
        const course = await db.Course.insert(req.body);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
    })

    //PUT
    //Update Course (http://localhost:8080/course?course_name=React)
    //Just remember, after sending the request, you need to replace the name with
    // URL because it has already been updated
    courseRouter.put('/', async (req: Request, res: Response) => {
        const course_name = req.query.course_name as string;
        const course = await db.Course.updateCourseByName(course_name, req.body);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
        console.log(course);
    })
    return courseRouter;
}