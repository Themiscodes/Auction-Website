const multer = require('multer');

// Save the photo on the images/ folder
const storage = multer.diskStorage({

    destination: (req, file, cb)=>{
        cb(null, `images`)
    }, 
    filename: (req, file, cb )=>{
        console.log(file)
        cb(null, req.params.id )
    }

});

const upload =  multer({storage: storage});

module.exports = {upload};