require([
     "esri/Map",
     "esri/views/MapView",
     "esri/layers/FeatureLayer",
     "esri/renderers/SimpleRenderer",
     "esri/symbols/SimpleFillSymbol",
     "esri/symbols/SimpleLineSymbol",
     "esri/Color",
     "esri/Graphic",
     "esri/widgets/Legend",
     "dojo/on",
     "dojo/dom",
     "dojo/domReady!"
   ], function(
     Map, MapView, FeatureLayer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol, Color, Graphic, Legend, on, dom) {

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
       label: "Total population",
       visualVariables: [{
         type: "color",
         field: "Persons_Total_2010",
         // normalizationField: "TOTPOP_CY",
         stops: [
         {
           value: 515,
           color: "#FFFCD4",
           label: "<10%"
         },
         {
           value: 2800,
           color: "#350242",
           label: ">30%"
         }]
       }]
     });

     var povLyr = new FeatureLayer({
       url: "http://services7.arcgis.com/Y6IWUUpsKIrGCOdj/arcgis/rest/services/RVA_Block_Groups/FeatureServer/0",
       renderer: renderer,
       outFields: ["*"],
      //  popupTemplate: {
      //    title: "{COUNTY}",
      //    content: "test",
      //    fieldInfos: [
      //    {
      //      fieldName: "COUNTY",
      //      format: {
      //        digitSeparator: true,
      //        places: 0
      //      }
      //    }]
      //  },
       // definitionExpression: defExp.join(" OR ") // only display counties from states in defExp
     });

     var highlightSymbol = new SimpleFillSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0]), 3
          ),
          new Color([125,125,125,0.35])
      );

     var map = new Map({
       basemap: "gray",
       layers: [povLyr]
     });

    //close the dialog when the mouse leaves the highlight graphic
    map.on("load", function(){
      map.graphics.enableMouseEvents();
      map.graphics.on("mouse-out", closeDialog);
    });

     var view = new MapView({
       container: "viewDiv",
       map: map,
       center: [-77.436754, 37.539755],
       zoom: 11
     });

     /******************************************************************
      *
      * Add layers to layerInfos on the legend
      *
      ******************************************************************/

    //  var legend = new Legend({
    //    view: view,
    //    layerInfos: [
    //    {
    //      layer: povLyr,
    //      title: "Testing RVA Census"
    //    }]
    //  });

    // view.ui.add(legend, "top-right");

    //listen for when the onMouseOver event fires on the countiesGraphicsLayer
    //when fired, create a new graphic with the geometry from the event.graphic and add it to the maps graphics layer
    // povLyr.on("mouse-over", function(evt) {
    //   var highlightGraphic = new Graphic(evt.graphic.geometry, highlightSymbol);
    //   map.graphics.add(highlightGraphic);
    //
    //   // dialog.setContent(content);
    //
    //   // domStyle.set(dialog.domNode, "opacity", 0.85);
    //   // dijitPopup.open({
    //   //   popup: dialog,
    //   //   x: evt.pageX,
    //   //   y: evt.pageY
    //   // });
    // });

  view.on("click", function(event) {
    view.hitTest(event.screenPoint).then(function(response) {
      var graphics = response.results;
      graphics.forEach(function(graphic) {
        console.log(graphic);
      });
    });
  });

    // function closeDialog() {
    //   map.graphics.clear();
    //   console.log("sgetti");
    //   // dijitPopup.close(dialog);
    // }

   });
