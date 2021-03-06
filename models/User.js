const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds =10
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true, //스페이스를 없애줌
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname: {
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String

    },
    tokenExp:{
        type:Number
    }
})

userSchema.pre('save',function(next){
    var user = this;
    //비밀번호를 암호화 시킨다.
    if(user.isModified('password')){

        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password,salt,function(err,hash){
    
                if(err) return next(err)
                    user.password = hash
                    next()
            })
        })

    }else{
        next()
    }

})

userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainPassword 1234567 암호화된 비밀번호 ~~
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err),
        cb(null,isMatch)
    })
}
 

userSchema.methods.generateToken = function(cb){
    var user = this;
//제이슨 웹토큰을 이용해서 토큰 생성하기 
var token = jwt.sign(user._id.toHexString(),'secretToken')
// user._id + 'secretToken' = token
// ->
// 'secretToken' -> user._id
    //console.log(user)
user.token = token
user.save(function(err,user){
    if(err) return cb(err)
    cb(null,user)
})

}

const User = mongoose.model('User',userSchema)
module.exports ={User} //다른곳에서도 이 모델을 쓸수있게
//module.exports =  mongoose.model('User', userSchema)