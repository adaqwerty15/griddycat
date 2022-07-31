const { Application } = require("@nativescript/core");
const appSettings = require("application-settings");

let domain = "https://gc.teacode.com";

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
let username = appSettings.getString("username")
let token    = appSettings.getString("token")
let hash    = appSettings.getString("token")

console.log(username)
console.log(token)

if (username!=undefined && username!="" && token!="")

fetch(domain+"/jsonapi/v7/signin2?login="+username+"&hash="+hash+"&token="+token)
   .then((response) => response.text())
   .then((data1) => {
       let info1 = JSON.parse(data1);
       console.log(info1)
       if(info1.msg != 'ok'){
          fetch(domain+"/jsonapi/v7/signin1?login="+this.username)
                    .then((response) => response.text())
                    .then((data) => {

                        let info = JSON.parse(data);
                        
                        if(!info.msg) {
                            
                            let salt1 = info.salt1;
                            let salt2 = info.salt2;
                            let str = salt1 + this.password;
                            let interim_hash = sha512(str);
                            str = salt2 + interim_hash;
                            let hash = sha512(str);
                            let token = info.token;
                        
                            console.log("Start second query")
                            
                            fetch(domain+"/jsonapi/v7/signin2?login="+this.username+"&hash="+hash+"&token="+token)
                                .then((response) => response.text())
                                .then((data1) => {
                                    
                                    let info1 = JSON.parse(data1);
                                    if(info1.msg === 'ok'){

                                        appSettings.setString("username", this.username)
                                        
                                        appSettings.setString("password", this.password)

                                        appSettings.setString("token", token);

                                        appSettings.setString("hash", hash);

                                        fetch(domain+"/jsonapi/v7/userisdirectorbr?token="+token)
                                            .then((response) => response.text())
                                                .then((data) => {
                                                    let msg = JSON.parse(data).msg
                                                    appSettings.setString("isDirector", String(msg));                                                                        
                                                }).catch((e) => {
                                                    console.log("Error2 " + e)
                                                });       

                                        
                                    }                                    
                                                                        
                                }).catch((e) => {
                                    console.log("Error2 " + e)
                            });
                        }
                        
                    }).catch((e) => {
                        console.log("Error1 " + e)
                        });
                }
              }).catch((e) => {
                   console.log("Error2 " + e)
            });



if (username!="" && username!=undefined && token!="")
	Application.run({ moduleName: "app-root/app-root"}); 	
else
	Application.run({ moduleName: "base/base-page"});
    