# DSC-BACKUP

DSC-BACKUP is a decentralized backup library. DSC-BACKUP connects to a server running DSC-BACKUP-GENESIS, this server is called genesis node, when you publish data in your application, it is storing the data in localStorage, sending the data to genesis node and genesis node it is sending the data to the backup nodes. When it looks for data, it looks first in the localStorage, and if that data does not exist in the localStorage, it looks at the genesis node or the backup nodes. With DSC-BACKUP you save your data preventing it from being lost


# Initializing dsc-backup

``` js
const dsc = require("dsc-backup");
const DSC = new dsc("YOUR GENESIS NODE ADDRESS");

DSC.register("YOUR IP ADDRESS") //It will return an access token
```

# Posting Data

You must provide a secret key, with that, dsc-backup will encrypt your data 
(DO NOT PROVIDE YOUR TOKEN AS SECRET KEY)
    
```js

const accessToken = "YOUR ACCESS TOKEN"
const secret = "YOUR APP SECRET KEY"

const data = {
    "label" : "THE LABEL OF YOUR DATA (DATA NAME TO SEARCH IT LATER)",
    "access" : "open OR closed" //Open: everyone can access, Closed: only apps with your token can access,
    "type" : "CATEGORY OF THE DATA",
    "data" : { //Data goes here
        "name" : "John",
        "age" : "33",
        "token" : "THIS IS ONLY DATA FOR YOU TO FILTER IN THE ARRAY, CAN BE TOKEN OR CREATOR OR APP OR WHAT DO YOU WANT"
    }
}

DSC.set(data, accessToken, secret)
.then(response=>{
    "DO WHAT YOU WANT"
})
```

# Getting Data
### This will return an array of JSON objects with the label you requested
### Get Data

```js
DSC.get("LABEL", "ACCESS TOKEN", "SECRET KEY")
.then(response => {
    "DATA REQUESTED"
})
```

# Example
# Post
```js
const accessToken = "YOUR ACCESS TOKEN"
const secret = "YOUR SECRET KEY"

const data = {
    "label" : "Jhon",
    "access" : "closed" 
    "type" : "user",
    "data" : { 
        "name" : "John",
        "age" : "33",
        "token" : "33fg78"
    }
}

DSC.set(data, accesToken, secret)
.then(response => {
    res.send(response)
})
```

# Get
```js
const accessToken = "YOUR ACCESS TOKEN"
const secret = "YOUR SECRET KEY"

DSC.get("Jhon", accesToken, secret)
.then(response => {
    res.send(response)
})
```

## Response
```json
//Decrypted response

[
    {
         "name" : "John",
         "age" : "33",
         "token" : "33fg78"
    },
     {
         "name" : "John",
         "age" : "35",
         "token" : "6x7788"
    }
]
```

# Learn how to create genesis node

## DSC-BACKUP-GENESIS Github page

https://github.com/svcu/dsc-backup-genesis

## DSC-BACKUP Github page
https://github.com/svcu/dsc-backup



