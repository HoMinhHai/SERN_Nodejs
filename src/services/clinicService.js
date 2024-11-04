import db from '../models/index';
let createClinic = async (data) => {
    try {
        if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown || !data.address) {
            return { errCode: 1, errMessage: "Missing parameters " };
        }
        else {
            await db.Clinic.create({
                name: data.name,
                address: data.address,
                image: data.imageBase64,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown
            })
            return {
                errCode: 0,
                errMessage: 'Success'
            }
        }
    }
    catch {

    }
}
let getAllClinic = async () => {
    try {
        let data = await db.Clinic.findAll({

        })
        if (data && data.length > 0) {
            data = data.map(item => {
                if (item && item.image) {  // Kiểm tra image của từng item
                    item.image = new Buffer.from(item.image, 'base64').toString('binary')
                }
                return item // Trả về item đã sửa đổi
            })
        }
        return {
            errCode: 0,
            data: data
        }
    }
    catch (e) {
        console.log(e)
    }
}
let getDetailClinicById = async (inputId) => {
    try {
        if (!inputId) {
            return { errCode: 1, errMessage: "Missing parameters " };
        }
        else {


            let data = await db.Clinic.findOne({
                where: { id: inputId },
                attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'address']
            })
            if (data) {
                let doctorClinic = []
                doctorClinic = await db.Doctor_Infor.findAll({
                    where: { clinicId: inputId },
                    attributes: ['nameClinic', 'addressClinic', 'doctorId', 'provinceId'],

                })
                data.doctorClinic = doctorClinic

            }
            else data = {}
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
module.exports = {
    createClinic, getAllClinic, getDetailClinicById
}