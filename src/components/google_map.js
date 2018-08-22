import React, {Component} from 'react';
const google = window.google; // very important when using CRA 
 
class GoogleMap extends Component {
    componentDidMount() {
        new google.maps.Map(this.refs.map, {
            zoom: 12,
            center: {
                lat: this.props.lat,
                lng: this.props.lon
            }
        });
    }
 
    render() {
        return <div ref="map" />;
    }
}
export default GoogleMap;
 // really important when using CRA becuase that's what caused the error in the first place