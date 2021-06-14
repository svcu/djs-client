const rp = require("request-promise");
const http = require("http");
let ls;
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    ls = new LocalStorage('./djs-info');
  }
//CLIENT

class DJS{
    

    constructor(genesisNode){
        this.genesisNode = genesisNode;
        this.data = [];
        this.nodes = [];
        this.tokens = [];
        this.backup = [];
    }

    isOnline(host){
        let online = false

        http.get({host: host, port:3000, path:"/"}, (res)=>{
            if(res.statusCode == 200 || res.statusCode){
                online = true
                console.log("ONLINE")
                return true
            }
        })

        console.log(online)
        return online
    }

    //Get Data
    get(label, tk){

        let env;

        if(ls.getItem(label)){ //First search data in ls (Offline first)
            return ls.getItem(label)
        }else{ //If there is not data with the label requested in ls request it from genesisNode and storeIt in ls
            
            if(this.isOnline(this.genesisNode)){
                const options = {
                    uri: this.genesisNode+"/data",
                    method: "get",
                    json: true,
                    body:{
                        token: tk,
                        label: label
                    }
                }
                console.log("OK")
                rp(options)
                .then(response => {
                    console.log(response);
                    ls.setItem(label, response);
                    this.data.push(response);
                    env = response
                    return response;
                })

                return env
            }else{
                this.nodes.forEach(node => {
                    if(this.isOnline(node+"/")){
                        const options = {
                            uri: node+"/data",
                            method: "get",
                            json: true,
                            body:{
                                "token": tk,
                                "label": label
                            }
                        }
                
                        rp(options)
                        .then(response => {
                            console.log(response);
                            ls.setItem(label, JSON.stringify(response));
                            this.data.push(response);
                            env = response
                            return response;
                        })

                        return env
                    }
                })
            }

          
        }
     
    }

    //Post Data
    set(data, tk){
        let  rt = "";
        let options;

        if(this.isOnline(this.genesisNode)){
            options = {
                uri: this.genesisNode+"/data",
                method: "post",
                json: true,
                body: {
                    "token" : tk,
                    "body" : data
                }
            }
        }else{
            this.nodes.forEach(node => {
                if(this.isOnline(this.node)){
                    options = {
                        uri: node+"/data",
                        method: "post",
                        json: true,
                        body: {
                            "token" : tk,
                            "body" : data
                        }
                    }
                }
            })
        }

      

        rp(options)
        .then(response=> {
            console.log(response);
            if(response == "OK"){
                ls.setItem(data.label, JSON.stringify(data)); //Save data in ls for offline use later
                this.data.push(data)
            }
           rt = response
        })

        return rt;
    }

    //Post node
    node(node){
        this.nodes.push(node)
        return "OK"

    }
    
    //Obtain backup nodes
    getBackups(tk){
        const options = {
            uri: this.genesisNode+"/backups",
            method: "get",
            json: true,
            body: {
                "token" : tk
            }
        }

        rp(options)
        .then(response => {
            console.log(response);
            if(response !== "INVALID TOKEN"){
                response.forEach(bc => {
                    this.nodes.push(bc)
                })

                return "OK";
            }else{
                return "INVALID TOKEN"
            }
        })
    } 

    //Register client
    async register(node){

        let token;

        const options = {
            uri: this.genesisNode+"/node",
            method: "post",
            json: true,
            body: {
                "node" : node
            }
        }

        await rp(options)
        .then(response => {
            console.log(response)
            token = response
        })

        this.getBackups(token);

        return token
    }
}


module.exports = DJS