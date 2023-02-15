// import express from "express"
// import { DB } from "../index"

// export function createStudentRoute(db: DB) {
//     const studentRouter = express.Router({});

//     studentRouter.get('/:studentId', async (req, res) => {
//         const student = await db.Student.getStudent(req.params.studentId);
//         if (!student) {
//             res.status(404).json({ status: "Not Found" })
//         }
//         res.json(student)
//     })
//     return studentRouter;
// }