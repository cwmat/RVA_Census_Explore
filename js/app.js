require([
     "esri/Map",
     "esri/views/MapView",
     "esri/layers/FeatureLayer",
     "esri/renderers/SimpleRenderer",
     "esri/symbols/SimpleFillSymbol",
     "esri/widgets/Legend",
     "dojo/domReady!"
   ], function(
     Map, MapView, FeatureLayer, SimpleRenderer, SimpleFillSymbol, Legend
   ) {

     var defaultSym = new SimpleFillSymbol({
       outline: {
         color: "lightgray",
         width: 0.5
       }
     });

     // limit visualization to southeast U.S. counties
     var defExp = ["STATE = 'LA'", "STATE = 'AL'", "STATE = 'AR'",
       "STATE = 'MS'", "STATE = 'TN'", "STATE = 'GA'",
       "STATE = 'FL'", "STATE = 'SC'", "STATE = 'NC'",
       "STATE = 'VA'", "STATE = 'KY'", "STATE = 'WV'"
     ];

     /*****************************************************************
      * Set a color visual variable on the renderer. Color visual variables
      * create continuous ramps that map low data values to weak or
      * neutral colors and high data values to strong/deep colors. Features
      * with data values in between the min and max data values are assigned
      * a color proportionally between the min and max colors.
      *****************************************************************/

     var renderer = new SimpleRenderer({
       symbol: defaultSym,
       label: "% population in poverty by county",
       visualVariables: [{
         type: "color",
         field: "POP_POVERTY",
         normalizationField: "TOTPOP_CY",
         stops: [
         {
           value: 0.1,
           color: "#FFFCD4",
           label: "<10%"
         },
         {
           value: 0.3,
           color: "#350242",
           label: ">30%"
         }]
       }]
     });

     var povLyr = new FeatureLayer({
       url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/counties_politics_poverty/FeatureServer/0",
       renderer: renderer,
       outFields: ["*"],
       popupTemplate: {
         title: "{COUNTY}, {STATE}",
         content: "{POP_POVERTY} of {TOTPOP_CY} people live below the poverty line.",
         fieldInfos: [
         {
           fieldName: "POP_POVERTY",
           format: {
             digitSeparator: true,
             places: 0
           }
         }, {
           fieldName: "TOTPOP_CY",
           format: {
             digitSeparator: true,
             places: 0
           }
         }]
       },
       definitionExpression: defExp.join(" OR ") // only display counties from states in defExp
     });

     var map = new Map({
       basemap: "gray",
       layers: [povLyr]
     });

     var view = new MapView({
       container: "viewDiv",
       map: map,
       center: [-85.050200, 33.125524],
       zoom: 6
     });

     /******************************************************************
      *
      * Add layers to layerInfos on the legend
      *
      ******************************************************************/

     var legend = new Legend({
       view: view,
       layerInfos: [
       {
         layer: povLyr,
         title: "Poverty in the southeast U.S."
       }]
     });

    // view.ui.add(legend, "top-right");

   });