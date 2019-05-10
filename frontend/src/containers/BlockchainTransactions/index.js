import React, { Component } from 'react';
import { withRouter } from 'next/router';
import {
  Image,
  Table,
  Level,
  Heading,
  Notification,
} from 'react-bulma-components';
import posed, { PoseGroup } from 'react-pose';
import socket from '../../utilities/websocket';
import bufferpack from 'bufferpack';

const INTERVAL = 2000;
const FROM_BLOCK = '5044367';
const WHITELIST = [
  '0xd00f24e58276e4d4d1f8f3ec797f1719704f3e87',
  '0x6f62ec4b1d0b3184ca79ae589b7c3a65c52ece0f',
];

const eth_address = '0x66B4f2b7F5F2B8F6faCBfCc9336218DfF08e07f5';
const etherscan_key = 'D54ZMN7Y95MSG6988Y1RZRRINGYZGMU7NX';

const prettyLogo = {
  rs: <Image src="/static/rs_logo_small.jpg" style={{ maxWidth: 35 }} />,
  cypress: <Image src="/static/cypress_logo_small.png" style={{ maxWidth: 35 }} />,
};

const PoseTr = posed.tr({
  enter: { opacity: 1 },
});

const PosedLogo = posed.img({
  small: { scale: 1 } ,
  large: {
    scale: 1.2,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 5
    }
  },
});

const PosedNotification = posed(Notification)({
  waitingTx: { background: 'rgb(255, 71, 15)', color: 'rgb(255, 255, 255)' },
  normal: { background: 'rgb(255, 221, 87)', color: 'rgb(74, 74, 74)' },
});

const fetchTransactions = async (from_block) => {
  const etherscan_api = `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${eth_address}&startblock=${from_block}&endblock=99999999&sort=desc&apikey=${etherscan_key}`;
  return await fetch(etherscan_api);
}

const toByteArray = (hexString) => {
  const result = [];
  while (hexString.length >= 2) {
      result.push(parseInt(hexString.substring(0, 2), 16));
      hexString = hexString.substring(2, hexString.length);
    }
  return result;
}

const extractDataFromTransaction = ({ timeStamp, input }) => {
  const [temp, hum] = bufferpack.unpack('<iI', toByteArray(input.slice(2)));
  const isRS = input.slice(-2) === '01';
  return {
    temp: temp/100,
    hum: hum/100,
    stand: isRS ? 'rs' : 'cypress',
    time: timeStamp * 1000
  };
}

const getCounters = (tx_list) => (
  tx_list.reduce(
    (acc, { stand }) => ({
      ...acc,
      [stand]: acc[stand] + 1,
    }),
    { rs: 0, cypress: 0 }
  )
);

class BlockchainTransactions extends Component {
  stand = null;
  ack_block = FROM_BLOCK;
  state = {
    data: [],
    waitingTxFromStand: null,
    counters: { rs: 0, cypress: 0 },
  };

  componentDidMount = async () => {
    this.stand = this.props.router.query.stand;
    this.interval = setInterval(this.updateData, INTERVAL);
    socket.on(`ew/${this.stand}/sensors`, this.capsenseTrigger);

    try {
      const etherscan_result = await fetchTransactions(FROM_BLOCK);
      if (etherscan_result.status === '1') {
        const counters = getCounters(etherscan_result.result.map(extractDataFromTransaction));
        this.setState({ counters });
      }
    } catch (err) {
      console.error(err);
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
    socket.off(`ew/${this.stand}/sensors`, this.capsenseTrigger);
  }

  updateData = async (message) => {
    const request = await fetchTransactions(this.ack_block);
    const transactions = await request.json();

    if (transactions.status != '1' || transactions.result.length == 0) {
      return;
    }

    this.ack_block = parseInt(transactions.result[0].blockNumber, 10) + 1;

    const newData = transactions.result
      .filter(({ from }) => (WHITELIST.includes(from)))
      .map(extractDataFromTransaction);
      // .map(({ timeStamp, input }) => ({
      //   time: timeStamp * 1000,
      //   ...extractDataFromTransaction(input)
      // }));

    const newCounters = getCounters(newData);
    const receivedFromOurStand = newCounters[this.stand] > 0;

    this.setState(({ data, waitingTxFromStand, counters }) => ({
      data: [...newData, ...data].slice(0, 25),
      waitingTxFromStand: waitingTxFromStand && !receivedFromOurStand,
      counters: {
        rs: counters.rs + newCounters.rs,
        cypress: counters.cypress + newCounters.cypress,
      }
    }));
  }

  capsenseTrigger = ({ touch }) => {
    if (touch) {
      this.setState({ waitingTxFromStand: this.stand });
    }
  }

  render = () => {
    const { data, counters, waitingTxFromStand } = this.state;

    return (
      <>
        <Level>
          <Level.Side align="left">
            <Level.Item>
              <Heading weight="normal">{counters['rs']}</Heading>
            </Level.Item>
            <Level.Item>
              <PosedLogo
                pose={data.length > 0 && data[0].stand == 'rs' ? 'large' : 'small'}
                src="/static/rs_logo_small.jpg"
                style={{ width: 50 }}
              />
            </Level.Item>
          </Level.Side>
          <Level.Side align="left">
            <Level.Item>
              <Heading weight="normal">{counters['cypress']}</Heading>
            </Level.Item>
            <Level.Item>
              <PosedLogo
                pose={data.length > 0 && data[0].stand == 'cypress' ? 'large' : 'small'}
                src="/static/cypress_logo_small.png"
                style={{ width: 50 }}
              />
            </Level.Item>
          </Level.Side>
        </Level>

        <PosedNotification pose={waitingTxFromStand ? 'waitingTx' : 'normal'}>
          { waitingTxFromStand ?
            'Button press received. Waiting for the transaction to be accepted...' :
            'Touch the capsense button on the board to send a transaction to the Ethereum blockchain!'
          }
        </PosedNotification>


        <Table>
          <thead>
            <tr>
              <th>Temp</th>
              <th>Hum</th>
              <th>Time</th>
              <th>Stand</th>
            </tr>
          </thead>

          <tbody>
            <PoseGroup>
              { data.map(({ temp, hum, time, stand }) => (
                <PoseTr key={`${time}${stand}`}>
                  <td>{temp} °C</td>
                  <td>{hum}%</td>
                  <td>{(new Date(time)).toLocaleTimeString()}</td>
                  <td>{prettyLogo[stand] || stand}</td>
                </PoseTr>
              ))}
            </PoseGroup>
          </tbody>

        </Table>
      </>
    );
  }
}


export default withRouter(BlockchainTransactions);
