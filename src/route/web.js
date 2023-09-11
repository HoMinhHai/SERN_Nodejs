import express from 'express'
import homeController from '../controllers/homeController'
import userController from '../controllers/userController'
let route = express.Router()
let initWebRoutes = (app) => {
    route.get('/', homeController.getHomePage)
    route.get('/hai', (req, res) => {
        return res.send("Hello Hai")
    })
    route.get('/crud', homeController.getCRUD);
    route.post('/post-crud', homeController.postCRUD)
    route.get('/get-crud', homeController.displayGetCRUD)
    route.post('/api/login', userController.handleLogin)
    route.get('/api/get-all-users', userController.handleGetAllUsers)
    route.post('/api/create-new-user', userController.handleCreateNewUser)
    route.put('/api/edit-user', userController.handleEditUser)
    route.delete('/api/delete-user', userController.handleDeleteUser)
    return app.use("/", route)
}
module.exports = initWebRoutes;