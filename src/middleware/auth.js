import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "❌ No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
    if (!decoded   ) {
      return res.status(403).json({ message: "❌ Unauthorized: Admin access required" });
    }

    req.user = decoded;  
    next();
  } catch (error) {
    res.status(401).json({ message: "❌ Invalid token" });
  }
}

 
export default authMiddleware;