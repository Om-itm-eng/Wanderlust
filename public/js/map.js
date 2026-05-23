var myAPIKey = mapAPIKey;
fetch(`https://api.geoapify.com/v1/geocode/search?text=${userLocation}&format=json&apiKey=${myAPIKey}`)
.then(response => response.json())
.then((geoCode)=>{
    var lat = geoCode.results[0].lat;
    var lon = geoCode.results[0].lon;
    var map = new maplibregl.Map({
        container: 'map',
        style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${myAPIKey}`,
        center: [lon, lat], 
        zoom: 14 // starting zoom
    })

    const marker = new maplibregl.Marker().setLngLat([lon, lat]).addTo(map);
})


