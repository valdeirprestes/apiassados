import * as lodash from "lodash";
export default (req, res, next) =>{
    const body = lodash.get(req, "body", false)
    if(body)
        return res.status(400).json("Precisa enviar dados no formato json para a API");
    next();
}