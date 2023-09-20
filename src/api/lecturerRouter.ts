import express, { Request, Response } from "express"
import { isUUID, validateLecturer } from "./validation"
import { DB } from "../db"

export function createLecturerRoute(db: DB) {
    const lecturerRouter = express.Router();
    //This API gets the current courses for a specific lecturer by Id
    lecturerRouter.get('/:lecturerId/course/current', async (req: Request, res: Response) => {
        const { lecturerId } = req.params;

        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid lecturerId parameter' });
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
     //Get the Count of lecturer
     lecturerRouter.get('/count/1/', async (req, res) => {
        const countLecturer = await db.Lecturer.countLecturer();
        res.status(200).json({ count: countLecturer });
    });
    //This API gets a courses between dates for a specific lecturer by Id
    lecturerRouter.get('/:lecturerId/course/betweenDates', async (req: Request, res: Response) => {
        const { lecturerId } = req.params;
        const { startDate, endDate } = req.query;

        const startDateObj = startDate ? new Date(startDate.toString()) : new Date();
        const endDateObj = endDate ? new Date(endDate.toString()) : new Date();

        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid lecturerId parameter' });
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
    //This API gets a schedule for a specific lecturer by ID between certain dates
    // lecturerRouter.get('/:lecturerId/schedule', async (req: Request, res: Response) => {
    //     const { lecturerId } = req.params;
    //     const { startDate, endDate } = req.query;

    //     const startingDateObj = startDate ? new Date(startDate.toString()) : new Date();
    //     const endDateObj = endDate ? new Date(endDate.toString()) : new Date();

    //     if (!isUUID(lecturerId)) {
    //         return res.status(400).json({ error: 'Invalid lecturerId parameter' });
    //     }

    //     const lecturerSchedule = await db.ClassDate.gettingLecturersScheduleBetweenDates(lecturerId, startingDateObj, endDateObj);
    //     if (!lecturerSchedule) {
    //         res.status(404).json({ status: 'not found' });
    //     }
    //     else {
    //         res.status(200).json({ status: 'gettingLecturersSchedule function  succeeded !', lecturer: lecturerSchedule });
    //     }
    //     console.log(lecturerSchedule);

    // });
    //This API insert a nwe lecturer to the Database
    lecturerRouter.post("/add-lecturer", async (req, res) => {
        const lecturer = await db.Lecturer.insert(req.body);
        if (!lecturer) {
            res.status(400).json({ status: "invalid lecturer data" })
        }
        else {
            res.status(201).json(lecturer)
        }
    })
    //This API associates the course with the lecturer
    lecturerRouter.post('/:lecturerId/course/:courseId', async (req: Request, res: Response) => {
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


    //This API delete a lecturer from the database
    lecturerRouter.delete("/delete-lecturer/:lecturerId", async (req: Request, res: Response) => {
        const { lecturerId } = req.params;
        // check if lecturerId is a valid UUID
        if (!isUUID(lecturerId)) {
            return res.status(400).json({ error: 'Invalid lecturerId parameter' });
        }
        const lecturer = await db.Lecturer.delete(lecturerId);
        if (lecturer) {
            return res.status(200).json({ status: 'deleted' });
        } else {
            return res.status(404).json({ status: 'not found' });
        }
    })
    //get all lecturers
    lecturerRouter.get('/', async (req: Request, res: Response) => {
        const lecturer = await db.Lecturer.getAllLecturers();
        if (!lecturer) {
            res.status(404).json({ status: "Not Found some lecturer !" })
        }
        res.status(200).json(lecturer)
    })
    //Update lecturer by ID
    lecturerRouter.put('/edit-lecturer/:lecturerId', async (req: Request, res: Response) => {
        const { lecturerId } = req.params;
        const lecturer = await db.Lecturer.updateLecturerById(lecturerId, req.body);
        if (!lecturer) {
            res.status(400).json({ error: 'Invalid lecturer data' });
        }
        else {
            res.status(200).json(lecturer);
        }
    });

    return lecturerRouter;
}