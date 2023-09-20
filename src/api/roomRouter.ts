import express, { Request, Response } from "express"
import { DB } from "../db"
import { isUUID } from "./validation";



export function createRoomRoute(db: DB) {

    const roomRouter = express.Router();
    roomRouter.get('/', async (req: Request, res: Response) => {
        const room = await db.Room.getAllRooms();
        if (!room) {
            res.status(404).json({ status: "Not Found some students !" })
        }
        res.json(room)
    })
      //Get the Count of Rooms
      roomRouter.get('/count/1/', async (req, res) => {
        const countRooms = await db.Room.countRooms();
        res.status(200).json({ count: countRooms });
    });
    // This API add a new room
    roomRouter.post('/add-room', async (req: Request, res: Response) => {
        console.log("req.body",req.body); // Print the req.body content to the console
        
        const room = await db.Room.insert(req.body);
        
        if (!room) {
            console.log("req.body",req.body); // Print the req.body content to the console
            res.status(404).json({ room: 'not added a new room' });
        }
        else {
            res.json(room);
        }
    });

    // ... other routes and logic

    return roomRouter;
}
