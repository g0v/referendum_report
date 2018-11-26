import React from 'react';
import styled from 'styled-components';
import window from 'global/window';

const { _ } = window;

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

const Button = styled.button`
  width: 100%;
  background: #F4F4F4;
  border: 1px solid #939393;
  padding: 10px;
  font-size: 1em;
  text-align: left;
  cursor: pointer;
  margin: 2px 0;
  outline: none !important;
  color: #202020;

  &:hover {
    background-color: #939393;
    color: #F4F4F4;
  }
`;

const TextButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  font-size: 1em;
  text-align: left;
  cursor: pointer;
  margin: 0 2px;
  outline: none !important;
  color: #202020;
  text-decoration: underline;
`;

const menu = [
  '第7案：你是否同意以「平均每年至少降低1%」之方式逐年降低火力發電廠發電量？',
  '第8案：您是否同意確立「停止新建、擴建任何燃煤發電廠或發電機組（包括深澳電廠擴建）」之能源政策？',
  '第9案：你是否同意政府維持禁止開放日本福島311核災相關地區，包括福島與周遭4縣市（茨城、櫪木、群馬、千葉）等地區農產品及食品進口？',
  '第10案：你是否同意民法婚姻規定應限定在一男一女的結合?',
  '第11案：你是否同意在國民教育階段內（國中及國小），教育部及各級學校不應對學生實施性別平等教育法施行細則所定之同志教育？',
  '第12案：你是否同意以民法婚姻規定以外之其他形式來保障同性別二人經營永久共同生活的權益？',
  '第13案：你是否同意，以「台灣」（Taiwan）為全名申請參加所有國際運動賽事及2020年東京奧運？',
  '第14案：您是否同意，以民法婚姻章保障同性別二人建立婚姻關係？',
  '第15案：您是否同意，以「性別平等教育法」明定在國民教育各階段內實施性別平等教育，且內容應涵蓋情感教育、性教育、同志教育等課程？',
  '第16案：您是否同意：廢除電業法第95條第1項，即廢除「核能發電設備應於中華民國一百十四年以前，全部停止運轉」之條文？',
];

export default class extends React.Component {
  static defaultProps = {
    title: null,
    onClick: _.identity,
  }

  state = {

  }

  onClick = (idx) => this.props.onClick(menu[idx], idx);

  render() {
    const { title } = this.props;

    if (title) {
      return (
        <div>
          <Title>{title}<TextButton onClick={() => this.onClick(-1)}>更換公投案</TextButton></Title>
        </div>
      );
    }

    return (
      <div>
        <Title>步驟一：請選擇想要了解的公投案</Title>
        <div>
          {_.map(menu, (title, idx) => (
            <Button key={`t${idx}`} onClick={() => this.onClick(idx)}>{title}</Button>
          ))}
        </div>
      </div>
    );
  }
}
