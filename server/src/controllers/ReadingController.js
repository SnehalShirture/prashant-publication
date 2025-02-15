import { ReadingSession } from "../models/ReadingSession.js";

export const StartReadingSession = async (req, res) => {
    try {
        const { bookId, collegeId } = req.body;
        const activeReaders = await ReadingSession.countDocuments({ bookId, collegeId });

        if (activeReaders >= 3) {
            return res.status(403).json({ message: "Maximum reading limit reached. Try later!" });
        }

        const read = await ReadingSession.create({ bookId, collegeId });
        return res.json({ message: `Student ${collegeId} started reading book ${bookId}` });
    } catch (error) {
        console.log(error);
    }
}


export const stopReadingSession = async (req, res) => {
    try {
        const { bookId, collegeId } = req.body;
        await ReadingSession.deleteOne({ bookId, collegeId });
        return res.json({ message: `Student ${collegeId} stopped reading book ${bookId}` });
    } catch (error) {
        console.log(error);
    }
}
