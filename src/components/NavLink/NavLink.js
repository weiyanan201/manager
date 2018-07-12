import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'


const NavLink = ({target, linkText})=>{
    return(
        <div>
            <Link to={target}>{linkText}</Link>
        </div>
    );
};

NavLink.propTypes = {
    target : PropTypes.string,
    linkText : PropTypes.string
}

export default NavLink;
