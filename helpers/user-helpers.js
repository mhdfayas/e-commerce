let db = require("../config/connection");
let collection = require("../config/collection");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      

      bcrypt.hash(userData.password, 10)
      .then((encryptedPassword) => {
        userData.password = encryptedPassword;
        db.get().collection(collection.USER_COLLECTION).insertOne(userData)
        .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log("Error inserting data: ", err);
          });
      });
    });
  },

  doLogin:(userData)=>{
    return new Promise(async (resolve,reject)=>{
        
        let response={}
        let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
        
        if(user){
            bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                    response.user=user
                    response.status=true
                    resolve(response)
                    console.log("login success")
                }else{
                    console.log("login failed")
                    response.status=false
                    resolve(response)
                }
            })
        }else{
            response.status=false
            resolve(response)
            console.log("login failed")
            
        }
    
    })
  },
  addToCart:(productId,userId)=>{
    let productObj={
      item: new ObjectId(productId),
      quantity:1
    }
    return new Promise(async(resolve,reject)=>{
      let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user: new ObjectId(userId)})
      if(userCart){

        productExist=userCart.products.findIndex(product=>product.item==productId)
        
        if(productExist!==-1){
          db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':new ObjectId(productId)},
          {
            $inc:{'products.$.quantity':1}
          })
          .then((response)=>{
            resolve()
          })
        }else{
            db.get().collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userId)},
            {
              $push:{products:productObj}
            })
          .then((response)=>{
            resolve()
          })
        }
      }else{
        let cartObj={
          user:new ObjectId(userId),
          products:[productObj]
        }
        db.get().collection(collection.CART_COLLECTION).insertOne(cartObj)
        .then((response)=>{
          resolve()
        })
      }
    })
  },
  getCartProducts:(userId)=>{
    return new Promise(async(resolve,rejevct)=>{
      let cartItems=await db.get().collection (collection.CART_COLLECTION).aggregate([
        {
          $match: {user: new ObjectId(userId)}
        },
        {
          $lookup:{
            from:collection.PRODUCT_COLLECTION,
            let:{prodList:'$products'},
            pipeline:[
              {
                $match:{
                  $expr:{
                    $in:['$_id','$$prodList']
                  }
                }
              }
            ],
            as:'cartItems'
          }
        }
        ]).toArray()
        resolve(cartItems[0].cartItems)

    })
  },
  getCartCount:(userId)=>{
    return new Promise(async(resolve,reject)=>{
      let count=null
      let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user: new ObjectId(userId)})
      if(cart){
        count=cart.products.length
      }
      resolve(count)
      
    })
  }
};
