const mongoose=require('mongoose')

 const db=mongoose.connect("mongodb+srv://Sudhanshu_09:5JQhJtJ5mUWQIBwo@cluster0.kt4fu.mongodb.net/googleApi",{
    useNewUrlParser: true})
.then(()=>console.log('mongoDb is connected'))
.catch((err)=>console.log(err))

module.exports=db