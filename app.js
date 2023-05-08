const express = require("express");
const request = require("request")
const bodyParser = require("body-parser");
const https = require("https")

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"))

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    let data = {
        members : [
            {
            email_address : email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }
    ]
};
    
    const jsonData = JSON.stringify(data);

    let url = "https://us8.api.mailchimp.com/3.0/lists/0d787ab5f7"

    const options = {
        method: "POST",
        auth: "ollan1:e516f9588cd12c9e29df94220ddb2371-us8"
    }

    const request = https.request(url, options, (response)=>{
        response.on("data", (data)=>{
            console.log(JSON.parse(data))

            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html") 
            } else {
                res.sendFile(__dirname + "/failure.html")
            };
        });
    });
    request.write(jsonData);
    request.end();
})

// Failure
app.post("/failure", (req, res)=>{
res.redirect("/");
});





app.listen(process.env.PORT || 8000, ()=>{
    console.log("It is working on Port 8000");
});

