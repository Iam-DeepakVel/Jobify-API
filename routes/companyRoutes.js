const express = require('express')
const router = express.Router()

const {
  createCompanyProfile,
  getAllCompanyProfile,
  getSingleCompanyProfile,
  updateCompanyProfile,
  uploadCompanyImage
} = require('../controllers/companyController')

const {authenticateUser} = require('../middlewares/authentication')

router.route('/').post(authenticateUser,createCompanyProfile).get(authenticateUser,getAllCompanyProfile)
router.route('/uploadCompanyProfileImage').post(authenticateUser,uploadCompanyImage)
router.route('/:id').get(authenticateUser,getSingleCompanyProfile).patch(authenticateUser,updateCompanyProfile)

module.exports = router