/* jshint esversion: 6 */

/**
 * all routing occurs at /api/repo
 * the targeted file system path is not exposed as a url, 
 * rather it is sent from the client to the server to 
 * determine what folder to read, modify, update, or delete
 */

const express = require("express");   
const multer = require("multer");
const fsCtrl = require("../controllers/repo");
// const authenticationController = require('../controllers/auth.controller');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// router.post("/authenticate", authenticationController);

router.get("/:folder*?", fsCtrl.readFolder);

router.post("/repo", upload.any(), function(req, res, next) {
    if (req.files) {
        fsCtrl.upload(req, res);
    } else {
        next();
    }
});

router.post("/:folder*?/:data*?", fsCtrl.createFolder);


module.exports = router;