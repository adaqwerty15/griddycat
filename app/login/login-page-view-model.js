const frame = require("@nativescript/core").Frame;

var sha512 = require('js-sha512');
const observableModule = require("tns-core-modules/data/observable");
var frameModule = require("tns-core-modules/ui/frame");
const appSettings = require("application-settings");
var FeedbackPlugin = require("nativescript-feedback");


let domain = "https://gc.teacode.com";


function LoginViewModel() {
    var feedback = new FeedbackPlugin.Feedback();

    appSettings.setString("username", "");
    appSettings.setString("token", "");
    appSettings.setString("hash", "");

    const viewModel = observableModule.fromObject({

        username: "",
        password: "",
        processing: false,

        submit(args) {

            if (this.username.trim() === "" || this.password.trim() === "") {
                feedback.error({
                    title: "Ошибка!",
                    message: "Логин или(и) пароль не был введен!"
                  });
                return;
            }

            else
            {

                this.set("processing", true);
                
                console.log("Start first query")  
                console.log(domain+"/jsonapi/v7/signin1?login="+this.username)

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
                            console.log(token)
                   
                            console.log("Start second query")
                            
                            fetch(domain+"/jsonapi/v7/signin2?login="+this.username+"&hash="+hash+"&token="+token)
                                .then((response) => response.text())
                                .then((data1) => {
                                    console.log(data1)
                                    let info1 = JSON.parse(data1);
                                    if (info1.msg === 'ok') {

                                        appSettings.setString("username", this.username)
                                        appSettings.setString("token", token);
                                        appSettings.setString("hash", hash);      

                                        console.log("https://gc.teacode.com/jsonapi/v7/userrole?token="+token)

                                        fetch(domain+"/jsonapi/v7/userrole?token="+token)
                                            .then((response) => response.text())
                                                .then((data) => {
                                                    
                                                    if (data!="")  {
                                                        let msg = JSON.parse(data)
                                                        if (msg.title.toString()=="director_br")
                                                        appSettings.setString("isDirector", "isdirectorbr");                                                                        
                                                        appSettings.setString("mId", msg.settings[0].branchId.toString());
                                                    }

                                                    const button = args.object;
   												    const page = button.page;

   												    let featuredFrame = frame.getFrameById("base");

   												    if (featuredFrame==undefined) {
   												    	featuredFrame = page.frame
   												    }
                                                      
                                                    featuredFrame.navigate({
                                                        moduleName: 'app-root/app-root',
                                                        transition: {
                                                            name: "fade"
                                                        },
                                                        context:{
                                                            token: token,
                                                            username: this.username,
                                                            password: this.password
                                                        },
                                                        backstackVisible: false,    
                                                        clearHistory: true    
                                                    }); 

                                                    this.set("processing", false) 
                                                                                                                           
                                                })
                                                .catch((e) => {
                                                    console.log("Error2 rr" + e)
                                        		}); 
                                                        
                                    } 
                                    else {
                                        this.set("processing", false)
                                        feedback.error({
                                            title: "Ошибка!",
                                            message: "Неверный логин или(и) пароль!"
                                          });
                                        console.log("m1")
                                    }    
                                })
                                .catch((e) => {
                                    this.set("processing", false);
                                    console.log("Error2 " + e)
                                });
                        }
                        else{
                            this.set("processing", false);
                            feedback.error({
                                title: "Ошибка!",
                                message: "Неверный логин или(и) пароль!"
                              });
                            console.log("m2")
                        }
                        
                    }).catch((e) => {
                        this.set("processing", false);
                        console.log("Error1 " + e)
                        feedback.error({
                                title: "Ошибка!",
                                message: "Нет подключения к серверу. Проверьте соединение с интернетом или обратитесь в службу поддержки."
                        });
                });
            }
            
        },

        demo(args) {
            appSettings.setString("username", "test")

            let featuredFrame = frame.getFrameById("base");

            const button = args.object;
            const page = button.page;

            if (featuredFrame==undefined) {
                featuredFrame = page.frame
            }

            featuredFrame.navigate({
              moduleName: 'app-root/app-root',
              transition: {
                  name: "fade"
              },
              context:{
                  token: "test",
                  username: "test"
              },
              backstackVisible: false,
              clearHistory: true    
            });
        }
    });  

    return viewModel;
}

module.exports = LoginViewModel;