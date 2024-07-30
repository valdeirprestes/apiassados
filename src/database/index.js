import Sequelize from "sequelize";
import databaseConfig from "../config/databaseConfig";

import UserModel from "../models/UserModel";
import ProductModel from "../models/ProductModel";
import MovementModel from "../models/MovementModel";
import CloseMovementModel from "../models/CloseMovementModel";
import StockModel from "../models/StockModel";
import OrderModel from "../models/OrderModel";
import OrderItemModel from "../models/OrderItemModel";

const models = [
    UserModel, 
    ProductModel, 
    MovementModel, 
    CloseMovementModel, 
    StockModel, 
    OrderModel, 
    OrderItemModel];
const connection = new Sequelize(databaseConfig);
models.forEach( model => model.init(connection));
models.forEach(model=> model.associate && model.associate(connection.models));
