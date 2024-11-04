require('dotenv').config()
const nodemailer = require("nodemailer");
let sendSimpleEmail = async (dataSend) => {
    console.log(dataSend)
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.EMAIL_APP_PASSWORD
            },
        });


        const info = await transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to: dataSend.receiver, // list of receivers
            subject: "Thông tin đặt lịch khám bệnh ", // Subject line

            html: getBodyHTMLEmail(dataSend),
        });
    }
    catch (e) {
        console.log(e)
    }

}
let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Hello ${dataSend.patientName}!</h3>
        <p>You get this email for booking your apoinment in bookingcare.vn</p>
        <p>This is your appointment infor </p>
        <div><b>Time:${dataSend.time} </b></div>
         <div><b>Doctor:${dataSend.doctorName} </b></div>
         <p>If above information is correct, click the link below to confirm</p>
         <div>
         <a href=${dataSend.redirectLink} target="_blank">Nhấn vào đây</a>
         </div>
         <div>Cảm ơn </div>
        `
    }
    else {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên booking care</p>
        <p>Thong tin dat lich kham benh </p>
        <div><b>Thoi gian:${dataSend.time} </b></div>
         <div><b>Bác sĩ:${dataSend.doctorName} </b></div>
         <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để xác nhận</p>
         <div>
         <a href=${dataSend.redirectLink} target="_blank">Nhấn vào đây</a>
         </div>
         <div>Cảm ơn </div>
        `
    }
    return result
}
let sendAttachment = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    });


    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh ", // Subject line

        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: "base64"
            }
        ]
    });
}
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
        <h3>Hello ${dataSend.patientName}</h3>
        <p>You get this email for booking your apoinment in bookingcare.vn</p>
        <p>Your remedy in file </p>
       
        
         <div>
        
         </div>
         <div>Cảm ơn </div>
        `
    }
    else {
        result = `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên booking care thành công</p>
        <p>Thong tin dat lich kham benh </p>
       
         <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để xác nhận</p>
         <div>
        
         </div>
         <div>Cảm ơn </div>
        `
    }
    return result
}
module.exports = { sendSimpleEmail, sendAttachment }