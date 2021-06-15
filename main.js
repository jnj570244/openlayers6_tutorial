window.onload = init;

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: [-7709019.147448199, -2896452.2808331363],
      zoom: 7,
      maxZoom: 10,
      minZoom: 4,
      rotation: 0.5
    }),

    // layers: [
    //   new ol.layer.Tile({
    //     source: new ol.source.OSM()
    //   })
    // ],

    target: "js-map"
  });

  // map.on("click", function (e) {
  //   console.log(e.coordinate);
  // });

  //Basemaps Layers
  const openStreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: "OSMStandard"
  });

  const openStreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    }),
    visible: false,
    title: "OSMHumanitarian"
  });

  const stamenTerrain = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: "http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg",
      attributions:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: "StamenTerrain"
  });

  //Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain]
  });

  map.addLayer(baseLayerGroup);

  //Layer Switcher Logic for Basemaps
  const baseLayerElements = document.querySelectorAll(
    ".sidebar > input[type=radio]"
  );
  for (let baseLayerElement of baseLayerElements) {
    //console.log(baseLayerElements);
    baseLayerElement.addEventListener("change", function () {
      //console.log(this.value);
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerTitle = element.get("title");
        element.setVisible(baseLayerTitle === baseLayerElementValue);
        // console.log(
        //   "baseLayerTitle : " + baseLayerTitle,
        //   "baseLayerElementValue : " + baseLayerElementValue
        // );

        //console.log(baseLayerTitle === baseLayerElementValue);
        console.log(element.get("title"), element.get("visible"));
      });
    });
  }

  const fillStyle = new ol.style.Fill({
    color: [84, 118, 255, 1]
  });

  const strokeStyle = new ol.style.Stroke({
    color: [46, 45, 45, 1],
    width: 1.2
  });

  const circleStyle = new ol.style.Circle({
    fill: new ol.style.Fill({
      color: [245, 49, 5, 1]
    }),
    radius: 7,
    storke: strokeStyle
  });

  //Vector Layers
  const EUCountriesGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: "./data/vector_data/EUCountries.geojson",
      format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: "EUCountriesGeoJSON",
    style: new ol.style.Style({
      fill: fillStyle,
      storke: strokeStyle,
      image: circleStyle
    })
  });

  map.addLayer(EUCountriesGeoJSON);

  //Vector Feature Popup Logic
  const overlayContainerElement = document.querySelector(".overlay-container");
  const overlayLayer = new ol.Overlay({
    element: overlayContainerElement
  });

  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById("feature-name");
  const overlayFeatureAdditionalInfo = document.getElementById(
    "feature-additional-info"
  );

  map.on("click", function (e) {
    overlayLayer.setPosition(undefined);
    map.forEachFeatureAtPixel(
      e.pixel,
      function (feature, layer) {
        //console.log(feature);
        //console.log(feature.getKeys());

        let clickedCoordinate = e.coordinate;
        let clickedFeatureName = feature.get("name");
        let clickedFeatureAdditionInfo = feature.get("additionalInfo");
        //console.log(clickedFeatureName, clickedFeatureAdditionInfo);
        overlayLayer.setPosition(clickedCoordinate);
        overlayFeatureName.innerHTML = clickedFeatureName;
        overlayFeatureAdditionalInfo.innerHTML = clickedFeatureAdditionInfo;
      },
      {
        layerFilter: function (layerCandidate) {
          return layerCandidate.get("title") === "EUCountriesGeoJSON";
        }
      }
    );
  });
}
