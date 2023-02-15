import express, { Request, Response } from "express"
import { DB } from "../../index";


export function createRouter(db: DB) {
    const courseRouter = express.Router();

    courseRouter.get('/:courseId', async (req: Request, res: Response) => {
        const course = await db.Course.searchById(req.params.courseId);
        res.json(course);
    })

    // courseRouter.post("/:courseId/students", (req: Request, res: Response) => {
    //     res.send({
    //         courseId: req.params.courseId,
    //         studentId: req.body.studentId,
    //         onZoom: req.body.onZoom
    //     })
    // })

    return courseRouter;
}