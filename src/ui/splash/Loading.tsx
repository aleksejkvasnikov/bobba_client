import React, { Component } from 'react';
import GenericSplash from './GenericSplash';
import Constants from '../../Constants';

type LoadingProps = {
    loadingText: string,
};
class Loading extends Component<LoadingProps> {

    render() {
        const { loadingText } = this.props;
        return (
            <GenericSplash>
                <div className="loading">
                    <img src={Constants.PUBLIC_RESOURCES_URL + "images/loading.gif"} alt="Loading" />
                    <p>Loading...</p>
                    <p className="loading_info">
                        {loadingText}
                    </p>
                </div>
            </GenericSplash>
        );
    }
}

export default Loading;
