let units

exports.onLoad = args => {
	const obj = args.object;
	units = obj.bindingContext.units
};

function onTrackBallContentRequested(args) {
	args.content = args.pointData.y + " " + units
}

exports.onTrackBallContentRequested = onTrackBallContentRequested;