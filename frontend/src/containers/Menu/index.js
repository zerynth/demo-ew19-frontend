import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  Level,
} from 'react-bulma-components';

import Icon from '../../components/Icon';

const Menu = ({ entries, active }) => (
  <ul className="menu-list">
    { entries.map(({
      name, pack, icon, href,
    }) => (
      <li key={name + href}>
        <Link href={href}>
          <a className={active === name ? 'is-active' : ''}>
            <Level>
              <Level.Side align="left">
                <Level.Item>
                  <Icon size="large" icon={icon} pack={pack} />
                </Level.Item>
                <Level.Item>
                  { name }
                </Level.Item>
              </Level.Side>
            </Level>
          </a>
        </Link>
      </li>
    )) }
  </ul>
);

Menu.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
};

Menu.defaultProps = {
  entries: [],
};

export default Menu;
