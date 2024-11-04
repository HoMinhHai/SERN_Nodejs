import db from '../models/index';
import dotenv from 'dotenv';
import { sendSimpleEmail } from './emailService';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
    // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
}
let postBookAppoinment = async (data) => {
    try {
        if (!data.email || !data.doctorId || !data.timeType || !data.date ||
            !data.fullName || !data.selectedGender || !data.address
        ) {
            return { errCode: 1, errMessage: "Missing parameters " };
        }
        else {
            let token = uuidv4();

            await sendSimpleEmail({
                receiver: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                language: data.language,
                redirectLink: buildUrlEmail(data.doctorId, token)
            })

            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3',
                    gender: data.selectedGender,
                    address: data.address,
                    firstName: data.fullName
                }
            })
            if (user && user[0]) {
                await db.Booking.findOrCreate({
                    where: { patientId: user[0].id },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType,
                        token: token
                    }

                })
            }
            return {
                errCode: 0,
                errMessage: "save successfully"
            }
        }
    }
    catch (e) {
        return;
    }
}
let postVerifyBookAppoinment = async (data) => {
    try {
        if (!data.token || !data.doctorId) {
            return { errCode: 1, errMessage: "Missing parameters " };
        }
        else {
            let appoinment = await db.Booking.findOne(
                {
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                }
            )
            if (appoinment) {
                appoinment.statusId = 'S2'
                await appoinment.save()
                return {
                    errCode: 0,
                    errMessage: "Update successfully"
                }
            }
            return {
                errCode: 2,
                errMessage: "Appointment does not exists"
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}
module.exports = { postBookAppoinment, postVerifyBookAppoinment }