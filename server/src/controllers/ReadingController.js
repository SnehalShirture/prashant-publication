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



export const getCurrentReaders = async (req, res) => {
    try {
        const readers = await ReadingSession.aggregate([
            {
                $group: {
                    _id: { bookId: "$bookId", collegeId: "$collegeId" },
                    activeReaders: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    bookId: "$_id.bookId",
                    collegeId: "$_id.collegeId",
                    activeReaders: 1
                }
            }
        ]);

        return res.json(readers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}