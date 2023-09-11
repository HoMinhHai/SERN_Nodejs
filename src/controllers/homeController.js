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
    console.log(message)
    //console.log(req.body)
    return res.send("post crud")
}
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser()

    return res.render('displayCRUD.ejs', { dataTable: data })
}
// let getEditCRUD = async (req, res) => {
//     let userId = req.query.id;
//     if (userId) {
//         let userData = await CRUDService.getUserInfoById(userId)
//         return res.render('editCRUD.ejs')
//     }

//     else return res.send("user not found")
// }
module.exports = {
    getHomePage,
    getCRUD, postCRUD, displayGetCRUD
}