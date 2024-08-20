import { Model } from "sequelize";
import { DataTypes } from "sequelize";
import UserModel from "./UserModel";
import MovementModel from "./MovementModel";
class CloseMovementModel extends Model{
    static init(sequelize){
        super.init({
        idmov:
        {
            type: DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:'movimentos',
                key:'id'
            },
             validate:{
                notNull:{
                msg:"O campo idmov é obrigado para informa qual movimento vai fechar"
                },
                async verifyFK(value){
                  const movement = await  MovementModel.findByPk(value);
                  if(!movement)
                      throw new Error("O campo movement  não foi registrado");
              }
            }
        },
        idusuario:
        {
          type: DataTypes.INTEGER,
          allowNull:false,
          references:{
            model:'usuarios',
            key:'id'
          },
          validate:{
            notNull:{
                msg:"O campo idusuario é obrigatório para informmar que usuário vai fechar o movimento"
            },
            async verifyFK(value){
              const user = await  UserModel.findByPk(value);
              if(!user)
                  throw new Error("O campo idusuario  não foi registrado");
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
        created_at:
        {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        },
        updated_at:{
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }

        },
        {sequelize, tableName:'fechamovimentos'});
        
        return this;
    }
    static associate(models){
        this.belongsTo(models.MovementModel, { foreignKey:"idmov", as:"fechamentos" });
        this.belongsTo(models.UserModel, { foreignKey:"idusuario"});
    }
}



export default CloseMovementModel;