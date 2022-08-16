const express = require('express');
const { getAllUsers, getSingleUser, updateUser, updateUserPassword, showCurrentUser } = require('../controllers/userController');
const router = express.Router()

const {authenticateUser, authorizePermissions} = require('../middlewares/authentication')

router.route('/').get(authenticateUser,authorizePermissions('admin'),getAllUsers)
router.route('/showMe').get(authenticateUser,showCurrentUser)
router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword)

router.route('/:id').get(authenticateUser,getSingleUser)

module.exports = router;