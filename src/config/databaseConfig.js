require('dotenv').config();
module.exports = {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username:process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    define:{
        timestamps:true,
        underscored:true,
        underscoredALL:true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    
    dialectOptions:{
        timezone: process.env.DATABASE_TIMEZONE,
    },
    
    timezone: process.env.DATABASE_TIMEZONE,
}
