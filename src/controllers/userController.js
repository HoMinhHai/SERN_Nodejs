import userService from '../services/userService'
const handleLogin = async (req, res) => {

    let email = req.body.email
    let password = req.body.password
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameter'
        })
    }
    let userData = await userService.handleUserLogin(email, password)
    res.status(200).json({

        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
const handleGetAllUsers = async (req, res) => {
    let id = req.query.id //all,id

    let user = await userService.getAllUsers(id)
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
            user: []
        })
    }
    let users = await userService.getAllUsers(id)
    return res.status(200).json({
        errCode: 1,
        errMessage: 'Ok',
        users
    })

}
let handleCreateNewUser = async (req, res) => {
    console.log('req.body = ', req.body)
    let message = await userService.createNewUser(req.body)
    console.log('req.body = ', req.body)
    console.log('message = ', message)
    return res.status(200).json(message)
}
let handleEditUser = async (req, res) => {

    let data = req.body;
    console.log('data no tra ve', data)
    let message = await userService.updateuserDAta(data)
    return res.status(200).json(message)

}
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter'
        })
    }

    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message)
}
module.exports = { handleLogin, handleGetAllUsers, handleCreateNewUser, handleEditUser, handleDeleteUser }