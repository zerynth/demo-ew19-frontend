import React from 'react';
import Head from 'next/head';
import {
  Columns,
  Image,
  Hero,
  Section,
  Box,
  Heading,
  Level,
  Container,
} from 'react-bulma-components';
import Highlight from 'react-highlight'
import posed, { PoseGroup } from 'react-pose';
import SplitText from 'react-pose-text';

import Menu from '../containers/Menu';
import LayoutWithSidebar from '../containers/LayoutWithSidebar';
import Sidebar from '../containers/Sidebar';
import BlockchainTransactions from '../containers/BlockchainTransactions';

import Icon from '../components/Icon';
import TemperatureChart from '../components/TemperatureChart';

import '../main.sass';

const charPoses = {
  enter: {
    y: 0,
    opacity: 1,
    delay: ({ charIndex }) => charIndex * 30
  },
  exit: { y: 20, opacity: 0 }
};

const PosedImg = posed.img({
  exit: { opacity: 0, y: 80 },
  enter: { opacity: 1, y: 0, delay: 300, transition: { duration: 1000 } },
});

const PosedBox = posed.div({
  exit: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, delay: 1000, transition: { duration: 1000 } },
});

const snippet = `
# Part of the code is omitted for brevity purposes

def wifi_init():
  wifi_driver.init()
  wifi.link(SSID, wifi.WIFI_WPA2, PASSWORD)

def aws_connect():
  endpoint, thingname, clicert, pkey = default_credentials.load()
  thing = iot.Thing(endpoint, mqtt_id, clicert, pkey, thingname=thingname)
  thing.mqtt.connect()

def send_blockchain():
    led_start_transaction()
    temp, hum = sensor.get_temp(), sensor.get_hum()
    send_eth_transaction(temp, hum)
    led_end_transaction()

def capsense_init():
  capsense.init()
  capsense.on_btn(ethereum_store)

def read_sensors():
  sensor = bme280.BME280(I2C0)
  while True:
      thing.mqtt.publish(TOPIC, {'temp': sensor.get_temp(), 'hum': sensor.get_hum()})
      sleep(3000)
`;

const TechPage = () => (
  <>
    <Head>
      <title>Zerynth - Embedded World 2019</title>
      <link href="/static/github.css" rel="stylesheet" />
      <link rel="icon" href="/static/favicon.png" />
    </Head>
    <Hero size="small">
      <Hero.Body style={{ textAlign: 'center' }}>
        <Image
          src="/static/zerynth_logo.png"
          style={{ maxWidth: 400, height: 90, margin: '0 auto' }}
        />
      </Hero.Body>
    </Hero>

  <LayoutWithSidebar left={<Sidebar active="Tech spec" />}>
      <Section paddingless>
        <Box>
          <Hero color="warning" style={{ marginBottom: '5vh' }}>
            <Hero.Body>
              <Heading size={3}>
                <Icon name="rocket" />
                &nbsp;
                <SplitText initialPose="exit" pose="enter" charPoses={charPoses}>
                  Sensors, cloud and blockchain made easy
                </SplitText>
              </Heading>
            </Hero.Body>
          </Hero>

            <Columns>
              <Columns.Column size="two-fifths">
                <PosedImg initialPose="exit" pose="enter" src="/static/cypress_board2.jpg" style={{ opacity: 0, maxWidth: '30vw' }} />
                <PosedImg initialPose="exit" pose="enter" src="/static/cypress_zerynth.png" style={{ opacity: 0, maxWidth: '30vw' }} />
              </Columns.Column>
              <Columns.Column>
                <PosedBox initialPose="exit" pose="enter">
                  <Highlight className="python">{ snippet }</Highlight>
                </PosedBox>
              </Columns.Column>
            </Columns>
        </Box>
      </Section>
    </LayoutWithSidebar>
  </>
);

export default TechPage;
