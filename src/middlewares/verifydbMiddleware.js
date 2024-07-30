import databaseConfig from "../config/databaseConfig";
import Sequelize  from "sequelize";
export default async ( req, res, next) => {
    try {
        const connection = new Sequelize(databaseConfig);
        await connection.authenticate();
    } catch (err) {
        return res.status(400).json (["Não foi possível se conectar ao banco de dados"] );
    }
    next();
}