var map;
function initMap() {

    var rosstown = {
        lat: -37.886083, 
        lng: 145.057090,
        placeID: 'ChIJM9xHhCNq1moRX2QT74NykDM'
    };

    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 17, center: rosstown
    });

    var marker = new google.maps.Marker({
        position: rosstown, 
        map: map
    });
}