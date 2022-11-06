const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { isResetTokenValid } = require("../utils/verifyPasswordToken");
const { 
  add_gig,
  edit_gig,
  delete_gig,
  get_gigs,
  create_order
 } = require("../controllers/gig.controller");

const multer  = require('multer')
let upload = multer({ dest: 'uploads/' })


//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `/${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "jpeg" || file.mimetype.split("/")[1] === "png" || 
  file.mimetype.split("/")[1] === "GIF"  ) {
    cb(null, true);
  } else {
    cb(new Error("Not a jpg File!!"), false);
  }
};

upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  

// add gig
router.route("/add_gig").post(protect, upload.single('attachments') ,add_gig);


// edit gig
router.route("/edit_gig/:gig_id").patch(protect, upload.single('attachments') ,edit_gig);


// delete gig
router.route("/delete_gig/:gig_id").delete(protect, upload.array('attachments') ,delete_gig);


// show all gigs with freelancer
router.route("/get_gigs").get(protect, upload.array('attachments') ,get_gigs);


// create order
router.route("/create_order/:gig_id").post(protect, create_order);


module.exports = router;