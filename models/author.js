const mongoose = require("mongoose")
const { stringify } = require("qs")

// create a schema, a schema is essentially a table in sql databases
const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})
                // Author sarà quindi il nome del model e della tabella nel database
module.exports = mongoose.model("Author", authorSchema)
                    // authorSchema è il noe dello Schema che definisce la struttura dello schema