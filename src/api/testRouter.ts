import express, { Request, Response } from "express"
import { DB } from "../db"
import { isUUID } from "./validation";



export function createTestRoute(db: DB) {

    const testRouter = express.Router();
    testRouter.get('/', async (req: Request, res: Response) => {
        const test = await db.Test.getAllTests();
        if (!test) {
            res.status(404).json({ status: "Not Found some Tests !" })
        }
        res.json(test)
    })
      //Get the Count of Tests
      testRouter.get('/count/1/', async (req, res) => {
        const countTests = await db.Test.countTests();
        res.status(200).json({ count: countTests });
    });
    // This API add a new test
    testRouter.post('/add-test', async (req: Request, res: Response) => {
        console.log("req.body",req.body); // Print the req.body content to the console
        
        const test = await db.Test.insert(req.body);
        
        if (!test) {
            console.log("req.body",req.body); // Print the req.body content to the console
            res.status(404).json({ test: 'not added a new test' });
        }
        else {
            res.json(test);
        }
    });

    // ... other routes and logic

    return testRouter;
}
