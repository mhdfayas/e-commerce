
var express = require('express');
const { log } = require('handlebars');
var router = express.Router();
const productHelper=require('../helpers/product-helpers')
const fs=require('fs')
const path = require('path');



router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((products)=>{

    res.render('./admin/view-products', {products,admin:true});
  })

  
});

router.get('/add-product',function(req,res){
  res.render("./admin/add-product",{admin:true})
})

router.post('/add-product',(req,res)=>{
 
  productHelper.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv("./public/product-images/"+id+".jpg",(err,done)=>{
      if(!err){
        res.render("./admin/add-product",{admin:true})
      }else{
        console.log(err)
      }
    })
  })
 
})

router.get('/remove-product/:id',(req,res)=>{
  let productId=req.params.id
  let imagePath=path.join(__dirname,"../public/product-images/"+productId+".jpg")
  

  productHelper.removeProduct(productId)
  .then((result)=>{

    fs.unlink(imagePath,(err)=>{
      if(err){
        console.error("Failed to delete image: ",err)
      }else{
        console.log("Image successfully deleted")
      }
    })
    res.redirect('/admin')

  })
  .catch((err)=>{
    console.error("Error removing product: ",err)
  })

})

router.get('/edit-product/:id',async (req,res)=>{

  product=await productHelper.getProducts(req.params.id)
  console.log(product)
  res.render('admin/edit-products', {product,admin:true});


})

router.post('/edit-products/:id',(req,res)=>{

  id=req.params.id
  
  productHelper.updateProduct(id,req.body)
  .then((response)=>{
    res.redirect('/admin')
  }) 
  if(req.files.Image){
    let image=req.files.Image
    image.mv("./public/product-images/"+id+".jpg")
  }
    

})
module.exports = router;