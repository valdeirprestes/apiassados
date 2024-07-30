import { Model } from "sequelize";
import { DataTypes } from "sequelize";
import UserModel from "./UserModel";

class MovementModel extends Model{
    static init(sequelize){
        super.init({
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
            data:{
                type:DataTypes.DATE,
                allowNull:false,
                validate:{
                    notNull:{
                        msg:"O campo data é obrigatório"
                    }
                }
            },
            operacao:{
                type:DataTypes.STRING,
                defaultValue:'ABERTO',
                validate:{
                    isIn:{
                        args:[["ABERTO","FECHADO"]],
                        msg:"O campo operacao poder ser atribuido ABERTO ou FECHADO"
                    }
                }

            },
            idusuario:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    model:'usuarios',
                    key:'id'
                  },
                  validate:{
                    notNull:{
                        msg:"O campo idusuario é obrigatório para informmar que usuário vai criar o movimento"
                    },
                    async verifyFK( fkId){
                        const user = await UserModel.findByPk(fkId, {while: { estado: 'NORMAL'}});
                        if(!user)
                            throw new Error(`O campo idusuario valor ${fkId} é inválido`);

                    }
                }
            },
            idusuarioalt:{
                type:DataTypes.INTEGER,
                allowNull:false,
                references:{
                    model:'usuarios',
                    key:'id'
                  },
                  validate:{
                    notNull:{
                        msg:"O campo idusuarioalt é obrigatório para informmar que usuário vai alterar o movimento"
                    },
                    async verifyFK( fkId){
                        const user = await UserModel.findByPk(fkId, {while: { estado: 'NORMAL'}});
                        if(!user)
                            throw new Error(`O campo idusuarioalt valor ${fkId} é inválido`);

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
        },{sequelize, tableName:"movimentos"});
        return this;
    }
    static associate(models){
        this.belongsTo(models.UserModel,{foreignKey:"idusuario"});
        this.belongsTo(models.UserModel,{foreignKey:"idusuarioalt"});
        this.hasMany(models.CloseMovementModel, { foreignKey:"idmov", as:"fechamentos"});
    }
}



export default MovementModel;