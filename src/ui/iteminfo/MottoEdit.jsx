import React from 'react';
import PropTypes from 'prop-types';
import 'react-edit-text/dist/index.css';

export default class MottoEdit extends React.Component {
    render() {
        const { motto, onMottoChange } = this.props;
        return <input type="text" ref={motto} maxLength={80} name="chat" value={motto} autoComplete="off" onChange={event => onMottoChange(event.target.value)} />;
    }
}

MottoEdit.propTypes = {
    motto: PropTypes.string,
    onMottoChange: PropTypes.func,
};