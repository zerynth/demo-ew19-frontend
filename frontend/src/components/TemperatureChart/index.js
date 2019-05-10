import React, { Component } from 'react';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis,
  VictoryLegend,
} from 'victory';
import socket from '../../utilities/websocket';

const chartPadding = 40;
const suffixes = [" °C", "%"];
const colors = ["#F44336", "#3F51B5"];
const orientations = ["left", "right"];
const anchors = ["end", "start"];
const xOffsets = [chartPadding, chartPadding];

class TemperatureChart extends Component {
  state = {
    data: [
      [],
      [],
    ],
  };

  pushData = (message) => {
    const { temp, hum } = message;
    if (temp == undefined || hum == undefined) {
      return;
    }

    const timestamp = new Date();

    this.setState(oldState => ({
      data: [
        [...oldState.data[0], { x: timestamp, y: temp || 0.00001 }],
        [...oldState.data[1], { x: timestamp, y: hum || 0.00001 }],
      ]
    }));

    // Garbage collecting
    if (this.state.data[0].length > 500) {
      this.setState(oldState => ({
        data: [
          [...oldState.data[0].slice(-50)],
          [...oldState.data[1].slice(-50)],
        ]
      }));
    }
  };

  componentDidMount = () => {
    const { stand } = this.props;
    socket.on(`ew/${stand}/sensors`, this.pushData);
  };

  componentWillUnmount = () => {
    const { stand } = this.props;
    socket.off(`ew/${stand}/sensors`, this.pushData);
  }

  render = () => {
    const { color, legend } = this.props;
    const { data } = this.state;

    const now = +new Date();
    const oneMinuteAgo = now - 60 * 1000;

    const maxima = data.map(dataset => Math.max(...dataset.map((d) => d.y)));

    return (
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ y: [15, 15] }}
        domain={{ y: [0, 1], x: [oneMinuteAgo, now] }}
        animate={{ duration: 100 }}
        height={100}
        padding={{
          top: 0,
          bottom: 25,
          left: chartPadding,
          right: chartPadding,
        }}
      >

        {data.map((d, i) => (
          <VictoryLine
            key={i}
            data={d}
            style={{ data: { stroke: colors[i], strokeWidth: 0.75 } }}
            interpolation="natural"
            scale={{ x: 'time' }}
            // normalize data
            y={(datum) => datum.y / maxima[i]}
          />
        ))}

        {/* X Axis */}
        <VictoryAxis
          fixLabelOverlap
          crossAxis={false}
          tickFormat={(millis) => {
            const d = new Date(millis);
            return `${d.toLocaleTimeString()}`;
          }}
          style={{
            grid: { stroke: null },
            tickLabels: { fontSize: 6 }
          }}
        />

        {/* Y Axis */}
        {data.map((d, i) => (
          <VictoryAxis dependentAxis
            key={i}
            offsetX={xOffsets[i]}
            style={{
              grid: { stroke: null },
              tickLabels: {
                fontSize: 6,
                fill: colors[i],
                textAnchor: anchors[i]
              },
            }}
            orientation={orientations[i]}
            // Use normalized tickValues (0 - 1)
            tickValues={[0.25, 0.5, 0.75, 1]}
            // Re-scale ticks by multiplying by correct maxima
            tickFormat={t => (
              `${(t * maxima[i]).toFixed(2)}${suffixes[i]}`
            )}
          />
        ))}

        { legend ?
            <VictoryLegend
              x={40}
              y={-5}
              orientation="horizontal"
              gutter={10}
              style={{
                title: { fontSize: 6 },
                labels: { fontSize: 6 },
              }}
              data={[
                { name: "Temperature" }, { name: "Humidity" }
              ]}
              colorScale={colors}
            /> :
            null
        }
        </VictoryChart>
    );
  }
}

export default TemperatureChart;
