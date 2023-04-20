require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json({ limit: "20mb", extended: true }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

//Import Routers
const productsRoute = require("./routes/product");

app.use("/products", productsRoute);

app.get("/", (req, res) => {
  res.send("Server is running on localhost 4500");
});

const CONNECTION_URL =
  "mongodb+srv://Kune:Kune@cluster0.ozbws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 4500;

//Connect to DB
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`))
  )
  .catch((error) => console.log(error.message));

//http://localhost:4500/
