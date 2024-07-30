import { Model, DataTypes } from "sequelize";
import UserModel from "./UserModel";

class OrderModel extends Model{
    static init(sequelize){
        super.init({
            idcliente:{
                type: DataTypes.INTEGER,
                allowNull:false,
                references:{
                    tableName:'usuarios',
                    key:'id'
                },
                validate:{
                    notNull:{
                        msg:"O campo idcliente tem que ser preenchido"
                    },
                    async verifyFK(value){
                        const id = value;
                        const user = await UserModel.findByPk(id);
                        if(!user)
                            throw new Error("O campo idcliente  não foi registrado");
                    }
                }
            },
            idusuario:{
                type: DataTypes.INTEGER,
                allowNull:false,
                references:{
                    tableName:'usuarios',
                    key:'id'
                },
                validate:{
                    notNull:{
                        msg:"O campo idusuario tem que ser preenchido"
                    },
                    async verifyFK(value){
                        const user = await UserModel.findByPk(value);
                        if(!user)
                            throw new Error("O campo idusuario  não foi registrado");
                    }
                }
            },
            idusuarioalt:{
                type: DataTypes.INTEGER,
                allowNull:false,
                references:{
                    tableName:'usuarios',
                    key:'id'
                },
                validate:{
                    notNull:{
                        msg:"O campo idusuarioalt tem que ser preenchido"
                    },
                    async verifyFK(value){
                        const user = await UserModel.findByPk(value);
                        if(!user)
                            throw new Error("O campo idcliente  não foi registrado");
                    }
                }
            },
            fase:{
                type: DataTypes.STRING,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo fase é obrigatório e deve ser preenchido com PENDENTE, CONCLUIDO ou CANCELADO"
                    },
                    isIn:{
                        args:[["PENDENTE","CONCLUIDO","CANCELADO"]],
                        msg:"O campo fase dever preenchido com PENDENTE, CONCLUIDO ou CANCELADO"
                    }
                }
            },
            estado:{
                type:DataTypes.STRING,
                defaultValue: 'NORMAL',
                validate:{
                    isIn:{
                        args:[["NORMAL","CANCELADO"]],
                        msg:'O campo estado pode ser apenas NORMAL ou CANCELADO'
                    }
                }
            },
            datamovimento:{
                type: DataTypes.DATE,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo datamovimento é obrigatório"
                    }
                }

            },
            created_at:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updated_at:{
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },{sequelize, tableName:"pedidos"});
        return this;
    }

    static associate(models){
        this.belongsTo(models.UserModel, {foreignKey:"idcliente"});
        this.belongsTo(models.UserModel, {foreignKey:"idusuario"});
        this.belongsTo(models.UserModel, {foreignKey:"idusuarioalt"});
        this.hasMany(models.OrderItemModel, {foreignKey:"idpedido", as:"itens"});
    }

}
export default OrderModel;
