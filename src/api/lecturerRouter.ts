import express from "express"
import { isUUID, validateLecturer } from "./validation"
import { DB } from "../db"

export function createLecturerRoute(db: DB) {
    const router = express.Router();

    router.delete("/:lecturerId", async (req, res) => {
        try {
            const lecturerId = isUUID(req.params.lecturerId)
            const success = await db.Lecturer.delete(lecturerId.toString());
            if (success) {
                res.status(200).json({ status: "deleted" })
            } else {
                res.status(404).json({ status: "not found" })
            }
        } catch (e) {
            res.status(400).json({ status: "invalid input" })
        }
    })



    router.post("/", async (req, res) => {
        try {
            const lecturer = validateLecturer(req.body)
            const result = await db.Lecturer.insert(lecturer);
            res.status(201).json({ status: "created", data: result })
        }
        catch (e) {
            res.status(400).json({ status: "invalid input" })
        }
    })

    return router;
}