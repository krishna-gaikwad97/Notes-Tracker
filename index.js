const express=require("express");
const app=express();
const port=3000;
const ejs=require("ejs");
const bodyParser=require("body-parser");
const path=require("path");
const { stat } = require("fs");
const {v4:uuidv4}=require("uuid");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);   
})

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));


let posts=[

   
    {id:uuidv4(),name:"Alice",content:"Dbms notes",notes:"A DBMS is software that helps store, organize, and manage data efficiently, providing an interface between users and databases."},
    {id:uuidv4(),name:"Krishna",content:"Networking",notes:"Computer Networking is the practice of connecting two or more computers to share resources like data, files, and internet access"},
    {id:uuidv4(),name:"Charlie",content:"web development",notes:"Web Development involves creating and maintaining websites or web applications using technologies like HTML, CSS, and JavaScript."},
]
;

app.get("/",(req,res)=>{
   res.send("hello");
});
app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
});
app.get("/posts/new",(req,res)=>{
   res.render("new.ejs");
});
app.get("/posts/:id",(req,res)=>{
   let{id}=req.params;
   const post=posts.find((p)=>id===p.id);
   res.render("show.ejs",{post});
});
app.post("/posts", (req, res) => {
  const { name, content, notes } = req.body;
  const id = uuidv4(); // ✅ generate a unique ID for each new post
  posts.push({ id, name, content, notes });
  res.redirect("/posts");
});
app.delete("/posts/:id/delete",(req,res)=>{
   let{id}=req.params;
  
   posts=posts.filter((p)=>p.id!==id);
   res.redirect("/posts");
});
app.patch("/posts/:id",(req,res)=>{
   let{id}=req.params;
   let newContent=req.body.notes;
   let post=posts.find((p)=>p.id===id);
   post.notes=newContent;
   console.log(post);    
   res.redirect("/posts");

}  );


app.get("/posts/:id/edit",(req,res)=>{
   let{id}=req.params;
   const post=posts.find((p)=>p.id===id);
   res.render("edit.ejs",{post});
});