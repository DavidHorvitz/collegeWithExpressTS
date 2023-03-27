import express, { Request, Response } from "express"
import { DB } from "../db"
import { isUUID } from "./validation";



export function createRoomRoute(db: DB) {

    const roomRouter = express.Router();
    //This API add a new room
    roomRouter.post('/', async (req: Request, res: Response) => {
        console.log(req.body);
        const room = await db.Room.insert(req.body);
        console.log(room);
        
        if (!room) {
            res.status(404).json({ room: 'not added a new room' });
        }
        else {
            res.json({ status: 'add a new room succeeded !', room: room });
        }
        console.log(room);
    });


    return roomRouter;
}