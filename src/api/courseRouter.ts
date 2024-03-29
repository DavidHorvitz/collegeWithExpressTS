import express, { Request, Response } from "express"
import { DB } from '../db'
import { isUUID } from "./validation";

export function createCourseRoute(db: DB) {
    const courseRouter = express.Router();
    //GET
    //find by ID with details(http://localhost:8080/course/e0cf2c14-4516-495f-ba2e-ebad798a8d95/details)
    courseRouter.get('/:courseId/', async (req: Request, res: Response) => {
        const courseId = req.params.courseId;
        const includeDetails = req.query.course as string;
        const course = await db.Course.searchByIdWithDetails(courseId, includeDetails);
        console.log(JSON.stringify(course));

        console.log(course);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
    });
    //This get the all courses
    courseRouter.get('/', async (req: Request, res: Response) => {
        const course = await db.Course.getAllCourses();
        if (!course) {
            res.status(404).json({ status: "Not Found some students !" })
        }
        res.status(200).json(course)
    })
    //Get the Count of Courses
    courseRouter.get('/count/1/', async (req, res) => {
        const courseCount = await db.Course.countCourses();
        res.status(200).json({ count: courseCount });
    });
    

    //get a course with him students 
    courseRouter.get('/:courseId/student/', async (req: Request, res: Response) => {
        const { courseId } = req.params;

        if (!isUUID(courseId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const course = await db.CourseStudent.getCourseWithHimStudents(courseId);
        if (!course) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json(course);
        }
        console.log(course);

    });
    //find course by name (http://localhost:8080/course?course_name=mos)
    courseRouter.get('/s', async (req: Request, res: Response) => {
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
    courseRouter.post('/add-course', async (req: Request, res: Response) => {
        const course = await db.Course.insert(req.body);
        if (!course) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(course);
    })

    //This function adds a student to the course by adding the two PKs to the courseStudent linking table
    courseRouter.post('/add-student-to-course/:courseId/student/:studentId', async (req: Request, res: Response) => {
        const { courseId, studentId } = req.params;

        if (!isUUID(courseId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }
        if (!isUUID(studentId)) {
            return res.status(400).json({ error: 'Invalid studentId parameter' });
        }
        const course = await db.CourseStudent.addStudentToCourse(courseId, studentId);
        if (!course) {
            res.status(404).json({ status: 'not found' });
        }
        else {
            res.status(200).json(course);
        }
    });
    //This function adds a syllabus to the course by adding the two PKs to the courseStudent linking table
    courseRouter.post('/:courseId/syllabus/:syllabusId', async (req: Request, res: Response) => {
        const { courseId, syllabusId } = req.params;

        if (!isUUID(courseId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }
        if (!isUUID(syllabusId)) {
            return res.status(400).json({ error: 'Invalid syllabusId parameter' });
        }
        const course = await db.Syllabus.addSyllabusToCourse(syllabusId, courseId);
        res.status(200).json({ status: 'syllabus adding to course is success !', course: course });

        console.log(course);

    });

    //PUT
    //Update Course (http://localhost:8080/course?course_name=React)
    //Just remember, after sending the request, you need to replace the name with
    // URL because it has already been updated
    // courseRouter.put('/', async (req: Request, res: Response) => {
    //     const course_name = req.query.course_name as string;
    //     const course = await db.Course.updateCourseByName(course_name, req.body);
    //     if (!course) {
    //         res.status(404).json({ course: "Not Found" })
    //     }
    //     res.json(course);
    //     console.log(course);
    // })

    courseRouter.put('/edit-course/:courseId', async (req: Request, res: Response) => {
        const { courseId } = req.params;
        console.log("req.body:", JSON.stringify(req.body));

        console.log("courseId: " + courseId);

        const course = await db.Course.updateCourseById(courseId, req.body);

        console.log("course", course);
        if (!course) {

            res.status(400).json({ error: 'Invalid course data' });
        }
        else {
            res.status(200).json(course);
        }
    });
    // courseRouter.put('/:courseId', async (req: Request, res: Response) => {
    //     const { courseId } = req.params;
    //     const course = await db.Course.addLectureDataEntryToCourse(courseId, req.body);
    //     if (!course) {
    //         res.status(404).json({ course: "Not Found" })
    //     }
    //     res.status(404).json({ status: "Successes", course })

    //     console.log(course);
    // });
    //This API removing the lecture date entry for course
    // courseRouter.put('/:courseId/lecture-delete-data', async (req: Request, res: Response) => {
    //     const { courseId } = req.params;
    //     console.log(courseId, "test before course is deleted ROUTER");

    //     const course = await db.Course.deleteLectureDataEntryFromCourse(courseId, req.body);
    //     console.log(courseId, "test after delete ROUTER");
    //     if (!course) {
    //         res.status(404).json({ course: "Not Found" })
    //     } else {
    //         res.status(200).json(course);
    //     }
    // });

    //DELETE
    //This API is delete a course by its Id
    courseRouter.delete('/delete-course/:courseId', async (req: Request, res: Response) => {
        const courseId = req.params.courseId;

        // check if courseId is a valid UUID
        if (!isUUID(courseId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }

        const course = await db.Course.delete(courseId);
        if (course) {
            return res.status(200).json({ status: 'deleted' });
        } else {
            return res.status(404).json({ status: 'not found' });
        }
    });
    //This API removing the syllabus date entry for course
    courseRouter.delete('/:courseId/syllabus/:syllabusId', async (req: Request, res: Response) => {
        const { courseId, syllabusId } = req.params;

        if (!isUUID(courseId)) {
            return res.status(400).json({ error: 'Invalid courseId parameter' });
        }
        if (!isUUID(syllabusId)) {
            return res.status(400).json({ error: 'Invalid syllabusId parameter' });
        }
        const course = await db.Syllabus.deleteSyllabusFromCourse(syllabusId, courseId);
        if (course) {
            res.status(202).json({ status: 'deleted' });
        }
        else {
            res.status(404).json({ status: 'not found', course });
        }
        console.log(course);

    });

    return courseRouter;
}