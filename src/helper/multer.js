const path = require("path");
const fs = require("fs");
const multer = require("multer");
var maxSize= process.env.maxFileSize === undefined ? 50 * 1024 * 1024 : process.env.maxFileSize; //default 3MB
/* for multer upload lib */
exports.handle = (err, res) => {
    // res.status(500).contentType("text/plain")
    // console.log(err);
    res.contentType("text/plain")
        .end("Oops! Something went wrong!");
};
exports.upload = multer({
    dest: __dirname + '/../../dist/uploads/temp/',
    limits: { fileSize: maxSize }
});
