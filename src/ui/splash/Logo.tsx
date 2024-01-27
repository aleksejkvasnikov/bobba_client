import React from 'react';
import './logo.css';
import Constants from '../../Constants';

class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <div>
                    <img src={Constants.PUBLIC_RESOURCES_URL + "images/bottom_bar/ghosthead.png"} alt="Bobba" />
                    <h1>bobba</h1>
                </div>
            </div>
        );
    }
}

export default Logo;