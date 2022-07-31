exports.onPageLoaded = args => {
	const obj = args.object;

	const c = obj.getViewById('container1')
	console.log(c)
};
