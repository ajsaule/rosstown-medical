var map;
var script = document.createElement('script');

script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAP_API_KEY}&callback=initMap`;
script.async = true;

function initMap() {

    var rosstown = {
        lat: -37.886083, 
        lng: 145.057090,
        // placeID: 'ChIJM9xHhCNq1moRX2QT74NykDM'
    };

    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 17,
            center: rosstown
    });

    var marker = new google.maps.Marker({
        position: rosstown, 
        map: map
    });

    const features = [
        {
            position: new google.maps.LatLng(-37.886083, 145.057060),
            type: "parking",
        },
    ]
}

// Attach your callback function to the `window` object
window.initMap = function () {
    
};

// Append the 'script' element to 'head'
document.head.appendChild(script);