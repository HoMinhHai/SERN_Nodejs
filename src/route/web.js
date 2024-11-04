import express from 'express'
import homeController from '../controllers/homeController'
import userController from '../controllers/userController'
import doctorController from '../controllers/doctorController'
import patientController from '../controllers/patientController'
import specialtyController from '../controllers/specialtyController'
import clinicController from '../controllers/clinicController'
let route = express.Router()
let initWebRoutes = (app) => {
    route.get('/', homeController.getHomePage)
    route.get('/hai', (req, res) => {
        return res.send("Hello Hai")
    })
    route.get('/crud', homeController.getCRUD);
    route.post('/post-crud', homeController.postCRUD)
    route.get('/get-crud', homeController.displayGetCRUD)
    route.get('/edit-crud', homeController.getEditCRUD)
    route.post('/put-crud', homeController.putCRUD)
    route.get('/delete-crud', homeController.deleteCRUD)
    route.post('/api/login', userController.handleLogin)
    route.get('/api/get-all-users', userController.handleGetAllUsers)
    route.post('/api/create-new-user', userController.handleCreateNewUser)
    route.put('/api/edit-user', userController.handleEditUser)
    route.delete('/api/delete-user', userController.handleDeleteUser)
    route.get('/api/allcode', userController.getAllCode)
    route.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    route.get('/api/get-all-doctors', doctorController.getAllDoctors)

    route.post('/api/save-info-doctors', doctorController.postInforDoctor)
    route.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById)

    route.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)
    route.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate)
    route.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById)
    route.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById)
    route.post('/api/patient-book-appointment', patientController.postBookAppoinment)

    route.post('/api/verify-book-appointment', patientController.postVerifyBookAppoinment)


    route.post('/api/create-new-specialty', specialtyController.createSpecialty)

    route.get('/api/get-specialty', specialtyController.getAllSpecialty)
    route.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)

    // route.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)



    route.post('/api/create-new-clinic', clinicController.createClinic)

    route.get('/api/get-clinic', clinicController.getAllClinic)
    route.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)
    route.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor)


    route.post('/api/send-remedy', doctorController.sendRemedy)

    return app.use("/", route)
}
module.exports = initWebRoutes;