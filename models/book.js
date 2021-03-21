const mongoose = require("mongoose")

// create a schema, a schema is essentially a table in sql databases
const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    publishDate:{
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt:{ // crea automaticamente la data
      type: Date,
      required: true,
      default: Date.now  
    },
    coverImage:{ // Immagazzina l'immagine come stringa, a parte fa l'upload
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {  //collegamento alla tabella Authors, una relazione
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    }
})

bookSchema.virtual("coverImagePath").get(function() {
    if(this.coverImage != null && this.coverImageType != null){
        return "data:" + this.coverImageType + ";charset=utf-8;base64,"+ this.coverImage.toString("base64")
    }
})

                // Author sarà quindi il nome del model e della tabella nel database
module.exports = mongoose.model("Book", bookSchema)
                    // authorSchema è il noe dello Schema che definisce la struttura dello schema

