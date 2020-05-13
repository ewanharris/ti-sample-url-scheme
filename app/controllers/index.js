$.index.open();

if (OS_IOS) {
	Ti.App.iOS.addEventListener('handleurl', (e) => {
		/** 
		 * When we launch on iOS we get an object like below, `launchOptions` is the URL used to launch the application.
		 * This is just like a web URL and you can pass data along use query parameters, then the app can use those parameters to perform the required action
		 * 
		 * For example:
		 * 	tisample://alert?somedata=foobar
		 * 	tisample://updateLabel?somedata=123456
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
		console.log(`Handled URL, data was ${JSON.stringify(e)}`);
		const [ ignore, action, rawQueryParams ] = e.launchOptions.url.match(/tisample:\/\/(\w+)\??(.+)/);
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
