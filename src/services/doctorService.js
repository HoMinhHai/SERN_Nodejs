import { raw } from 'body-parser';
import db from '../models/index';
require('dotenv').config()
import user from '../models/user';
import _ from 'lodash'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = async (limitInput) => {
    try {
        let users = await db.User.findAll({
            limit: limitInput,
            where: { roleId: "R2" },
            order: [[
                "createdAt", 'DESC'

            ]],
            attributes: { exclude: ['password'] },
            include: [
                { model: db.allcodes, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                { model: db.allcodes, as: "genderData", attributes: ['valueEn', 'valueVi'] },
            ],
            raw: true,
            nest: true
        })
        return {
            errCode: 0,
            data: users
        }
    }
    catch (e) {

    }
}
let getAllDoctors = async () => {
    try {
        let doctors = await db.User.findAll({
            where: { roleId: 'R2' },
            attributes: {
                exclude: ['password', 'image']
            }
        })
        return {
            errCode: 0,
            data: doctors
        }
    }
    catch (e) {
        return
    }
}
let saveDetailInforDoctor = async (inputData) => {
    try {
        if (inputData.doctorId && inputData.contentHTML && inputData.contentMarkdown && inputData.action) {
            if (inputData.action === "CREATE") {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                })
            }
            else {

                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false
                })
                if (doctorMarkdown) {
                    doctorMarkdown.contentHTML = inputData.contentHTML;
                    doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                    doctorMarkdown.description = inputData.description;
                    await doctorMarkdown.save()
                }
            }

            return {
                errCode: 0,
                errMessage: "Save successfully"
            }
        }
        else {
            return {
                errCode: 1,
                errMessage: "Missing parameter"
            }
        }
    }
    catch (e) {
        return;
    }
}
let getDetailDoctorById = async (inputId) => {
    try {

        if (inputId) {
            let data = await db.User.findOne({
                where: {
                    id: inputId
                },
                attributes: {
                    exclude: ["password"]
                },
                include: [
                    { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                    { model: db.allcodes, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary')
            }
            return {
                errCode: 0,
                data: data
            }
        }
        else {
            return {
                errCode: 1,
                errMessage: "Missing id parameter"
            }
        }
    }
    catch (e) {
        return;
    }
}
let bulkCreateSchedule = async (data) => {
    try {
        if (data.arrSchedule && data.doctorId && data.formattedDate) {
            let schedule = data.arrSchedule
            if (schedule && schedule.length > 0) {
                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE
                    return item
                })
            }
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: data.formattedDate },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                raw: true
            })
            if (existing && existing.length > 0) {
                existing = existing.map(item => {
                    item.date = new Date(item.date).getTime()
                    return item;
                })
            }
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date
            })
            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate)
            }
            return {
                errCode: 0,
                errMessage: 'Ok'
            }
        }
        else {
            return {
                errCode: 1,
                errMessage: "Missing required parameter"
            }
        }

    }
    catch (e) {
        return;
    }
}
let getScheduleByDate = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return {
                errCode: 1,
                errMessage: "Missing parameter"
            }
        }
        else {
            let dataSchedule = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                }
            })
            if (!dataSchedule)
                dataSchedule = []
            return {
                errCode: 0,
                data: dataSchedule
            }
        }
    }
    catch (e) {
        console.log(e)
        return {
            err: "err"
        }
    }
}
module.exports = { getScheduleByDate, getTopDoctorHome, getAllDoctors, saveDetailInforDoctor, getDetailDoctorById, bulkCreateSchedule }