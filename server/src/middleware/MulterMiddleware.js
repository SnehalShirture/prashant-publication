import multer from "multer";
import path from "path";
const storage=multer.diskStorage({
    destination:function(req,file,next) {
        const fileType = path.extname(file.originalname).toLowerCase();
        let folder = "uploads/";
        if (fileType === ".pdf") {
            folder += "pdf/";
        } else {
            folder += "images/";
        }
        next(null, folder);
    },
    filename:function(req,file,next){
        next(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
})

export const upload=multer({storage:storage})