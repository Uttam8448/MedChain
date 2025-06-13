const express = require("express");
const app = express();

const cors = require("cors");


const database = require("./config/database");
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;
database.connect();

const userRoutes = require("./routes/User");
const ehrRoutes = require("./routes/EHR");

app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST"],
}));
app.use(cors());

app.use(express.json());
app.use(cookieParser());


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/ehr",ehrRoutes);

app.get("/",(req,res) => {
    return res.json({
        success:true,
        message:"Your Server is up & running",
    })
})