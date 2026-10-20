require("dotenv").config();

const express = require("express");
const app = express();
const porta = process.env.PORT || 3000;

app.use(express.static("./app/public"));
app.set("view engine", "ejs");
app.set("views", "./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rota = require("./app/routes/router");
app.use("/", rota);

app.listen(porta, () => {
    console.log(`Servidor on-line: http://localhost:${porta}`);
});
