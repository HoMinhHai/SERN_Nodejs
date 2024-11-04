import express from 'express'
import db from '../models/index'
import { json } from 'body-parser'
import patientService from '../services/patientService'
let postBookAppoinment = async (req, res) => {

    try {
        let infor = await patientService.postBookAppoinment(req.body)
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "An error has occured"
        })
    }
}
let postVerifyBookAppoinment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppoinment(req.body)
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "An error has occured"
        })
    }
}
module.exports = { postBookAppoinment, postVerifyBookAppoinment }