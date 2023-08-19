var express = require('express');
const bodyparser = require('body-parser')
var app = express();
const mongoose = require('mongoose');

main();

async function main() {
  await mongoose.connect('mongodb+srv://siddharth:test123@cluster0.vnuefms.mongodb.net/blogDB');
}

const blogSchema = new mongoose.Schema({
  title:String,
  description:String
});

const Blog = new mongoose.model("Blog",blogSchema)

app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));

app.get('/',(req, res)=>{
  Blog.find({}).then((blogList)=>{
    res.render('pages/home',{
      blogs : blogList
    }); 
  });
});

app.get('/compose',(req, res)=>{
  res.render('pages/compose');
});

app.post('/compose',(req,res)=>{
  const blog = new Blog({
    title : req.body.title,
    description : req.body.description
  });

  blog.save();
  res.redirect("/")
});

app.post('/',(req,res)=>{
  Blog.deleteOne({_id:req.body.id})
  .then(()=>{
    res.redirect('/')
  });
});

app.get('/posts/:postTitle',(req,res)=>{
  Blog.find({_id:req.params.postTitle})
  .then((foundItem)=>{
    res.render('pages/post',{
      title:foundItem[0].title,
      description:foundItem[0].description
    })
  })
})

app.listen(3000,()=>{
    console.log('Server is listening on port 3000');
})