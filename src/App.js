import _ from 'lodash';
import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import * as Survey from 'survey-react';
import "survey-react/survey.css";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const data = {
      title: "2018 全國性公民投票案",
      showQuestionNumbers: 'off',
      showCompletedPage: false,
      goNextPageAutomatic: true,
      pagePrevText: '前一問題',
      pageNextText: '沒意見',
      completeText: '請給我建議',
      pages: [{
        title: '問題 1',
        questions: [{
          type: "radiogroup",
          name: "q1a",
          title: "你是否支持 火力發電？",
          choices: ["支持", "反對"]
        }],
      }, {
        title: '問題 1.1',
        questions: [{
          visibleIf: "{q1a}='反對'",
          type: "radiogroup",
          name: "q1b",
          title: "你是否支持 以「平均每年至少降低 1%」之方式逐年降低火力發電量？",
          choices: ["支持", "反對"]
        }],
      }, {
        title: '問題 2',
        questions: [{
          type: "radiogroup",
          name: "q2",
          title: "你是否支持 燃煤發電？",
          choices: ["支持", "反對"]
        }]
      }, {
        title: '問題 3',
        questions: [{
          type: "radiogroup",
          name: "q3",
          title: "你是否支持 開放核災食品進口？",
          choices: ["支持", "反對"]
        }]
      }, {
        title: '問題 4',
        questions: [{
          type: "radiogroup",
          name: "q4",
          title: "你是否支持 婚姻平權？",
          choices: ["支持", "反對"]
        }]
      }, {
        title: '問題 5',
        questions: [{
          type: "radiogroup",
          name: "q5",
          title: "你是否支持 在國民教育階段應實施性別平等教育？",
          choices: ["支持", "反對"]
        }]
      }, {
        title: '問題 6',
        questions: [{
          type: "radiogroup",
          name: "q6",
          title: "你是否支持 使用『台灣』參加奧運？",
          choices: ["支持", "反對"]
        }]
      }, {
        title: '問題 7',
        questions: [{
          type: "radiogroup",
          name: "q7",
          title: "你是否支持 核能發電？",
          choices: ["支持", "反對"]
        }]
      }]
    };

    this.model = new Survey.Model(data);
  }

  state = {
    results: null,
    ready: false,
  }

  onDownload = () => {
    html2canvas(document.getElementById('results')).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'g0v.png';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
    });
  }

  onClick = () => this.setState({ ready: true });

  onComplete = result => this.setState({ results: result.data });

  renderAnswer(idx, results) {
    if (idx === 0) {
      if (results.q1a === undefined || results.q1b === undefined) {
        return '不投票';
      }
      if (results.q1a === '支持') return '不同意';
      else if (results.q1b === '反對') return '不同意';
      return '同意';
    } else if (idx === 1) {
      if (results.q2 === undefined) return '不投票';
      if (results.q2 === '支持') return '不同意'
      return '同意'
    } else if (idx === 2) {
      if (results.q3 === undefined) return '不投票';
      if (results.q3 === '支持') return '不同意'
      return '同意'
    } else if (idx === 3) {
      if (results.q4 === undefined) return '不投票';
      if (results.q4 === '支持') return '不同意'
      return '同意'
    } else if (idx === 4) {
      if (results.q5 === undefined) return '不投票';
      if (results.q5 === '支持') return '不同意'
      return '同意'
    } else if (idx === 5) {
      if (results.q4 === undefined) return '不投票';
      if (results.q4 === '支持') return '不同意'
      return '同意'
    } else if (idx === 6) {
      if (results.q6 === undefined) return '不投票';
      if (results.q6 === '支持') return '同意'
      return '不同意'
    } else if (idx === 7) {
      if (results.q4 === undefined) return '不投票';
      if (results.q4 === '支持') return '同意'
      return '不同意'
    } else if (idx === 8) {
      if (results.q5 === undefined) return '不投票';
      if (results.q5 === '支持') return '同意'
      return '不同意'
    } else if (idx === 9) {
      if (results.q7 === undefined) return '不投票';
      if (results.q7 === '支持') return '同意'
      return '不同意'
    }

    return '';
  }

  render() {
    const { model } = this;
    const { results, ready } = this.state;

    if (!ready) {
      return (
        <div className="enter">
          <h3><span>2018 全國性公民投票案</span></h3>
          <div className="main">
            <span>透過工具回答 7 個問題，<br />將產生適合你的公投小抄</span>
            <button className="button" onClick={this.onClick}>開始使用</button>
          </div>
          <div className="footer">此工具由 yutin 及 g0v 社群協作完成，程式授權採 MIT License，有任何錯誤可至 https://github.com/g0v/referendum 提出修正。</div>
        </div>
      );
    }

    if (results) {
      return (
        <div className="results" id="results">
          <h3><span>2018 全國性公民投票案</span></h3>
          {_.map([
            '第七案：你是否同意以「平均每年至少降低1%」之方式逐年降低火力發電廠發電量？',
            '第八案：您是否同意確立「停止新建、擴建任何燃煤發電廠或發電機組（包括深澳電廠擴建）」之能源政策？',
            '第九案：你是否同意政府維持禁止開放日本福島311核災相關地區，包括福島與周遭4縣市（茨城、櫪木、群馬、千葉）等地區農產品及食品進口？',
            '第十案：你是否同意民法婚姻規定應限定在一男一女的結合？',
            '第十一案：你是否同意在國民教育階段內（國中及國小），教育部及各級學校不應對學生實施性別平等教育法施行細則所定之同志教育？',
            '第十二案：你是否同意以民法婚姻規定以外之其他形式來保障同性別二人經營永久共同生活的權益？',
            '第十三案：你是否同意，以「台灣」（Taiwan）為全名申請參加所有國際運動賽事及2020年東京奧運？',
            '第十四案：您是否同意，以民法婚姻章保障同性別二人建立婚姻關係？',
            '第十五案：您是否同意，以「性別平等教育法」明定在國民教育各階段內實施性別平等教育，且內容應涵蓋情感教育、性教育、同志教育等課程？',
            '第十六案：是否同意：廢除電業法第95條第1項，即廢除「核能發電設備應於中華民國一百十四年以前，全部停止運轉」之條文？',
          ], (question, idx) => (
            <div className="items" key={`q${idx}`}>
              <div className="question">{question}</div>
              <div className="answer">{this.renderAnswer(idx, results)}</div>
            </div>
          ))}
          <button className="button" onClick={this.onDownload}>下載我的小抄</button>
          <div>
            <a href="https://hackmd.io/c/Hk7SAIH6Q/" target="hackmd">
              更多說明請參考公投公報電子書
            </a>
          </div>
        </div>
      );
    }

    return (
      <Survey.Survey
        model={model}
        onComplete={this.onComplete}
      />
    );
  }
}

export default App;
