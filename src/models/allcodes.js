'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AllCodes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            AllCodes.hasMany(models.User, { foreignKey: "positionId", as: "positionData" })
            AllCodes.hasMany(models.User, { foreignKey: "gender", as: "genderData" })
            AllCodes.hasMany(models.Schedule, { foreignKey: "timeType", as: "timeTypeData" })

            AllCodes.hasMany(models.Doctor_Infor, { foreignKey: "priceId", as: "priceTypeData" })
            AllCodes.hasMany(models.Doctor_Infor, { foreignKey: "provinceId", as: "provinceTypeData" })
            AllCodes.hasMany(models.Doctor_Infor, { foreignKey: "paymentId", as: "paymentTypeData" })

            AllCodes.hasMany(models.Booking, { foreignKey: "timeType", as: "timeTypeDataPatient" })


        }
    }
    AllCodes.init({

        keyMap: DataTypes.STRING,
        type: DataTypes.BOOLEAN,
        valueEn: DataTypes.STRING,
        valueVi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'AllCodes',
    });
    return AllCodes;
};