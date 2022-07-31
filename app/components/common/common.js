const builder  = require("tns-core-modules/ui/builder");

exports.onLoad = args => {
	const obj = args.object;
	//console.log(obj.bindingContext.parts[0])

	const container = obj.getViewById('commonparts');

	container.removeChildren();

	let parts = obj.bindingContext.parts;

	for (var i=0; i < parts.length; i++) {
	
		const test = builder.load({
		        path: '~/components/flexcard',
		        name: "flexcard",
		        attributes: {
		            bindingContext: parts[i]
		        }
	    	});

		container.addChild(test)

		if (i!= parts.length-1) {
			const line = builder.load({
		        path: '~/components/commonline',
		        name: "commonline"
	    	});

			container.addChild(line)

		
	    }
	}
};