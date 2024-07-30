require("dotenv").config();
export default {
    url: `${process.env.API_DOMAIN}:${process.env.API_PORT}`
}