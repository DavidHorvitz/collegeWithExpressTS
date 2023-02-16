import express, { Request, Response } from "express"
import { DB } from "../index"

export function createStudentRoute(db: DB) {
    const studentRouter = express.Router();

    studentRouter.get('/:studentId', async (req, res) => {
        const student = await db.Student.searchById(req.params.studentId);
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
    return studentRouter;
}