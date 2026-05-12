const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")

const app = express()
app.use(cors())
app.use(express.json())

const path = require("path")
app.use(express.static(path.join(__dirname,'../frontend/build')))

mongoose.connect("mongodb+srv://deena:Deena@15@cluster0.sld3sxw.mongodb.net/passeskey?appName=Cluster0").then(function () { console.log("DB connected successfully") })
    .catch(function () { console.log("DB connection Failed") })

const login = mongoose.model("login", {}, "bullkmail")

app.post("/sendmail", function (req, res) {
    
    var msg = req.body.msg
    var emaillList = req.body.emailList

    login.find().then(function (data) {
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
                
            },
        });
        new Promise(async function (res, rej) {
            try {
                for (var i = 0; i < emaillList.length; i++) {
                    await transporter.sendMail(
                        {
                            from: "deenadayalandd15@gmail.com",
                            to: emaillList[i],
                            subject: "A message from mail app",
                            Text: (msg) 
                        },
                    
                    )
                    console.log("Email sent to:" + emaillList[i])
                }
                res("success")
            }
            catch (error) {
                rej("Failed")
            }

        }).then(function () { res.send(true) })
            .catch(function () { res.send(false) })

    })
    .catch(function (error) { console.log(error) })

})

app.use((req, res) =>{
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'))
})

app.listen("5000", function (req, res) {
    console.log("server started...")
})