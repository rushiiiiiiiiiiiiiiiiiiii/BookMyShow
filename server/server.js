const express = require("express");
const cors = require("cors");
const Conn = require("./Connection/Conn");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const Authrouter = require("./Routes/UserRoutes");
const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin:[
       "http://localhost:5173",
       "https://book-my-show-frontend-ashen.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

Conn();
app.get("/", (req, res) => {
  res.send("Working Fine");
});
app.use("/api", require("./Routes/theatreRoutes"));
app.use("/auth", Authrouter);
app.use("/api/seller", require("./Routes/SellerRoutes"));
app.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT ${process.env.PORT}`);
});
