const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended : true }))

// multer 
const storage = multer.diskStorage({
    destination : 'public/uploads',
    filename: function(req, file, cb) {
        cb(null, 'file' + Date.now() + path.extname(file.originalname) )
    }
});
const upload = multer({
    storage : storage,
    fileFilter: function(req, file, cb) {
        var validextensions = ['.png', '.jpg', '.jpeg'];
        var ext  = path.extname(file.originalname);
        if(!validextensions.includes(ext)){
            return cb(new Error("please choose .png .jpg .jpeg file"))
        }
        cb(null, true);
    },
    limits : { fileSize: 1250000 * 10 } 
})

app.use(expressSession({
    secret: 'randam',
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 1000
}));

app.use(csrf());

app.get('/', (req, res) => {
    res.render('index.ejs', { csrfToken : req.csrfToken()})
});

app.get('/multiple', (req, res) => {
    res.render('multiple.ejs', { csrfToken : req.csrfToken()})
})
app.post('/upload', (req, res)=> {
    console.log(req.body)
    upload.single('file')(req, res, (err) => {
        if(err){
          res.render('index', {csrfToken : req.csrfToken(),
        err : err })
        }else{
            console.log(req.body)
       res.redirect('/')
        }
    })
})
app.post('/multiple', (req, res) => {
   upload.array('file', 5)(req, res,(err) => {
       if(err){
           res.render('multiple', {csrfToken: req. csrfToken(),
        err: err })
       }else{
           res.redirect('/')
       }
   })
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server run at ${PORT}`)
})