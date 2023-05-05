import React from 'react';
import PropTypes from 'prop-types';

export default class MottoEdit extends React.Component {
    render() {
        const { motto, onMottoChange } = this.props;
        return '';
    }
}

MottoEdit.propTypes = {
    motto: PropTypes.string,
    onMottoChange: PropTypes.func,
};