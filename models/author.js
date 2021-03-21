const mongoose = require("mongoose")
const Book = require("./book")

// create a schema, a schema is essentially a table in sql databases
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

// Per impedire di elìiminare un autore al quale sia associato un libro nel database (altrimenti il libro rimarrebbe senza autore)
authorSchema.pre("remove", function(next){
    Book.find({ author: this.id }, (err, books)=>{
        if(err){
            next(err)
        }else if (books.length > 0){
            next(new Error("This author has books still"))
        }else{
            next()
        }
    })
})

                // Author sarà quindi il nome del model e della tabella nel database
module.exports = mongoose.model("Author", authorSchema)
                    // authorSchema è il noe dello Schema che definisce la struttura dello schema