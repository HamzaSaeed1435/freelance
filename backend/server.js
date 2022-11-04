const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");

connectDB();

const app = express();

const port = process.env.PORT || 5000;
/* app.use(cors); */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use("/api/client", require("./routes/clientRoutes"));
app.use("/api/freelancer", require("./routes/freelancerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/job", require("./routes/jobRoutes"));

app.get('/',(req,res)=>{
    res.send('hello hamza')
})
