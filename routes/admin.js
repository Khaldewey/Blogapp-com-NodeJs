const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get('/', (req, res) => {
  res.render("admin/index")
})

router.get('/posts', (req, res) => {
  res.send("Página de posts")
})

router.get('/categorias', (req, res) => {
  Categoria.find().sort({ date: 'desc' }).then((categorias) => {
    res.render("admin/categorias", { categorias: categorias.map(categorias => categorias.toJSON()) })
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as categorais")
    res.redirect("/admin")
  })
})

router.post("/categorias/nova", (req, res) => {

  var erros = []

  if (!req.body.nome && req.body.nome == undefined || req.body.nome == null || req.body.nome.length <= 2 || req.body.nome.length == 0) {
    erros.push({ texto: "Nome inválido" })
  }
  if (!req.body.slug && req.body.slug == undefined || req.body.slug == null || req.body.slug.length <= 2 || req.body.slug.length == 0) {
    erros.push({ texto: "Slug inválido" })
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros })
  }
  else {




    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    }

    new Categoria(novaCategoria).save().then(() => {
      req.flash("success_msg", "Categoria criada com sucesso")
      res.redirect("/admin/categorias")
      console.log("Categoria salva com sucesso")
    }).catch((err) => {
      req.flash("error_msg", "Erro ao salvar categoria, tente novamente mais tarde")
      console.log("Erro ao salvar categoria :" + err)
    })
  }
})


router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
    res.render("admin/editcategorias", { categoria: categoria })
  }).catch((err) => {
    req.flash("error_msg", "Esta categoria não existe")
    res.redirect("/admin/categorias")
  })

})

router.post("/categorias/deletar", (req, res) => {
  Categoria.remove({ _id: req.body.id }).then(() => {
    req.flash("success_msg", "Categoria deletada")
    res.redirect("/admin/categorias")
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao deletar a categoria")
    res.redirect("/admin/categorias")
  })
})
module.exports = router