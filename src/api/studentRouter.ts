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
    //This get the all students
    studentRouter.get('/', async (req: Request, res: Response) => {
        const student = await db.Student.getAllStudent();
        if (!student) {
            res.status(404).json({ status: "Not Found some students !" })
        }
        res.json(student)
    })
      //Get the Count of Rooms
      studentRouter.get('/count/1/', async (req, res) => {
        const countStudents = await db.Student.countStudents();
        res.status(200).json({ count: countStudents });
    });
    //Note that I removed :studentId from the route path as it is not required for creating a new course
    studentRouter.post('/add-student', async (req: Request, res: Response) => {
        const student = await db.Student.insert(req.body);
        if (!student) {
            res.status(400).json({ error: 'Invalid student data' });
        }
        else {
            res.status(200).json(student);
        }
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
    //get student with current courses
    studentRouter.get('/:studentId/course/current', async (req: Request, res: Response) => {
        const { studentId } = req.params;

        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const student = await db.CourseStudent.getStudentWithHimCurrentCourses(studentId);
        if (!student) {
            res.status(404).json({ status: 'No matching student with current courses found' });
        }
        else {
            res.status(200).json(student);
        }
        console.log(student);

    });

    //get a student with courses history
    studentRouter.get('/:studentId/course', async (req: Request, res: Response) => {
        const { studentId } = req.params;

        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const student = await db.CourseStudent.getStudentWithHimCourses(studentId);
        if (!student) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json(student );
        }
        console.log(student);

    });
    //This API gets a schedule for a specific Student by ID between certain dates
    studentRouter.get('/:studentId/schedule', async (req: Request, res: Response) => {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;

        const startingDateObj = startDate ? new Date(startDate.toString()) : new Date();
        const endDateObj = endDate ? new Date(endDate.toString()) : new Date();

        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid studentId parameter' });
        }
        const studentSchedule = await db.CourseStudent.gettingStudentScheduleBetweenDates(studentId, startingDateObj, endDateObj);
        if (!studentSchedule) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json({ status: 'gettingStudentScheduleBetweenDates function  succeeded !', student: studentSchedule });
        }
        console.log(studentSchedule);

    });
    //This Api updates the student by Id
    studentRouter.put('/edit-student/:studentId', async (req: Request, res: Response) => {
        const { studentId } = req.params;
        console.log("req.body:", JSON.stringify(req.body));
        const student = await db.Student.updateStudentById(studentId, req.body);
        if (!student) {
            res.status(400).json({ error: 'Invalid student data' });
        }
        else {
            res.status(200).json(student);
        }
    });

    studentRouter.delete('/delete-student/:studentId', async (req: Request, res: Response) => {
        const { studentId } = req.params;

        // check if courseId is a valid UUID
        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const student = await db.Student.delete(studentId);
        if (student) {
            return res.status(200).json({ status: 'deleted' });
        } else {
            return res.status(404).json({ status: 'not found' });
        }
    });
    return studentRouter;
}