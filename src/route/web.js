import express from 'express'
import homeController from '../controllers/homeController'
import userController from '../controllers/userController'
import doctorController from '../controllers/doctorController'
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


    return app.use("/", route)
}
module.exports = initWebRoutes;