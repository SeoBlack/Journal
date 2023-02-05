//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _  =  require("lodash");
const mongoose = require("mongoose");
const { result } = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', true);
//db

mongoose.connect("mongodb://127.0.0.1:27017/blog");


const resultchema = new mongoose.Schema({
  contentHead:{
    type:String,
    required:true
  },
  contentBody:String
})

const Post = new mongoose.model("Post",resultchema);






//get requests 
app.get("/", (req,res) =>{
  console.log("Got a New GET Request on 3000 /");
  Post.find({},(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render("home",{content:homeStartingContent,posts:result}) 
    }
  })
  ;
})
app.get("/about",(req,res)=>{
  console.log("Got a New GET Request on 3000  /about");
  res.render("about",{content:aboutContent});
})
app.get("/contact",(req,res)=>{
  console.log("Got a New GET Request on 3000  /contact");
  res.render("contact",{content:contactContent});
})
app.get("/compose",(req,res)=>{
  console.log("Got a New GET Request on 3000  /compose");
  res.render("compose")
})
app.get("/posts/:postId",(req,res) => {
  const requestedPostId = req.params.postId;
  Post.findById(requestedPostId,(err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render("post",{post:result});
      return
    }
  })
})



//post requests
app.post("/compose",(req,res) => {
  console.log("Got a New POST Request on 3000  /compose");
  const newPost = new Post ({
    contentHead: req.body.contentHead,
    contentBody: req.body.contentBody
  });
  if(!newPost.contentHead || !newPost.contentBody ){
    const error = "Could not create your post, enter a valid information";
    res.render("error",{err:error});
  }

  else{
    Post.find({},(err,result) => {
      if(err){
        console.log(err);
      }
      else{
        if(result.length < 1){
          
          newPost.save();
          res.redirect("/")
        }
        else{

          for(let i = 0 ; i < result.length ; i++ ){
            if(result[i].contentHead === newPost.contentHead){
              const error = "Could not create your post, a post with the same title already exsists!";
              res.render("error",{err:error});
              return;
            }
          }
          //this code was replaced with the above code because the foreach loop does not have a break statement.
          // result.every((post) => {
          //   if(post.contentHead === newPost.contentHead){
          //     res.send("Could not create your post, a post with the same title already exsists!")
          //     return false;
          //   }
          // })           
          newPost.save()
          res.redirect("/")  
        }
        
    }
  })


  };
  
  

})











app.listen(3000, function() {
  console.log("Server started on port 3000");
  
});
