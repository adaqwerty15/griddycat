let names 
let names2
let token

const observableModule = require("tns-core-modules/data/observable");
const Observable       = require("tns-core-modules/data/observable").Observable;
const builder          = require("tns-core-modules/ui/builder");
var   frameModule      = require("tns-core-modules/ui/frame");
const getFrameById = require("tns-core-modules/ui/frame").getFrameById;
const appSettings      = require("application-settings");
const getViewById      = require("@nativescript/core").getViewById;
let viewModel = new Observable();

let urls = []
let stateCard = []

exports.onPageLoaded = args => {
	stateCard = []
	urls = []
	const obj = args.object;

	obj.bindingContext = names2
	token = appSettings.getString("token");
};


function onNavigatingTo(args) {
    var page    = args.object;
    var gotData = page.navigationContext;
    names = gotData.names
    names2 = gotData.names2
    //console.log(names2)
}

exports.onNavigatingTo = onNavigatingTo;


function onCancelButtonTap(args) {
	viewModel.set("process", true)
	
    //const frame = getFrameById("framecard");
    const frame = args.object.page.frame;

    frame.navigate({
        moduleName: 'monitor/monitor-page',
        
        transition: {
            name: "fade"
        },
         context:{
         	reload:false
         },
                                     
        backstackVisible: true,
        clearHistory: false
    });

    viewModel.set("process", false)

}
exports.onCancelButtonTap = onCancelButtonTap;

function onItemReordered(args){

	//urls.push('http://192.168.1.162:9042/jsonapi/v6/movepinnedtile?ptid='+args.view.id+'&position='+(args.data.targetIndex+1)+'&mobile=q&token='+token)
	urls.push('https://gc.teacode.com/jsonapi/v7/movepinnedtile?ptid='+args.view.getChildAt(0).id+'&position='+(args.data.targetIndex+1)+'&mobile=q&token='+token)
	// fetch('http://192.168.1.162:9042/jsonapi/v6/movepinnedtile?ptid='+args.view.id+'&position='+(args.data.targetIndex+1)+'&mobile=q&token='+token)
 //                  .then((response) => response.text())
 //                  .then((data) => {  
 //                   console.log(data)
 //                   }).
 //                     catch((e) => {
 //                        console.log("Error2 " + e)
 //                     });
    console.log("Item reordered. Old index: " + args.index + " " + "new index: " + args.data.targetIndex);  
}
exports.onItemReordered = onItemReordered;


const app = require("tns-core-modules/application");

function onDoneButtonTap(args){
    console.log("save")
    console.log(urls)
    for(let i=0; i<stateCard.length; i++){
		console.log(stateCard[i])
		
		urls.push('https://gc.teacode.com/jsonapi/v7/togglevistile?ptid='+stateCard[i].id+'&token='+token)
	}

		let chain = Promise.resolve();

		let results = [];

		urls.forEach(function(url) {
		  chain = chain
		    .then(() => fetch(url))
		    .then((result) => {
		      results.push(result);
		    });
		});

		chain.then(() => {
			
			viewModel.set("process", true)
			//const frame = getFrameById("framecard");
			const frame = args.object.page.frame;
			frame.navigate({
		        moduleName: 'monitor/monitor-page',
		        
		        transition: {
		            name: "fade"
		        },
		         context:{
		         	reload:true
		         },
		                                     
		        backstackVisible: true,
        		clearHistory: false
		    });
		    viewModel.set("process", false)
		});

}
exports.onDoneButtonTap = onDoneButtonTap;

function clickChangeState(args) {
	
    const flexlayout = args.view.parent
    const valueID = flexlayout.getChildAt(0).id
	const img = args.view.parent.getChildAt(2)
	
	let index = -1;
	for(let i=0; i<stateCard.length; i++) {
			if(stateCard[i].id === valueID){
				index = i;
				break;
		}
	}

	let indexContext = -1;
	
	//let cont = view.getViewById(frame, "editpage");
	let cont = getViewById(app.getRootView(), "editpage");
	console.log("cont");
	console.log(cont)
	let context
	if (cont){
	 context = cont.bindingContext.items;
	}
	else 
	 context = names2	
		
	for(let i=0; i<context.length; i++) {
		if(context[i].id === valueID){
			indexContext = i;
			break;
		}
	}
	
		// console.log(context)
	
	if((flexlayout.class).includes("view")) { 	
		if(index === -1){
			stateCard.push({
				id: valueID,
				showOnMonitor: false
			});
		}
	
		else {
			stateCard.splice(index,1);
		}
	
		if (indexContext !== -1) {
			context[indexContext].class = "card_edit hide";
			img.src = "res://none";
			flexlayout.className =  "card_edit hide";
		}
	
	} else{
		if((flexlayout.class).includes("hide")) {
			console.log("show")
	
			if(index === -1){
				stateCard.push({
					id: valueID,
					showOnMonitor: true
				});}
			else{
				stateCard.splice(index,1);
			}
			if(indexContext !== -1){
				// stateCard[index].showOnMonitor = false;
				context[indexContext].class = "card_edit view";
				img.src = "res://show";
				flexlayout.className =  "card_edit view";
			}
		}
	}
	
	
}
exports.clickChangeState = clickChangeState;