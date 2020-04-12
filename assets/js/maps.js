var covidRenderingData = {
    max: 500,
    data: covidClusters.map(function (cluster) {
        return {
            lat: cluster["lat"],
            lng: cluster["lng"],
            count: cluster["count"],
        }
    })
};

var cfg = {
    "radius": 0.02,
    "maxOpacity": .8,
    "scaleRadius": true,
    "useLocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
};

var heatmapLayer = new HeatmapOverlay(cfg);
var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'sk.eyJ1IjoiY2h1YXl3IiwiYSI6ImNrOHRuamdobDAxZWMzZ3J5Z21qMHZ4aTMifQ.ONnkcujaIbeGWJ1airu7Wg'
})

var legend = L.control({position: "bottomleft"});

legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += `<h6>Total Number of Local Cases Visualized: ${covidClusters.reduce(function (acc, curr) {
        return acc + curr["count"]
    }, 0)}</h6>`;
    div.innerHTML += `<h6>Total Cases in Singapore: Imported + Local = 2,299</h6>`;
    div.innerHTML += `<h6>*Updated as of 12 April 2020, 21:36</h6>`;
    return div;
};

sortedCovidClusters = covidClusters.sort(function (a, b) {
    return b.count - a.count
})

window.onload = function () {
    var map = new L.map('map', {
        center: new L.LatLng(1.359643, 103.842575),
        zoom: 12,
        layers: [baseLayer, heatmapLayer]
    })
    heatmapLayer.setData(covidRenderingData)
    covidClusters.map(function (clusters) {
        L.marker([clusters["lat"], clusters["lng"]]).addTo(map).bindTooltip(`${clusters["name"]}, type: ${clusters["type"]}, count: ${clusters["count"]}`).openPopup();
    })
    legend.addTo(map)

    var covidClustersTable = $("#covidClustersTable")
    sortedCovidClusters.forEach(function (covidCluster) {
        covidClustersTable.append(`<tr><td>${covidCluster.name}</td><td>${covidCluster.type}</td><td>${covidCluster.count}</td></tr>`)
    })
}



