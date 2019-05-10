import React from 'react';

import PropTypes from 'prop-types';
import Icon from 'react-bulma-components/lib/components/icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'; // import all icons
import {
  // Add needed icons here, and add them to library later
  // faCheckSquare,
  // faCoffee,
  // faHome,

  // Or we can just import them all (wathc out for the bundle size)
  fas,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  fab, // package containing every brand icon
  fas, // package containing every standard icon
);

const sizeShortNames = {
  small: 'xs',
  medium: 'sm',
  large: 'lg',
};

const IconWrapper = ({
  icon,
  pack,
  size,
  boxSize,
  ...other
}) => (
  <Icon size={boxSize || size} {...other}>
    <FontAwesomeIcon size={sizeShortNames[size] || ''} icon={[pack, icon]} />
  </Icon>
);

IconWrapper.propTypes = {
  icon: PropTypes.string,
  pack: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  boxSize: PropTypes.string, // override square size around the icon
};

IconWrapper.defaultProps = {
  pack: 'fas',
  icon: 'rocket',
  size: 'medium',
  boxSize: '',
};

export default IconWrapper;
