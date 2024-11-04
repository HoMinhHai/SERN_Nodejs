import { raw } from 'body-parser';
import db from '../models/index';
require('dotenv').config()
import user from '../models/user';
import emailService from '../services/emailService'
import _, { attempt } from 'lodash'
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = async (limitInput) => {
    try {
        let users = await db.User.findAll({
            limit: 10,
            where: { roleId: "R2" },
            order: [[
                "createdAt", 'DESC'

            ]],
            attributes: { exclude: ['password'] },
            include: [
                { model: db.AllCodes, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                { model: db.AllCodes, as: "genderData", attributes: ['valueEn', 'valueVi'] },
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
        console.log(e)
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
let checkRequiredFields = (inputData) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic'
        , 'addressClinic', 'note', 'specialtyId']
    let isValid = true
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false
            element = arr[i]
            break
        }
    }
    return {
        isValid: isValid,
        element: element
    }

}
let saveDetailInforDoctor = async (inputData) => {
    try {
        let checkObj = checkRequiredFields(inputData)
        if (checkObj.isValid === true) {
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
            let doctorInfor = await db.Doctor_Infor.findOne({
                where: { doctorId: inputData.doctorId },
                raw: false
            })
            if (doctorInfor) {
                //update
                doctorInfor.doctorId = inputData.doctorId;
                doctorInfor.priceId = inputData.selectedPrice;
                doctorInfor.provinceId = inputData.selectedProvince;
                doctorInfor.paymentId = inputData.selectedPayment;


                doctorInfor.nameClinic = inputData.nameClinic;
                doctorInfor.addressClinic = inputData.addressClinic;
                doctorInfor.note = inputData.note;
                doctorInfor.specialtyId = inputData.specialtyId
                doctorInfor.clinicId = inputData.clinicId
                await doctorInfor.save()
            }
            else {
                //create

                await db.Doctor_Infor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.selectedPric,
                    provinceId: inputData.selectedProvince,
                    paymentId: inputData.selectedPayment,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                    note: inputData.note,
                    specialtyId: inputData.specialtyId,
                    clinicId: inputData.clinicId
                })
            }
            return {
                errCode: 0,
                errMessage: "Save successfully"
            }
        }
        else {
            return {
                errCode: 1,
                errMessage: `Missing parameter: ${checkObj.element}`
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
                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.AllCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.AllCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.AllCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }


                        ]
                    },
                    { model: db.AllCodes, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = new Buffer.from(data.image, 'base64').toString('binary')
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
                where: { doctorId: data.doctorId, date: '' + data.formattedDate },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                raw: true
            })

            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && +a.date === +b.date
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
                },
                include: [

                    { model: db.AllCodes, as: "timeTypeData", attributes: ['valueEn', 'valueVi'] },
                    { model: db.User, as: "doctorData", attributes: ['firstName', 'lastName'] },

                ],
                raw: false,
                nest: true
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
let getExtraInforDoctorById = async (idInput) => {
    try {
        if (!idInput) {
            return {
                errCode: 1,
                errMessage: "Missing parameter"
            }
        }
        else {
            let data = await db.Doctor_Infor.findOne({
                where: { doctorId: idInput },
                attributes: { exclude: ['id', 'doctorId'] },
                include: [
                    { model: db.AllCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.AllCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.AllCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }


                ],
                raw: false,
                nest: true
            })
            if (!data)
                return {
                    errCode: 0,
                    data: {}
                }
            else {
                return {
                    errCode: 0,
                    data: data
                }
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}
let getProfileDoctorById = async (inputId) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                errMessage: "Missing parameter"
            }
        }
        else {
            let data = await db.User.findOne({
                where: {
                    id: inputId
                },
                attributes: {
                    exclude: ["password"]
                },
                include: [
                    { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },

                    {
                        model: db.Doctor_Infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.AllCodes, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.AllCodes, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.AllCodes, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }


                        ]
                    },
                    { model: db.AllCodes, as: "positionData", attributes: ['valueEn', 'valueVi'] },
                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = new Buffer.from(data.image, 'base64').toString('binary')
            }
            if (!data)
                data = {}
            return {
                errCode: 0,
                data: data
            }
        }
    }
    catch {

    }
}
let getListPatientForDoctor = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return {
                errCode: 1,
                errMessage: "Missing parameter"
            }
        }
        else {
            let data = await db.Booking.findAll({
                where: {
                    statusId: 'S2',
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    {
                        model: db.User, as: 'patientData',
                        attributes: ['email', 'firstName', 'address', 'gender'],
                        include: [
                            { model: db.AllCodes, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                        ]
                    },
                    { model: db.AllCodes, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi'] }

                ],
                raw: false,
                nest: true
            })
            return {
                errCode: 0,
                data: data
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}
let sendRemedy = async (data) => {
    if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        return {
            errCode: 1,
            errMessage: "Missing parameter"
        }
    }
    else {
        //update patient status
        let appointment = await db.Booking.findOne({
            where: {
                doctorId: data.doctorId,
                patientId: data.patientId,
                timeType: data.timeType,
                statusId: 'S2'
            }, raw: false
        })
        if (appointment) {
            appointment.statusId = 'S3'
            await appointment.save()
        }
        await emailService.sendAttachment(data)
        return {
            errCode: 0,
            errMessage: "ok"
        }
    }
}
module.exports = {
    sendRemedy,
    getScheduleByDate, getTopDoctorHome, getAllDoctors, saveDetailInforDoctor, getDetailDoctorById, bulkCreateSchedule
    , getExtraInforDoctorById, getProfileDoctorById, getListPatientForDoctor
}