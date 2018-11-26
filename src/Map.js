import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import map from './taiwan.json';

const Title = styled.div`
  font-size: 1em;
  position: relative;
  padding-left: 15px;
  color: #202020;
  margin-bottom: 5px;

  &:before {
    content: "";
    background: #000;
    display: block;
    width: 8px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const Toolbar = styled.div`
  display: flex;

  & button {
    background: transparent;
    padding: 2px 10px;
    margin: 0px 2px;
    outline: none !important;
    cursor: pointer;
  }
`;

const AwardBoard = styled.div`
  display: flex;
  margin-bttom: 20px;
  justify-content: space-around;
`;

const Board = styled.div`
  width: 240px;
`;

const Legend = styled.div`
`;

const draw = (results, color) => {
	const context = d3.select("#map").node().getContext("2d");
	const projection = d3.geoMercator().center([121,23,5]).scale(8000).translate([500,400]);
  const geoGenerator = d3.geoPath().projection(projection).context(context);
  const data = _.mapValues(_.mapKeys(results, 'key'), 'value');

  map.features.forEach(function(path, i) {
    const { properties: { COUNTYNAME, TOWNNAME } } = path;
    context.fillStyle = color(data[`${COUNTYNAME}${TOWNNAME}`] || 0);
    context.beginPath();
    geoGenerator(path);
    context.fill();
  });
}

const format = (data, key) => {
  return _.sortBy(_.map(_.filter(data, '地區'), (values) => ({
    key: `${values['縣市']}${values['地區']}`,
    value: Number(values[key].replace('%', '')),
  })), ({ value }) => (100 - value));
}

export default class extends React.Component {
  static defaultProps = {
    data: [],
  }

  state = {
    results: [],
    resultRights: [],
  }

  onYesClick = () => {
    const { data } = this.props;
    const results = format(data, '有效同意票數對投票權人數百分比(%)');
    this.setState({
      results: _.take(results, 10),
      resultRights: _.takeRight(results, 10),
    }, () => {
      draw(results, d3.scaleLinear().domain([0,_.max(_.map(results, 'value'))]).range(["#FFFFFF","#73B07B"]));
    });
  }

  onNoClick = () => {
    const { data } = this.props;
    const results = format(data, '有效不同意票數對投票權人數百分比(%)');
    this.setState({
      results: _.take(results, 10),
      resultRights: _.takeRight(results, 10),
    }, () => {
      draw(results, d3.scaleLinear().domain([0,_.max(_.map(results, 'value'))]).range(["#FFFFFF","#E78B93"]));
    });
  }

  onDiffClick = () => {
    const { data } = this.props;
    const results = format(data, '有效同意與不同意票數對投票權人數百分比(%)差值');
    this.setState({
      results: _.take(results, 10),
      resultRights: _.takeRight(results, 10),
    }, () => {
      draw(results, d3.scaleLinear().domain([20, -20]).range(["#3A8441","#DC3280"]));
    });
  }

  render() {
    const { results, resultRights } = this.state;
    return (
      <div>
        <Title>步驟二：請要查看 同意票 或 不同意票</Title>
        <Toolbar>
          <button onClick={this.onYesClick}>同意票</button>
          <button onClick={this.onNoClick}>不同意票</button>
          <button onClick={this.onDiffClick}>同意與不同意差值</button>
        </Toolbar>
        <canvas id="map" width="960" height="600" />
        {results.length >0 && (
          <AwardBoard>
            <Board>
              <Legend>前 10 名排序</Legend>
              <div>
                {_.map(results, ({key, value}) => (<div key={key}>{key} {value}</div>))}
              </div>
            </Board>
            <Board>
              <Legend>後 10 名排序</Legend>
              <div>
                {_.map(resultRights, ({key, value}) => (<div key={key}>{key} {value}</div>))}
              </div>
            </Board>
          </AwardBoard>
        )}
      </div>
    );
  }
}
