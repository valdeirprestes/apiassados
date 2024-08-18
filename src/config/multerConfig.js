import multer from "multer";
import {extname, resolve} from "path"
const nrandom  =  1000000000
function randnumber(){
    return Math.floor(Math.random() * nrandom + nrandom);
}




export default {
    fileFilter: function(req, file, cb)
    {
        if(file.mimetype != 'image/png' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/gif')
        {
            return cb( new multer.MulterError('O sistema aceita apenas arquivos PNG, JPG ou GIF'));
        }
        return cb(null, true);
    },
    storage: multer.diskStorage(
        {
            destination:function(req, file, cb)
            {
                const folder = resolve(__dirname, "..","..","images")
                return cb(null, folder);
            },

            filename: function(req, file, cb)
            {
                console.log("file", file);
                const img = `${Date.now()}${randnumber()}${extname(file.originalname)}`
                //console.log('img', img);
                return cb(null, img);
            }

        })
}