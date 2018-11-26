import React, { Component } from 'react';
import styled from 'styled-components';
import window from 'global/window';
import Menu from './Menu';
import Map from './Map';

const { d3 } = window;

const Document = styled.div`;
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
`;

const Head = styled.div`
  display: flex;
  justify-content: flex-end;
  position: relative;
  height: 40px;
`;

const Title = styled.div`
  width: 100%;
  font-size: 1.5em;
  position: absolute;
  left: 0;
  top: 0;
`;

const Tip = styled.div`
  font-size: 0.5em;
  margin: 0 0 0 3px;

  & a {
    color: #202020;
  }
`;

export default class extends Component {
  state = {
    title: '',
    data: [],
  }

  onChangeCase = async (title, idx) => {
    if (idx < 0) {
      this.setState({ title, data: [] });
      return;
    }

    const data = await d3.csv(`./data/${idx+7}.csv`);
    delete data.columns;
    this.setState({ title, data });
  }

  render() {
    const { title, data } = this.state;

    return (
      <Document>
        <Head>
          <Title>2018 公投結果資料視覺化</Title>
          <Tip>專案：<a href="https://g0v.tw/">零時政府 g0v.tw</a> 協作</Tip>
          <Tip>資料來源：<a href="http://referendum.2018.nat.gov.tw/pc/zh_TW/00/00000000000000000.html">中選會</a></Tip>
        </Head>
        <Menu title={title} onClick={this.onChangeCase} />
        {data.length > 0 && <Map data={data} onClick={() => {}} />}
      </Document>
    );
  }
}
