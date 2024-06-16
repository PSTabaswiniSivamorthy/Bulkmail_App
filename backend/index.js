const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://thara1:12344321@cluster0.mjk3i1x.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(function () {
    console.log("Connected to DB");
  })
  .catch(function (error) {
    console.log("Failed to connect to DB", error);
  });

const credential = mongoose.model("credential", {}, "bulkmail");

app.post("/sendemail", async function (req, res) {
  const msg = req.body.msg;
  const emailList = req.body.emailList;

  if (!emailList || emailList.length === 0) {
    return res.status(400).send("No email addresses provided");
  }

  try {
    const data = await credential.find();
    if (data.length === 0) {
      return res.status(500).send("No email credentials found");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    for (let i = 0; i < emailList.length; i++) {
      await transporter.sendMail({
        from: "bulkmailsendto@gmail.com",
        to: emailList[i],
        subject: "Test Mail",
        text: msg,
      });
      console.log("Email sent successfully to " + emailList[i]);
    }
    res.send(true);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to send emails");
  }
});

app.listen(5000, function () {
  console.log("Server started on port 5000");
});
