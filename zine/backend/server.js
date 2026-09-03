
import express, { json } from "express";
import cors from "cors";

const app = express()

const PORT = 3001;

app.use(cors)
app.use(json());

app.post("/api/auth/signup", (res,req)=>{
  console.log("Signing up")
    const {username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({
        success: false,
        message: "Username and password are required",
        });
    }

    res.status(201).json({
    success: true,
    message: "Account created successfully",
    user: {
      id: 1,
      username,
    },
  });
})


app.post("/api/auth/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  res.json({
    success: true,
    message: "Signed in successfully",
    user: {
      id: 1,
      username,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});