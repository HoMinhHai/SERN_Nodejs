import express from 'express'
import db from '../models/index'
import { json } from 'body-parser'
import CRUDService from '../services/CRUDService'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })
    }
    catch (e) {
        console.log(e)
    }


}
let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    return res.send("post crud 123")
}
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser()

    return res.render('displayCRUD.ejs', { dataTable: data })
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId)
        return res.render('editCRUD.ejs', { user: userData })
    }
    return res.send("user not found")
}
let putCRUD = async (req, res) => {
    let allUser = await CRUDService.updateUserData(req.body)
    return res.render('displayCRUD.ejs', { dataTable: allUser })
}
let deleteCRUD = async (req, res) => {
    let id = req.query.id
    if (id) {
        await CRUDService.deleteUserById(id)
        return res.send("Done")
    }
    return res.send("User is not exist")

}
module.exports = {
    getHomePage,
    getCRUD, postCRUD, displayGetCRUD, getEditCRUD, putCRUD, deleteCRUD
}