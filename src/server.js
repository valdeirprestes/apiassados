import dotenv from "dotenv";
import api from "./api";
import urlConfig from "./config/urlConfig";
dotenv.config();
const domain = process.env.API_DOMAIN;
const port = process.env.API_PORT;

api.listen( 
    port,
    ()=>
    {
        console.log(`Run ${urlConfig.url}`);
        console.log("Press Ctrl + C for stop application")
    }

);




