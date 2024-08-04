require("dotenv").config();
export default {
    url: `${process.env.PROTOCOL}${process.env.API_DOMAIN}:${process.env.API_PORT}`,
    url_frontend: `${process.env.PROTOCOL_FRONTEND}${process.env.FRONTEND_DOMAIN}`
}
