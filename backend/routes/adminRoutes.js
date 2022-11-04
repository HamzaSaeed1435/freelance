const express = require("express");
const router = express.Router();
const {
    registerAdmin,
    loginAdmin,
    getFreelancers,
    getClients,
    getExchangeSkills,
    getProposal,
    deleteFreelancer,
    deleteClients,
    deleteExchangeSkills,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");



router.route('/register').post(registerAdmin)  //register api 

router.route('/login').post(loginAdmin)   //login  api

router.route('/freelancers').get(protect , getFreelancers)  //get freeelancers


router.route('/clients').get(protect , getClients)  // get clients

router.route('/ExchangeSkills').get(protect , getExchangeSkills)  // get Exchange Skills 

router.route('/proposals').get(protect , getProposal)   // get propsoals one exchange skills

router.route('/freelancer').delete(protect , deleteFreelancer)     // delete freelancer

router.route('/clients').delete(protect , deleteClients)  

router.route('/ExchangeSkills').delete(protect , deleteExchangeSkills)  


module.exports = router;
