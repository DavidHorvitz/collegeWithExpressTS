import express, { Request, Response } from "express"
import { isUUID, validateLecturer } from "./validation"
import { DB } from "../db"

export function createLecturerRoute(db: DB) {
    const router = express.Router();

    router.get('/:lecturerId/course/current', async (req: Request, res: Response) => {
        const { lecturerId } = req.params;

        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const lecturer = await db.Course.getLecturerWithCurrentCourses(lecturerId);
        if (!lecturer) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'get lecturer with his Course succeeded !' });
        }
        console.log(lecturer);

    });

    router.get('/:lecturerId/course/betweenDates', async (req: Request, res: Response) => {
        const { lecturerId } = req.params;
        const { startDate, endDate } = req.query;

        const startDateObj = startDate ? new Date(startDate.toString()) : new Date();
        const endDateObj = endDate ? new Date(endDate.toString()) : new Date();

        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const lecturer = await db.Course.getLecturerWithBetweenDates(lecturerId, startDateObj, endDateObj);
        if (!lecturer) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'get lecturer with his Course succeeded !' });
        }
        console.log(lecturer);

    });

    router.post("/", async (req, res) => {
        try {
            const lecturer = validateLecturer(req.body)
            const result = await db.Lecturer.insert(lecturer);
            res.status(201).json({ status: "created", data: result })
        }
        catch (e) {
            res.status(400).json({ status: "invalid input" })
        }
    })

    router.post('/:lecturerId/course/:courseId', async (req: Request, res: Response) => {
        const { courseId, lecturerId } = req.params;

        if (!isUUID(courseId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }
        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid lecturerId parameter' });
        }
        const course = await db.Course.addCourseToLecturer(lecturerId, courseId);
        if (!course) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'course adding to lecturer is success !' });
        }
        console.log(course);

    });
    router.post('/:lecturerId/classDate/:classDateId', async (req: Request, res: Response) => {
        const { classDateId, lecturerId } = req.params;

        if (!isUUID(classDateId)) {
            return res.status(400).json({ error: 'Invalid classDateId parameter' });
        }
        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid lecturerId parameter' });
        }
        const classDate = await db.ClassDate.addClassDateToLecturer(lecturerId, classDateId);
        if (!classDate) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'course adding to lecturer is success !' });
        }
        console.log(classDate);

    });

    router.delete("/:lecturerId", async (req, res) => {
        try {
            const lecturerId = isUUID(req.params.lecturerId)
            const success = await db.Lecturer.delete(lecturerId.toString());
            if (success) {
                res.status(200).json({ status: "deleted" })
            } else {
                res.status(404).json({ status: "not found" })
            }
        } catch (e) {
            res.status(400).json({ status: "invalid input" })
        }
    })

    return router;
}