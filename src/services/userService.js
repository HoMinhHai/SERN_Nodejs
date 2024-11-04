import db from '../models/index';
import user from '../models/user';

var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['id', 'email', 'password', 'roleId', 'firstName', 'lastName'],
                    raw: true,
                    where: { email: email }
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if (check) {

                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.password;
                        userData.user = user;

                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password'
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found'
                }

            }
            else {
                userData.errCode = 1
                userData.errMessage = `Your's email isn't exist in system`
                resolve(userData)
            }
            resolve(userData);
        }

        catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(user)
            } else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = []
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: { exclude: ['password'] }
                })
            }
            if (userId && userId !== 'ALL') {

                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ['password'] }
                })
            }
            resolve(users)
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
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let check = await checkUserEmail(data.email)
            if (check) {
                resolve({
                    errCode: 1,
                    message: 'Your email is already is used, try another email'
                })
            } else {
                let hashPasswordByBcrypt = await hashUserPassword(data.password)
                db.User.create({
                    email: data.email,
                    password: hashPasswordByBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'ok'
                })
            }

        }
        catch (e) {
            reject(e)
        }
    })
}
let deleteUser = (userId) => {

    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: 'The user is delected'
        })
    })
}
let updateuserDAta = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.roleId = data.roleId
                user.positionId = data.positionId
                user.gender = data.gender
                user.phonenumber = data.phonenumber
                if (data.avatar)
                    user.image = data.avatar
                await user.save()

                resolve({
                    errCode: 0,
                    errMessage: 'update user success'
                })

            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllCodeservice = async (typeInput) => {
    try {
        if (typeInput) {
            let allCode = await db.AllCodes.findAll({
                where: { type: typeInput }
            })
            return { errCode: 0, data: allCode };
        }
        return {
            errCode: 1,
            errMessage: "Missing required parameter"
        }
    }
    catch (e) {
        return;
    }
}

module.exports = { handleUserLogin, getAllUsers, createNewUser, deleteUser, updateuserDAta, getAllCodeservice }