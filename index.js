const express = require('express')
const app = express()
const port = 3000
const {User} = require("./models/User");

const bodyParser = require('body-parser');

// application/x-www-form-urlencoded 된데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended:true}));  
// application/json 된데이터를 분석해서 가져옴
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://psh:psh1234@boilerplate.idmdn.mongodb.net/boilerplate?retryWrites=true&w=majority',{
  useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log('MongoDB Connected...')) 
.catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register',(req,res)=>{
  //회원가입할때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
  
  // {
  //   id:"hello",
  //   password:"123"

  // } 이런식으로 req.body에들어있음 bodyParser가 이걸 가능하게해줌

  
  const user = new User(req.body)

  user.save((err,userInfo) =>{
    if(err) return res.json({success:false,err})
    return res.status(200).json({
      success:true
    })
})


})

app.listen(port, () => {console.log(`Example app listening at http://localhost:${port}`)})