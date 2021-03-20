const express = require("express")
const router = express.Router()
const multer = require("multer") // richiamo il modulo multer per il file upload
const path = require("path")
const fs = require("fs")
const Book = require("../models/book")
const uploadPath = path.join("public", Book.coverImageBasePath) // upload path
const Author = require("../models/author")
const imageMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"]
const upload = multer({ // faccio il set di multer
    dest: uploadPath,
    fileFilter: (req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


// All Books Route

// GET - 
router.get("/", async (req, res) =>{
    let query = Book.find()
    if(req.query.title != null && req.query.title != ""){
        query = query.regex("title", new RegExp(req.query.title,  "i"))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != ""){
        query = query.lte("publishDate", req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != ""){
        query = query.gte("publishDate", req.query.publishedAfter)
    }
    try{
        const books = await query.exec()
        res.render("books/index", {
            books: books,
            searchOptions: req.query
        })
    }catch{
        res.redirect("/")
    }
    
})

// GET - New Book Route
router.get("/new", async (req, res)=>{
    renderNewPage(res, new Book())
})


// Create Book Route 
router.post("/", upload.single("cover"), async(req, res)=>{ //cover è il nome che abbiamo dato al file input nel  form
    const fileName = req.file != null ? req.file.filename : null // prendi il nome del file se il file esiste
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: parseInt(req.body.pageCount),
        coverImageName: fileName, 
        description: req.body.description
    })

    try{
        const newBook = await book.save()
        /* res.redirect("books/" + newBook.id) */
        res.redirect("books")
    }catch{
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

// funzione aggiunta per non creare un file se non si inseriesce il campo title nel form
function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err =>{
        if(err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = "Error creating book"
        res.render("books/new", params)
    }catch{
        res.redirect("/books")
    }
}

module.exports = router;