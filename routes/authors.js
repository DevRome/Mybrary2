const express = require("express")
const router = express.Router()
const Author = require("../models/author")

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
        /* res.redirect("authors/"+ newAuthor.id) */
        res.redirect("authors")
    } catch{ // catch prende tutti gli errori che si verificano nel try block
        res.render("authors/new", {
            author: author,
            errorMessage: "Error creating Author"
        })
    }
})

module.exports = router;