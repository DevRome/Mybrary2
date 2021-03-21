const express = require("express")
const router = express.Router()
const Author = require("../models/author")
const Book = require("../models/book")

// All Authors Route



// ---------------- GET - pagina principle con riepilogo autori e funzione ricerca (li mette tutti e due)
router.get("/", async (req, res) =>{
    //funzione ricerca
    let searchOptions = {};
    if(req.query.name != null && req.query.name !== ""){ // search utilizza get dal form, quindi il dato è memorizzato in req.query
        searchOptions.name = new RegExp(req.query.name, "i") 
    }

    // recupera tutti i record dal database
    try{
        const authors = await Author.find(searchOptions) // nell'oggetto all'intenro delle parentesi si specificano le condizioni di ricerca che vogliamo, in questo caso nessuna, vogliamo tutti i risultati
        res.render("authors/index", {
            authors: authors, 
            searchOptions: req.query
        })
    }catch{
        res.redirect("/")
    }
})

// GET - New Author Route
router.get("/new", (req, res)=>{
    res.render("authors/new", {author: new Author()})
})

//POST - Create Author Route

// CREATA CON LE CALLBACKS - FUNZIONANTE!
/* router.post("/", (req, res)=>{
    const author = new Author({
        name: req.body.name
    })
    author.save((err, newAuthor)=>{ //crea la callback
        if(err){  //se c'è un errore
            res.render("authors/new", {
                author: author,
                errorMessage: "Error creating Author"
            })
        }else{ // se non c'è nessun errore
            res.redirect("authors")
        }
    })
}) */

// CON ASYNC AWAIT 
router.post("/", async(req, res)=>{
    const author = new Author({
        name: req.body.name
    })
    try{
        const newAuthor = await author.save()
        res.redirect("authors/"+ newAuthor.id)
    } catch{ // catch prende tutti gli errori che si verificano nel try block
        res.render("authors/new", {
            author: author,
            errorMessage: "Error creating Author"
        })
    }
})

router.get("/:id", async(req, res) =>{
    try{
        const author = await Author.findById(req.params.id)
        const book = await Book.find({ author: author.id}).limit(6).exec()
        res.render("authors/show", {
            author: author,
            booksByAuthor: book
        })
    }catch (err){
        console.log(err)
        res.redirect("/")
    }
})

router.get("/:id/edit", async (req, res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render("authors/edit", {author: author})
    }catch{
        res.redirect("/authors")
    }
})

// Update Author
router.put("/:id", async(req, res) => {
    let author // la inizializzo al di fuori di try catch
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect("/authors/"+ author.id)
    } catch{ // catch prende tutti gli errori che si verificano nel try block
        if(author == null){
            res.redirect("/")
        }else{
            res.render("authors/edit", {
                author: author,
                errorMessage: "Error updating Author"
            })
        }
    }
})

// Delete Author
router.delete("/:id", async(req, res)=>{
    let author // la inizializzo al di fuori di try catch
    try{
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect("/authors")
    } catch{ // catch prende tutti gli errori che si verificano nel try block
        if(author == null){
            res.redirect("/")
        }else{
            res.redirect("/authors/"+ author.id)
        }
    }

})

module.exports = router;