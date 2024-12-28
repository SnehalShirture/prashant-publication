
import jwt from 'jsonwebtoken'

const authenticate = (req,res,next)=>{
    let token = req.headers.authorization;

    if(!token){
        return res.status(401).send({ message: "Access denied. 401 Unauthorized request" });
    }
    
    try {
        token = token ? token.split(' ')[1] : "";

        if (token === 'null' || !token) {
            return res.status(401).send("Unauthorized request. Token value is missing");
        }

        let verifiedUser = jwt.verify(token, "Secret Key");

        if (!verifiedUser) {
            return res.status(401).send("User not verified");
        }

        req.user = verifiedUser;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(400).send("Invalid Token");
    }
}
export {authenticate}

