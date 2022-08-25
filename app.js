// Carregando Módulos
const express = require("express")
const app = express()
const handlebars = require('express-handlebars')
const mongoose = require("mongoose")
const admin = require("./routes/admin")
const path = require('path')
const session = require("express-session")
const flash = require("connect-flash")


//Configurações 
//Sessão 
app.use(session({
  secret: 'cursodenode',
  resave: true,
  saveUninitialized: true
}))
app.use(flash())

// Middlewares
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  next()
})

//Handlebars

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//bodyParse
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blogapp', {

  useNewUrlParser: true
})
  .then(() => { console.log("Mongobd Conectado..."); })
  .catch((error) => {
    console.log("Houve um erro: " + error);
  })

//Public Arquivos estáticos (Bootstrap)
app.use(express.static(path.join(__dirname, 'public')))



//Rotas 
app.use('/admin', admin)

//Outros 
// Express
app.listen(8089, () => {
  console.log("Servidor Ativo : localhost:8089")
})
