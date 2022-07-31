const { Frame, Application, getViewById } = require("@nativescript/core");

const AppRootViewModel = require("./app-root-view-model");
const appSettings = require("application-settings");

function onLoaded(args) {
    const drawerComponent = args.object;
    drawerComponent.bindingContext = new AppRootViewModel();

    drawerComponent.bindingContext.set("selectedPage", 'Monitor');

    if (appSettings.getString("username")!= undefined && appSettings.getString("username")!="")
        drawerComponent.bindingContext.set("user", appSettings.getString("username"));

    if (appSettings.getString("isDirector")=="isdirectorbr")
        drawerComponent.bindingContext.set("menu_show", "visible")
    else drawerComponent.bindingContext.set("menu_show", "collapse")
}

function onNavigationItemTap(args) {
    const component = args.object;
    const componentRoute = component.route;
    const componentTitle = component.title;
    const bindingContext = component.bindingContext;

    if (component.title=="Logout") {
        appSettings.setString("username", "");
        appSettings.setString("hash", "");
        appSettings.setString("token", "");
        bindingContext.set("selectedPage", "Monitor");
    }
    else {
        bindingContext.set("selectedPage", componentTitle);
    }

    Frame.topmost().navigate({
        moduleName: componentRoute,
        transition: {
            name: "fade"
        }
    });

    const sideDrawer = Application.getRootView();
    let drawer       = getViewById(sideDrawer, "sideDrawer");
    drawer.closeDrawer();
}

exports.onLoaded = onLoaded;
exports.onNavigationItemTap = onNavigationItemTap;
