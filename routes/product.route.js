const express=require("express")
const {ProductModel}=require("../model/product.model")
const productRoute=express.Router()

productRoute.get("/",async(req,res)=>{
    const category=req.query.category;
    try{
        if(category!=undefined&&typeof(category)=="string"){
            const post=await ProductModel.find({category});
            res.send(post);
        }else if(category!=undefined&&category.length>0&&typeof(category)=="object"){
            let arr=[];
            for(let i=0;i<category.length;i++){
                const post1=await ProductModel.find({category:category[i]});
                arr.push(post1);
            }
            console.log(arr.length)
            res.send(arr);
        }else{
            const post=await ProductModel.find();
            res.send(post);

        }
    }catch(err){
        res.send("Something Went Wrong");
        console.log(err);

    }
})
productRoute.get("/search/:key", async (req, res) => {
    
    console.log(req.params.key)
    try {
        let data=await ProductModel.find({
            "$or":[
                {title:{$regex:req.params.key}},
                {brand:{$regex:req.params.key}},
                {category:{$regex:req.params.key}}
            ]
          })
          res.send(data)
          
        
        
    } catch (error) {
        console.log(error)
    }
})
    
  
productRoute.post("/addproduct",async(req,res)=>{
    let payload=req.body
    console.log(payload)
    try {
        let addproduct=new ProductModel(payload)
        await addproduct.save()
        console.log(addproduct)
        res.send("Product added to database")
    } catch (error) {
        console.log(error)
        res.send("Something went wrong")
    }
})
productRoute.patch("/update/:id",async(req,res)=>{
    let payload=req.body
    let id=req.params.id
    try {
        await ProductModel.findByIdAndUpdate({_id:id},payload)
        res.send(`id number ${id} is updated`)
    } catch (error) {
        console.log(error)
        res.send("Something went wrong")
    }
})
productRoute.delete("/delete/:id",async(req,res)=>{
    let id=req.params.id
    try {
        await ProductModel.findByIdAndDelete({_id:id})
        res.send(`id number ${id} is deleted`)
    } catch (error) {
        console.log(error)
        res.send("Something went wrong")
    }
})

module.exports={
    productRoute
}
