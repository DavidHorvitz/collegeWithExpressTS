import express, { Request, Response } from "express"
import { DB } from "../db"
import { isUUID } from "./validation";



export function createSyllabusRoute(db: DB) {

    const syllabusRouter = express.Router();
    //This API add a new Syllabus
    // syllabusRouter.post('/add-syllabus', async (req: Request, res: Response) => {
    //     const syllabus = await db.Syllabus.insert(req.body);
    //     if (!syllabus) {
    //         res.status(404).json({ syllabus: 'not added a new syllabus' });
    //     }
    //     else {
    //         res.json( syllabus );
    //     }
    //     console.log(syllabus);
    // });
    syllabusRouter.post('/add-syllabus', async (req: Request, res: Response) => {
        try {
            // Ensure that CourseOutline and References are arrays in the request body
            if (!Array.isArray(req.body.CourseOutline) || !Array.isArray(req.body.References)) {
                return res.status(400).json({ error: 'CourseOutline and References should be arrays' });
            }

            const syllabusData = {
                Title: req.body.Title,
                Description: req.body.Description,
                References: req.body.References,
                CourseOutline: req.body.CourseOutline,
            };

            const syllabus = await db.Syllabus.insert(syllabusData);

            if (!syllabus) {
                return res.status(404).json({ syllabus: 'Failed to add a new syllabus' });
            }

            res.json(syllabus);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    //get all Syllabus
    syllabusRouter.get('/', async (req: Request, res: Response) => {
        const syllabus = await db.Syllabus.getAllSyllabuses();
        if (!syllabus) {
            res.status(404).json({ status: "Not Found some syllabus !" })
        }
        res.status(200).json(syllabus)
    }),
        //Get the Count of Syllabus
        syllabusRouter.get('/count/1/', async (req, res) => {
            const countSyllabuses = await db.Syllabus.countSyllabuses();
            res.status(200).json({ count: countSyllabuses });
        });


    return syllabusRouter;
}