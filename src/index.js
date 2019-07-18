import mongoose from "mongoose";
import service from "./service/service"

var express = require('express')
var app = express()

mongoose
  .connect("mongodb://localhost:27017/tesovoe_zadanie", {
    useNewUrlParser: true
  })
  .catch(console.error);

app.get('/service', async function (req, res) {
    let x = await service.checkLimited()
    service.getAllUsers(x)
})

app.listen(3000)