import express, { Request, Response } from "express"
import { DB } from '../db'
import { isUUID } from "./validation";

export function createClassDateRoute(db: DB) {
    const classDateRouter = express.Router();
    classDateRouter.post('/', async (req: Request, res: Response) => {
        const classDate = await db.ClassDate.insert(req.body);
        if (!classDate) {
            res.status(404).json({ course: "Not Found" })
        }
        res.json(classDate);
    });

return classDateRouter;
}