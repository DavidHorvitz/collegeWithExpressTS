import express, { Request, Response } from "express"
import { DB } from "../db"
import { isUUID } from "./validation";

export function createStudentRoute(db: DB) {
    const studentRouter = express.Router();

    studentRouter.get('/:studentId', async (req, res) => {
        const student = await db.Student.search(req.params.studentId);
        if (!student) {
            res.status(404).json({ status: "Not Found" })
        }
        res.json(student)
    })
    //Note that I removed :studentId from the route path as it is not required for creating a new course
    studentRouter.post('/', async (req: Request, res: Response) => {
        const student = await db.Student.insert(req.body);
        res.json(student);
    })

    //GET student with him courses with data checked
    studentRouter.get('/:studentId/course/betweenDates', async (req: Request, res: Response) => {
        const { studentId } = req.params;

        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const student = await db.CourseStudent.getStudentWithHimCoursesWhereTimeBetween(studentId);
        if (!student) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'get student with his courses succeeded !' });
        }
        console.log(student);

    });
    studentRouter.get('/:studentId/course/current', async (req: Request, res: Response) => {
        const { studentId } = req.params;

        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const student = await db.CourseStudent.getStudentWithHimCurrentCourses(studentId);
        if (!student) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'get student with his courses succeeded !' });
        }
        console.log(student);

    });
    studentRouter.get('/:studentId/course/history', async (req: Request, res: Response) => {
        const { studentId } = req.params;

        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const student = await db.CourseStudent.getStudentWithHimHistoryCourses(studentId);
        if (!student) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'get student with his courses history succeeded !' });
        }
        console.log(student);

    });
    studentRouter.delete('/:studentId', async (req: Request, res: Response) => {
        const studentId = req.params.studentId;

        // check if courseId is a valid UUID
        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const student = await db.Course.delete(studentId);
        if (student) {
            return res.status(200).json({ status: 'deleted' });
        } else {
            return res.status(404).json({ status: 'not found' });
        }
    });
    return studentRouter;
}