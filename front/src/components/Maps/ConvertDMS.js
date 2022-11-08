function turnToDMS(coordinate) {

    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    // add the degree, minute, seconds symbols
    return degrees + "°" + minutes + "' " + seconds+'" ';
}

// Returns the latitude and longitude to DMS format
export default function ConvertDMS(lat, lng) {

    // first turn the latitude
    var latitude = turnToDMS(lat);
    var latCardinal = lat >= 0 ? "N" : "S";

    // then turn the longitude
    var longitude = turnToDMS(lng);
    var longCardinal = lng >= 0 ? "E" : "W";

    // return them in one line
    return latitude + " " + latCardinal + ",  " + longitude + " " + longCardinal;
};