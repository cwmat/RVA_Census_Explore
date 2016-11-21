require([
  "esri/Map",
  "esri/views/MapView",
  "dojo/domReady!"
], function(Map, MapView) {
  // Code to create the map and view will go here
  var map = new Map({
    basemap: "topo",
  });

  var view = new MapView({
    container: "viewDiv",
    map: map,
  });
});
