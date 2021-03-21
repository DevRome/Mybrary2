const express = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
require("dotenv").config()
const PORT = process.env.PORT || 3000

// Set view engine e views directory
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout") // stesso concetto di partials, mettiamo header e footer
app.use(expressLayouts)

// Use method-override
app.use(methodOverride("_method"))

// Get the routes file
const indexRouter = require("./routes/index")
const authorRouter = require("./routes/authors")
const bookRouter = require("./routes/books")


// Set static files
app.use(express.static("public"))

//body parser
app.use(express.urlencoded({limit:"10mb", extended:false}))

// MongoDB
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection
db.on("error", error => console.error(error))
db.on("open", () => console.log("Connected to database!")) //once significa che verrà eseguito solo una volta

app.use("/", indexRouter)
app.use("/authors", authorRouter)
app.use("/books", bookRouter)


// Start server
app.listen(PORT, ()=>{
    console.log("Server running on port: ", PORT)
})