import jwt from 'jsonwebtoken'

const authenticate = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: "Access denied. 401 Unauthorized request" });
    }
    try {
        token = token ? token.split(' ')[1] : "";

        if (token === 'null' || !token) {
            return res.status(401).send("Unauthorized request. Token value is missing");
        }
        jwt.verify(token, "Secret Key", async (err, verifiedUser) => {
            if (err) {
                
                if (err.name === 'TokenExpiredError') {
                    
                    await userLogout({ body: { userId: verifiedUser?.userId } }, res);

                    return res.status(401).json({ message: "Your session has expired. Please log in again." });
                }

                // Step 6: Handle invalid tokens
                return res.status(400).json({ message: "Invalid Token" });
            }

            req.user = verifiedUser;
            next();
        });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(400).send("Invalid Token");
    }
}
export { authenticate }

