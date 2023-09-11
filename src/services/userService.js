import db from '../models/index';

var bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'password', 'roleId'],
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
            let users = ''
            console.log('====', userId)
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
            console.log('.....', users)
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
                    firstName: data.FirstName,
                    lastName: data.LastName,
                    address: data.Address,
                    phonenumber: data.PhoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.Role,

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
            console.log('12345')
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

            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            console.log(user)
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address


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
module.exports = { handleUserLogin, getAllUsers, createNewUser, deleteUser, updateuserDAta }