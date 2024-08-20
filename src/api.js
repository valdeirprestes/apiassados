import express from "express";
import userrouter from "./routes/UserRoute";
import tokenrouter from "./routes/TokenRoute";
import productrouter from "./routes/ProductRoute";
import movementrouter from "./routes/MovementRoute";
import stockrouter from "./routes/StockRoute";
import orderroute from "./routes/OrderRoute";
import categoryroute from "./routes/CategoryRoute";
import "./database";
import jsonerrorsmiddleware from "./middlewares/jsonerrorsMiddleware";
import verifydbmiddleware from "./middlewares/verifydbMiddleware";
import {resolve} from "path";
import cors from "cors";
import urlConfig from "./config/urlConfig";
import fs from "fs";
class App
{
    constructor()
    {
        this.verifyfolders();
        this.app = express();
        this.middlewares();
        this.routers();
    }
    verifyfolders(){
        try{
            const folder = "./images";
            console.log("Checando pasta", folder, "...")
            if(!fs.existsSync(folder))
            {
                console.log("Criando a pasta images para os produtos...")
                fs.mkdirSync(folder);
                console.log("Pasta images criada")
            }
            else
                console.log("Pasta", folder, "OK!\n\n");
        }catch(e){
            console.log(e);
            console.log("Não conseguiu criar a pasta images, necessária para guarda imagens dos produtos!!")
        }
    }
    
    middlewares(){
        const whitelist = [
            `${urlConfig.url}`,
            `${urlConfig.url_frontend}`,
        ];
        const corsOptions = {
			   methods:"GET, POST, PUT, DELETE",
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
		 const corsOptions2 = {
			  "origin": "*",
			  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
			  "preflightContinue": false,
			  "optionsSuccessStatus": 204
		};
		 //this.app.use("*",cors(corsOptions));
        //this.app.use(cors());

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
        this.app.use("/categorias",categoryroute);
        this.app.get('*', (req,res, next) =>{ 
			  res.status(404).json({"errors":["404 route not found"]});
		  })
    }
}

export default new App().app;
