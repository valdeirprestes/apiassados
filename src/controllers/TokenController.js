import UserModel from "../models/UserModel";
import jwt from "jsonwebtoken";

class TokenController
{
    async store(req, res){
        try {
            const { email, senha} = req.body;
            if(!email || !senha){
                return res.status(400).json("Entre com email e senha");
            }
            const user = await UserModel.findOne({'where':{email:email, estado:"NORMAL",ativo:"SIM"}});
            if(!user )
                return res.status(400).json({"errors":["Usuário ou senha inválida"]});
            if(!(await user.passwordIsValid(senha)))
                return res.status(400).json({"errors":["Usuário ou senha inválida"]});
            const {id, nome} = user;
            console.log(`id ${id} nome ${nome} email ${email} EXPIRATION ${ process.env.TOKEN_EXPIRATION} SECRET ${process.env.TOKEN_SECRET}  `)
            const token = jwt.sign({id, email}, process.env.TOKEN_SECRET,
                {
                    expiresIn: process.env.TOKEN_EXPIRATION
                });
            return res.status(200).json({id, nome, email, perfil:user.perfil, token});
        } catch (e) {
            console.log(e);
			const {errors} = e;
			if(errors)
				return res.status(400).json(e.errors.map(err => err.message));
			return res.status(500).json({"errors":['Error interno na API']});
        }
    }
}

export default new TokenController();
