const express=require("express");
const app=express();
const sql = require("mssql");
const auth= require("./auth");
var config = {
    "user": "kapil_iex",
    "password": "Jack@002",
    "server": "192.168.181.176",
    "database": "IEXPIPODataCenter",
    "options": {"encrypt": false}
}

const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require("./db/userModel");

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.use(express.json());

app.post("/register",(request,response)=>{
  const username=request.body.username;
  const firstName=request.body.firstName;
  const lastName=request.body.lastName;
  bcrypt.hash(request.body.password,10)
  .then(async(hashedPassword)=>{
    try{
      await sql.connect(config);
      const request=new sql.Request();
      await request.query('INSERT INTO PIPOusers values (\''+username+'\',\''+hashedPassword+'\',\''+firstName+'\',\''+lastName+'\',\'newbie\')');        
      response.status(200).send({message: "User registered successfully"});
    }catch (err){
        console.error('SQL error', err);
        response.status(500).send('Internal Server Error');
    }finally{sql.close();}
  })
  .catch((e)=>{
    response.status(500).send({message: "Password was not hashed successfully",e,});
  });
});

app.post("/login",async(request,response)=>{
  const username=request.body.username;
  const password=request.body.password;
  try{
    await sql.connect(config);
    const request=new sql.Request();
    const result=await request.query('SELECT * FROM PIPOusers WHERE username=\''+username+'\'');
    if(result.recordset.length===0){ response.status(401).send({message: "Invalid username or password"});
    }else{
      const user=result.recordset[0];
      bcrypt.compare(password,user.password.trim())
      .then((match)=>{
        if(!match){ 
          response.status(401).send({message: "Invalid username or password"});
        }else{
          const accessToken=jwt.sign({username: user.username,role: user.role},"secret");
          response.status(200).send({
            message:"Login Successful",
            username: user.username.trim(),
            accessToken,
          });
        }
      })
      .catch((e)=>{
        response.status(500).send({message: "Password was not hashed successfully",e,});
       });
    }
  }catch (err){
    console.error('SQL error', err);
    response.status(500).send('Internal Server Error');
  }finally{sql.close();}
})

app.get("/free-endpoint",(request,response)=>{
  response.json({message:"Free endpoint"});
})

app.get("/auth-endpoint",auth,(request,response)=>{
  response.json({message:"Auth endpoint"});
})

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
