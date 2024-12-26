import { Session } from "../models/SessionSchema.js";

const createSession = async ({ userId, ipAddress, userAgent }) => {
    try {

        const activeSession = await Session.findOne({
            user_id: userId,
            isActive: true,
        });

        if (activeSession) {
            return { success: false, message: 'You are already logged in on another device.', activeSession };
        }

        const newSession = new Session({
            user_id: userId,
            ipAddress: ipAddress,
            userAgent: userAgent,
            isActive: true,
        });

        await newSession.save();
        return { success: true, session: newSession };

    } catch (error) {
        console.error('Error creating session log:', error);
        return { success: false, message: 'Error creating session log' };
    }
}

const getSession = async () => {
    try {
        const logs = await Session.find({ user_id: req.params.userId });
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching session logs:', error);
        res.status(500).json({ message: 'Error fetching session logs' });
    }
}

// const updateSessionLog = async (req, res) => {
//     try {
//         const sessionLog = await Session.findByIdAndUpdate(
//             req.params.sessionId,
//             { logoutTime: new Date(), isActive: false },
//             { new: true }
//         );
//         res.status(200).json(sessionLog);
//     } catch (error) {
//         console.error('Error updating session log:', error);
//         res.status(500).json({ message: 'Error updating session log' });
//     }
// };



export { createSession, getSession }