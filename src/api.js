import express from "express";
import userrouter from "./routes/UserRoute";
import tokenrouter from "./routes/TokenRoute";
import productrouter from "./routes/ProductRoute";
import movementrouter from "./routes/MovementRoute";
import stockrouter from "./routes/StockRoute";
import orderroute from "./routes/OrderRoute";
import "./database";
import jsonerrorsmiddleware from "./middlewares/jsonerrorsMiddleware";
import verifydbmiddleware from "./middlewares/verifydbMiddleware";
import {resolve} from "path";
import cors from "cors";
import urlConfig from "./config/urlConfig";
class App
{
    constructor()
    {
        this.app = express();
        this.middlewares();
        this.routers();
    }
    middlewares(){
        const whitelist = [
            `${urlConfig.url}`,
            `${urlConfig.url_frontend}`
        ];
        const corsOptions = {
            origin:(origin, callback) =>{
                if(whitelist.indexOf(origin)!==-1 || !origin){
                    callback(null, true);
                }
                else
                {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        };
		 //this.app.use("*",cors(corsOptions));
        this.app.use(cors(corsOptions));
        this.app.use(express.urlencoded({extended:true}));
        this.app.use(express.json());


        //Verify middlewares
        this.app.use( verifydbmiddleware);

        //Erros middlewares
        this.app.use(jsonerrorsmiddleware);

       
        this.app.use("/images", express.static(resolve(__dirname,"..","images")));
    }
    routers(){     
        this.app.use("/produto", productrouter);
        this.app.use("/movimento",movementrouter);
        this.app.use("/usuario", userrouter);
        this.app.use("/token",tokenrouter);
        this.app.use("/estoque",stockrouter);
        this.app.use("/pedido",orderroute);
        this.app.get('*', (req,res, next) =>{ res.status(404).json(["404 route not found"]);})
    }
}

export default new App().app;
