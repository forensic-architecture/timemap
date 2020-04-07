
# Timemap and custom Mapbox maps

You can use satellite images and maps from [https://www.mapbox.com/](https://www.mapbox.com/) to customise the map in Timemap. 

Sign up for an account at [https://www.mapbox.com/](https://www.mapbox.com/) and use Mapbox's studio to create a custom map. To use the map you need to configure Timemap with the following: 

## Token

To access your Mapbox account Timemap needs an access token that you create under your Mapbox account. 

Sign in to Mapbox and then navigate to: 

Account > Access Tokens 

* Create a Token - add a token and optionally restrict it to the url of your timemap instance.
* Add it to Timemap - copy the token and then add it to Timemap's `config.js` at the top level:

 ```
  MAPBOX_TOKEN: 'mapbox_token',
 ```

Timemap can now access your account but you need to associate any maps you want to use with that account using Mapbox Studio. Once you have done that you can then reference the Mapbox Map id.

## Mapbox Map Id

To reference a map you have created in Mapbox Studio you need the map's id which is available under 'share' > 

* Style URL (which looks like this: `mapbox://styles/your-mapbox-account-name/x5678-map-id`)

Now go back to `config.js` and under the UI settings add (don't copy the 'mapbox://styles/' bit): 

```
   ui: {
      tiles: 'your-mapbox-account-name/x5678-map-id',
``` 

If you restart your time map instance you should now see the Mapbox map.
