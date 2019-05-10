import React from 'react';
import {
  Image,
} from 'react-bulma-components';

import Menu from '../Menu';

const logos = ['/static/ethereum_logo.png', '/static/embedded_world_logo.png'];
const logoMaxWidth = 200; // max width in px for each logo

const getStand = () => (
  process.browser && window.localStorage.getItem("stand")
);

export default ({ active }) => (
  <>
    <p className="menu-label is-hidden-touch">Navigation</p>

    {/* Sidebar menu */}
    <Menu
      entries={[
        {
          name: 'Overview',
          icon: 'tachometer-alt',
          href: getStand() ? `/?stand=${getStand()}` : '/',
        },
        {
          name: 'Tech spec',
          icon: 'microchip',
          href: '/tech',
        },
        {
          name: 'Etherscan',
          icon: 'ethereum',
          pack: 'fab',
          href: 'https://ropsten.etherscan.io/address/0x66B4f2b7F5F2B8F6faCBfCc9336218DfF08e07f5',
        },
      ]}
      active={ active }
    />

    <Image src="/static/etherscan_qr.png" style={{ maxWidth: 180 }} />

    <div style={{ height: '10vh' }} />
    <hr />

    {/* List of logo images */}
    {logos.map(url => (
      <React.Fragment key={url}>
        <Image
          src={url}
          style={{ maxWidth: logoMaxWidth, margin: '0 auto' }}
        />
        <br />
      </React.Fragment>
    ))}
  </>
);
