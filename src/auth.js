const jwt=require("jsonwebtoken");
module.exports=async(req,res,next)=>{
    try{
        const token=await req.headers.authorization.split(" ")[1];
        const decoded=jwt.verify(token,"secret");
        const user = await decoded;
        req.user=user;
        next();
    }catch(error){
        res.status(401).json({error: new Error("Invalid request!"),
        });
    }
}