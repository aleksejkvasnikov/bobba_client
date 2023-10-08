import React, { Component, ReactNode } from 'react';
import Logo from './Logo';
import Credits from './Credits';
import './splash.css';
import Draggable from 'react-draggable';

interface IGenericSplashProps {
    children: ReactNode
}
class GenericSplash extends Component<IGenericSplashProps> {

    render() {
        return (
            <div className="main_wrapper">
                <Draggable handle=".logo">
                    <div className="main_container">
                        <div className="main_content">
                            <button className="close">
                                X
                            </button>
                            <Logo />
                            <hr />
                            {this.props.children}
                        </div>
                        <Credits />
                    </div>

                </Draggable>
            </div>
        );
    }
}

export default GenericSplash;
