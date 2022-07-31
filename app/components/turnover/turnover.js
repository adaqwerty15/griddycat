const builder  = require("tns-core-modules/ui/builder");

exports.onLoad = args => {
	const obj = args.object;

	const container = obj.getViewById('chartturnover');

	container.removeChildren()

	let type = (obj.bindingContext.plotType).toString()

	console.log(type+" turn")

	if (type=="barstack" || type=="barstackh" || type=="line" || type=="stringbarstack" || type=="stringline" || type=="stringline2") {

		const test = builder.load({
		        path: '~/components/'+type,
		        name: type,
		        attributes: {
		            bindingContext: obj.bindingContext
		        }
	    	});

		container.addChild(test)

	}
	
};