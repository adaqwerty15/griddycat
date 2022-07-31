var frameModule = require("tns-core-modules/ui/frame");
const LoginViewModel = require("./login-page-view-model");
const appSettings = require("application-settings");

const loginViewModel = new LoginViewModel();


function onPageLoaded(args) {
    const page = args.object;
    page.bindingContext = loginViewModel;
}

function onClickShowPassword(args){
    let v = args.view.parent.getChildAt(0).secure;
    
    args.view.parent.getChildAt(0).secure = !v;
    
    if(v){
        args.view.src = "res://show";
    }else{
        args.view.src = "res://none";
    }
}

exports. onClickShowPassword =  onClickShowPassword;

exports.onPageLoaded = onPageLoaded;