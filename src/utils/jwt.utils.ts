import jwt from "jsonwebtoken";
import config from "config";

export function decode(token: string){
    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

        return {valid: true, expired:false, decoded};
        
    } catch (error) {
        // console.log(error);
        return {
            valid: false, 
            expired: true, 
            decoded: null
        };

    }
}