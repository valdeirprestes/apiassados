import jwt from "jsonwebtoken";

export default (req, res, next) =>{
    const {authorization} = req.headers;
    if(!authorization)
        return res.status(400).json(
            "Usuário não efetuou o login"
    );
    const [text, token] = authorization.split(' ');
    try {
        const dados  =jwt.verify(token, process.env.TOKEN_SECRET);
        const {id, email} = dados;
        req.params.userId = id;
        req.params.userEmail = email;
        next();
    } catch (error) {
        return res.status(400).json("Token expirado ou token inválido");
    }

}