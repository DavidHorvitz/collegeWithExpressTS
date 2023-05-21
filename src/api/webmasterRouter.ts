import express, { Request, Response } from "express"
import { DB } from "../db"
import { isUUID } from "./validation";
import { sendMail } from "../emailNotifications/emailNotifications";
export function createWebMasterRoute(db: DB) {
    const webMasterRouter = express.Router();

    webMasterRouter.get('/:webmasterId', async (req, res) => {
        const webmaster = await db.Webmaster.search(req.params.webmasterId);
        if (!webmaster) {
            res.status(404).json({ status: "Not Found" })
        }
        res.json(webmaster)
    })
    //This get the all students
    webMasterRouter.get('/', async (req: Request, res: Response) => {
        const webmaster = await db.Webmaster.getAllWebmaster();
        if (!webmaster) {
            res.status(404).json({ status: "Not Found some students !" })
        }
        res.json(webmaster)
    })
    //Note that I removed :webmasterId from the route path as it is not required for creating a new webmaster
    webMasterRouter.post('/add-webmaster', async (req: Request, res: Response) => {
        const webmaster = await db.Webmaster.insert(req.body);
        if (!webmaster) {
          res.status(400).json({ error: 'Invalid webmaster data' });
        } else {
          try {
            await sendMail(webmaster.Name, webmaster.Email, webmaster.Id);
            res.status(200).json(webmaster);
          } catch (error) {
            res.status(500).json({ error: 'Failed to send email' });
          }
        }
      });


    //This Api updates the student by Id
    webMasterRouter.put('/edit-webmaster/:webmasterId', async (req: Request, res: Response) => {
        const {  webmasterId } = req.params;
        const webmaster = await db.Webmaster.updateWebmasterById(webmasterId, req.body);
        if (!webmaster) {
            res.status(400).json({ error: 'Invalid webmaster data' });
        }
        else {
            res.status(200).json(webmaster);
        }
    });

    webMasterRouter.delete('/delete-webmaster/:webmasterId', async (req: Request, res: Response) => {
        const {  webmasterId } = req.params;

        // check if courseId is a valid UUID
        if (!isUUID(webmasterId)) {
            return res.status(400).json({ error: 'Invalid webmasterId parameter' });
        }

        const webmaster = await db.Webmaster.delete(webmasterId);
        if (webmaster) {
            return res.status(200).json({ status: 'deleted' });
        } else {
            return res.status(404).json({ status: 'not found' });
        }
    });
    return webMasterRouter;
}