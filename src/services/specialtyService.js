import db from '../models/index';
let createSpecialty = async (data) => {
    try {
        if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
            return { errCode: 1, errMessage: "Missing parameters " };
        }
        else {
            await db.Specialty.create({
                name: data.name,
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
let getAllSpecialty = async () => {
    try {
        let data = await db.Specialty.findAll({

        })
        if (data && data.length > 0) {
            data = data.map(item => {
                if (item && item.image) {
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
let getDetailSpecialtyById = async (inputId, location) => {
    try {
        if (!inputId || !location) {
            return { errCode: 1, errMessage: "Missing parameters " };
        }
        else {


            let data = await db.Specialty.findOne({
                where: { id: inputId },
                attributes: ['descriptionHTML', 'descriptionMarkdown']
            })
            if (data) {
                let doctorSpecialty = []
                if (location === 'ALL') {
                    doctorSpecialty = await db.Doctor_Infor.findAll({
                        where: { specialtyId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })
                }
                else {
                    doctorSpecialty = await db.Doctor_Infor.findAll({
                        where: { specialtyId: inputId, provinceId: location },
                        attributes: ['doctorId', 'provinceId']
                    })
                }

                data.doctorSpecialty = doctorSpecialty

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
    createSpecialty, getAllSpecialty, getDetailSpecialtyById
}