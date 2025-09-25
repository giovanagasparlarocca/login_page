const express = require("express")
const fs = require("fs");
const { request } = require("http");
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors");

const app= express();
const port = 5001;
app.use(cors());
app.use(express.json());

app.listen(port, ()=>{
    console.log(`servidor rodando http://localhost:${port}`)
})