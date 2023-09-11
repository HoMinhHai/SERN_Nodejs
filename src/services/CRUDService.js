var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
import db from '../models/index';
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordByBcrypt = await hashUserPassword(data.password)

            await db.User.create({
                email: data.email,
                password: hashPasswordByBcrypt,
                firstName: data.FirstName,
                lastName: data.LastName,
                address: data.Address,
                phonenumber: data.PhoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.Role,

            })
            resolve('Ok ')
        }
        catch (e) {
            reject(e)
        }
    })

}
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPashword = await bcrypt.hashSync(password, salt);
            resolve(hashPashword)
        }
        catch (e) {
            reject(e)
        }


    })
}
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({ raw: true });
            resolve(users)
        }
        catch (e) {
            reject(e)
        }
    })
}
let getUserInfoById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: userId }, raw: true })
            if (user)
                resolve(user)
            else
                resolve({})
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = { createNewUser, getAllUser };