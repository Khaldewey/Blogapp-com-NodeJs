const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require('../models/Postagem')
const Postagem = mongoose.model("postagens")

router.get('/', (req, res) => {
  res.render("admin/index")
})

router.get('/posts', (req, res) => {
  res.send("Página de posts")
})

router.get('/categorias/add', (req, res) => {
  res.render('admin/addcategorias')
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
router.get("/postagens", (req, res) => {
  Postagem.find().lean().populate({ path: 'categoria', strictPopulate: false }).sort({ data: "desc" }).then((postagens => {
    res.render("admin/postagens", { postagens: postagens })
  })).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as postagens erro : " + err)
    res.redirect("/admin")
  })

})

router.get("/postagens/add", (req, res) => {
  Categoria.find().lean().then((categorias) => {
    res.render("admin/addpostagem", { categorias: categorias })
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro " + err)
    res.redirect("/admin")
  })

})

router.post("/postagens/nova", (req, res) => {
  var erros = []
  if (req.body.categoria == "0") {
    erros.push({ texto: "Categoria inválida, registre uma categoria" })
  }


  if (erros.lenght > 0) {
    res.render("admin/addpostagem", { erros: erros })
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug
    }
    new Postagem(novaPostagem).save().then(() => {
      req.flash("success_msg", "Postagem criada com sucesso")
      res.redirect("/admin/postagens")
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro " + err)
      res.redirect("/admin/postagens")
    })
  }

})


router.get("/postagens/edit/:id", (req, res) => {
  Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {
    Categoria.find().lean().then((categorias) => {
      res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
    }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar categorias")
      res.redirect("/admin/postagens")
    })

  }).catch((err) => {
    req.flash("error_msg", "Erro : " + err)
    res.redirect("/admin/postagens")
  })


})

router.post("/postagem/edit", (req, res) => {
  Postagem.findOne({ _id: req.body.id }).then((postagem) => {
    postagem.titulo = req.body.titulo
    postagem.slug = req.body.slug
    postagem.descricao = req.body.descricao
    postagem.conteudo = req.body.conteudo
    postagem.categoria = req.body.categoria

    postagem.save().then(() => {
      req.flash("success_msg", "Postagem editada com sucesso")
      res.redirect("/admin/postagens")
    }).catch((err) => {
      console.log(err)
      req.flash("error_msg", "Erro ao editar")
      res.redirect("/admin/postagens")
    })
  }).catch((err) => {
    console.log(err)
    req.flash("error_msg", "Houve um erro ao salvar edição " + err)
    res.redirect("/admin/postagens")
  })
})


module.exports = router