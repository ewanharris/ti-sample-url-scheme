$.index.open();

if (OS_IOS) {
	Ti.App.iOS.addEventListener('handleurl', (e) => {
		/** 
		 * When we launch on iOS we get an object like below, `launchOptions` is the URL used to launch the application.
		 * 
		 * {
		 *   "launchOptions":{
		 *     "url":"tisample://"
		 *   },
		 *   "bubbles":true,
		 *   "type":"handleurl",
		 *   "source":{},
		 *   "cancelBubble":false
		 * }
		 */
		console.log(`iOS handled event ${JSON.stringify(e)}`);
		handleURL(e);
	});
} else if (OS_ANDROID) {
	const deeply = require('ti.deeply');
	deeply.setCallback((e) => {
		/**
		 * When we launch on Android we get an object like below, here we'll just normalise it to match iOS
		 * {
		 *   "data":"tisample://alert?name=Titanium&whatIsIt=awesome",
		 *   "action":"android.intent.action.VIEW",
		 *   "extras":null
		 * }
		 */
		console.log(`Android handled event ${JSON.stringify(e)}`);
		const eventData = { launchOptions: { url: e.data } };
		handleURL(eventData);
	});
}


function parseQueryParams(url) {
	const queryParams = {};
	const pairs = decodeURI(url).split('&');

	for (const pair of pairs) {
		const keyValuePair = pair.split('=');
		queryParams[keyValuePair[0]] = keyValuePair[1];
	}

	return queryParams;
}

function handleURL (eventData) {
	/**
	 * The URL in an event is just like a web URL,
	 * you can pass data along using query parameters and
	 * then the app can then extract the action and data from the URL like below
	 *
	 * For example:
	 * 	tisample://alert?somedata=foobar
	 * 	tisample://updateLabel?somedata=123456
	 */
	console.log(`Handled URL, data was ${JSON.stringify(eventData)}`);
	const [ ignore, action, rawQueryParams ] = eventData.launchOptions.url.match(/tisample:\/\/(\w+)\??(.+)/);
	const data = parseQueryParams(rawQueryParams);

	switch (action) {
		case 'alert':
			alert(data);
			break;
		case 'updateLabel':
			$.displayLabel.text = data;
			break
		default:
			console.warn(`Unknown action ${action}`);
			console.log(`data: ${JSON.stringify(data)}`);
			break;
	}
}
