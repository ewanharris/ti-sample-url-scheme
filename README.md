# ti-sample-url-scheme

An sample application to demonstrate how to setup and handle custom URL schemes in Titanium.

## iOS

For iOS we want to define the handle in the `tiapp.xml` by adding the below to our  `<plist>` section:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>{{your-url-scheme}}</string>
    </array>
  </dict>
</array>
```

You can find the definition for this in the `tiapp.xml` [here](https://github.com/ewanharris/ti-sample-url-scheme/blob/master/tiapp.xml#L41-L49)

Then in our application we can handle the event that the SDK emits using the below code:

```js
Ti.App.iOS.addEventListener('handleurl', (e) => {
  /** handle **/
});
```

You can find the code for this app [here](https://github.com/ewanharris/ti-sample-url-scheme/blob/master/app/controllers/index.js#L4-L20)


## Android

To handle these on Android we need to include [ti.deeply](https://github.com/caffeinalab/ti.deeply). That module is already included in this project.

After adding the module we want to configure the intent filter in our `tiapp.xml`. Inside the `<manifest>` tag we want to setup the following:

```xml

<application>
  <activity android:name="ti.deeply.DeepLinkHandlerActivity" android:noHistory="true" android:excludeFromRecents="true" android:theme="@android:style/Theme.NoDisplay" android:launchMode="singleTask">
    <!-- {{your-url-scheme}}://{{your-host} -->
    <intent-filter>
      <action android:name="android.intent.action.VIEW" />
      <category android:name="android.intent.category.DEFAULT" />
      <category android:name="android.intent.category.BROWSABLE" />
      <data android:host="{{your-host}}" android:scheme="{{your-url-scheme}}" />
    </intent-filter>
  </activity>
</application>
```

You can find the definition for this in the `tiapp.xml` [here](https://github.com/ewanharris/ti-sample-url-scheme/blob/master/tiapp.xml#L55-L79)

Then in our application to handle the event we want to use `ti.deeply` to set the callback:

```js
const deeply = require('ti.deeply');
deeply.setCallback((e) => {
 /** handle **/
});
```

You can find the code for this [here](https://github.com/ewanharris/ti-sample-url-scheme/blob/master/app/controllers/index.js#L22-L30)

## Testing

To demonstrate handling different behaviour dependent on the URL this sample has two "actions". They are `alert` and `updateLabel`, to use them:

* `tisample://alert?name=Titanium&whatIsIt=awesome`
  * Will extract the query parameters and display the data as an alert
* `tisample://updateLabel?name=Titanium&whatIsIt=awesome`
  * Will extract the query parameters and display the data in a label

To test this you want to trigger the app launch by the URL scheme:

* iOS: Open Safari and enter a URL like `tisample://alert?name=Titanium&whatIsIt=awesome`
* Android: Use `adb` to trigger the launch, `adb shell am start -a android.intent.action.VIEW -d "tisample://alert?name=Titanium\&whatIsIt=awesome" com.axway.urlschemesample`
  * Note the `\` before `&` in the query parameters. That's required for it to be handled correctly
