import React from 'react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import {
  Image,
  Hero,
  Section,
  Box,
  Tile,
  Heading,
  Level,
  Container,
} from 'react-bulma-components';
import { VictoryBar } from 'victory';

import Menu from '../containers/Menu';
import LayoutWithSidebar from '../containers/LayoutWithSidebar';
import Sidebar from '../containers/Sidebar';
import BlockchainTransactions from '../containers/BlockchainTransactions';

import Icon from '../components/Icon';
import TemperatureChart from '../components/TemperatureChart';

import '../main.sass';

const stands = ['rs', 'cypress'];

const ChartTile = ({ stand }) => {
  if (process.browser) {
    window.localStorage.setItem("stand", stand);
  }
  return (
    <Tile renderAs="div" kind="child" notification backgroundColor="white">
      <Level marginless>
        <Image
          src={
            stand === 'rs'
              ? '/static/rs_logo_trimmed.png'
              : '/static/cypress_logo_trimmed.png'
          }
          style={{ maxWidth: stand === 'rs' ? 250 : 180 }}
        />
        <Heading>
          {stand === 'rs' ? 'Hall 3A, booth 439' : 'Hall 4A, booth 148'}
        </Heading>
      </Level>
      <TemperatureChart color="rgba(196, 58, 49, 1)" legend stand={stand} />
    </Tile>
  )
};

const Homepage = ({ router }) => (router.query.stand && stands.includes(router.query.stand) ? (
  <>
    <Head>
      <title>Zerynth - Embedded World 2019</title>
      <link rel="icon" href="/static/favicon.png" />
    </Head>
    <Hero size="small">
      <Hero.Body style={{ textAlign: 'center' }}>
        <Image
          src="/static/zerynth_logo.png"
          style={{ maxWidth: 400, margin: '0 auto' }}
        />
      </Hero.Body>
    </Hero>

    <LayoutWithSidebar left={<Sidebar active="Overview" />}>
      <Section paddingless>
        <Box>
          <Tile
            kind="ancestor"
            backgroundColor="light"
            style={{ height: '82vh' }}
          >
            <Tile size={12} vertical>
              <Tile>
                <Tile kind="parent" vertical size={8}>
                  <ChartTile stand={router.query.stand} />
                  <ChartTile
                    stand={router.query.stand === 'rs' ? 'cypress' : 'rs'}
                  />
                </Tile>
                <Tile kind="parent">
                  <Tile
                    renderAs="div"
                    kind="child"
                    notification
                    clipped
                    backgroundColor="white"
                    style={{ height: '80vh', minHeight: '80vh' }}
                  >
                    <Heading size={3}>
                      <Icon
                        icon="ethereum"
                        size="large"
                        pack="fab"
                        style={{ position: 'relative', top: '6px' }}
                      />
                      Blockchain transactions
                    </Heading>
                    <BlockchainTransactions />
                  </Tile>
                </Tile>
              </Tile>
            </Tile>
          </Tile>
        </Box>
      </Section>
    </LayoutWithSidebar>
  </>
) : (
  <Container style={{ maxWidth: 300 }}>
    <Heading>Select your stand</Heading>
    <Link href="/?stand=rs">
      <Image src="/static/rs_logo.png" style={{ maxWidth: 300 }} />
    </Link>
    <br />
    <Link href="/?stand=cypress">
      <Image src="/static/cypress_logo.png" style={{ maxWidth: 300 }} />
    </Link>
  </Container>
));

export default withRouter(Homepage);
