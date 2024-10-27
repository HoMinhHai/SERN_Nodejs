import bcrypt from 'bcryptjs'
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    try {
        let hashPasswordByBcrypt = await hashUserPassword(data.password);
        await db.User.create({
            email: data.email,
            password: hashPasswordByBcrypt,
            firstName: data.FirstName,
            lastName: data.LastName,
            address: data.Address,
            phonenumber: data.PhoneNumber,
            gender: data.gender === '1' ? true : false,
            roleId: data.Role,
        });
        return 'Ok 123';
    } catch (e) {
        throw e;
    }
};

let hashUserPassword = (password) => {
    return bcrypt.hash(password, salt);
}
let getAllUser = async () => {
    try {
        let users = await db.User.findAll({ raw: true });
        return users;
    } catch (e) {
        throw e;
    }
};

let getUserInfoById = async (userId) => {
    try {
        let user = await db.User.findOne({ where: { id: userId }, raw: true })
        if (user)
            return user;
        else
            return;
    }
    catch (e) {
        throw (e)
    }

}
let updateUserData = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id }
        })
        if (user) {
            await db.User.update({
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address
            }, {
                where: { id: data.id }
            });
            let allUser = await db.User.findAll()
            return allUser;
        }
    }
    catch (e) {
        throw (e)
    }
}
let deleteUserById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: false
        })
        if (user) {
            await user.destroy()
        }
    }
    catch (e) {
        throw (e)
    }
}
module.exports = { createNewUser, getAllUser, getUserInfoById, updateUserData, deleteUserById };