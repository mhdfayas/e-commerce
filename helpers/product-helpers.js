let db = require("../config/connection");
let collection = require("../config/collection");
const { ObjectId } = require("mongodb");

module.exports = {
  addProduct: (product, callback) => {
    db.get().collection("product").insertOne(product).then((data) => {
        callback(data.insertedId);
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
      resolve(products);
    });
  },
  getProducts: (productId) => {
    return new Promise((resolve, reject) => {
     db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: new ObjectId(productId)})
     .then((result)=>{
      resolve(result)
     })

    });
  },
  removeProduct: (productId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new ObjectId(productId)})
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            });
    });
  },
  updateProduct:(productId,productDetails)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION)
      .updateOne({_id: new ObjectId(productId)},{
        $set:{
          Name:productDetails.Name,
          Category:productDetails.Category,
          Price:productDetails.Price,
          Description:productDetails.Description
        }
      })
    .then((response)=>{
      resolve(response)
    })
    .catch((err)=>{
      reject(err)
    })

    })
  }
  

    
};
