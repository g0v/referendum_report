const _ = require('lodash');
const fs = require('fs');
const stringify = require('csv-stringify/lib/sync');
const parse = require('csv-parse/lib/sync');
const final = require('./RFfinal.json');

const stations = _.map(
  parse(fs.readFileSync(`${__dirname}/stations.csv`)),
  ([省市代碼, 縣市代碼, 鄉鎮市區代碼, 編號, 縣市, 鄉鎮市區, 里, 鄰, 投開票所, 地址]) => ({ 省市代碼, 縣市代碼, 鄉鎮市區代碼, 編號, 縣市, 鄉鎮市區, 里, 鄰, 投開票所, 地址 }),
);

const results = {
  'F1': '第7案：你是否同意以「平均每年至少降低1%」之方式逐年降低火力發電廠發電量？',
  'F2': '第8案：您是否同意確立「停止新建、擴建任何燃煤發電廠或發電機組（包括深澳電廠擴建）」之能源政策？',
  'F3': '第9案：你是否同意政府維持禁止開放日本福島311核災相關地區，包括福島與周遭4縣市（茨城、櫪木、群馬、千葉）等地區農產品及食品進口？',
  'F4': '第10案：你是否同意民法婚姻規定應限定在一男一女的結合?',
  'F5': '第11案：你是否同意在國民教育階段內（國中及國小），教育部及各級學校不應對學生實施性別平等教育法施行細則所定之同志教育？',
  'F6': '第12案：你是否同意以民法婚姻規定以外之其他形式來保障同性別二人經營永久共同生活的權益？',
  'F7': '第13案：你是否同意，以「台灣」（Taiwan）為全名申請參加所有國際運動賽事及2020年東京奧運？',
  'F8': '第14案：您是否同意，以民法婚姻章保障同性別二人建立婚姻關係？',
  'F9': '第15案：您是否同意，以「性別平等教育法」明定在國民教育各階段內實施性別平等教育，且內容應涵蓋情感教育、性教育、同志教育等課程？',
  'FA': '第16案：您是否同意：廢除電業法第95條第1項，即廢除「核能發電設備應於中華民國一百十四年以前，全部停止運轉」之條文？',
};

_.forEach(results, (title, key) => {
  const data = [[
    '案件', '縣市', '鄉鎮市區', '里', '鄰', '編號', '投開票所', '地址',
    '同意票數', '不同意票數', '有效票數', '無效票數', '投票數',
    '已領未投票數', '發出票數', '用於票數', '投票權人數', '投票率(%)',
    '有效同意票數對投票權人數百分比(%)', '有效不同意票數對投票權人數百分比(%)', '有效同意與不同意票數對投票權人數百分比差值'
  ]];

  const [, 案件] = /^(第\d+案)/i.exec(title);

  _.forEach(final[key], ({
    prvCode, cityCode, deptCode, tboxNo,
    agreeTks, disagreeTks, adptVictor,
    prof1, prof2, prof3, prof4, prof5, prof6, prof7,
    profRate, ytpRate, deptTot, deptRcv, tboxTot, tboxRcv, prgRate,
  }) => {
    if (!(prvCode && cityCode && deptCode && tboxNo)) return;
    const { 編號, 縣市, 鄉鎮市區, 里, 鄰, 投開票所, 地址 } = _.find(stations, { 省市代碼: prvCode, 縣市代碼: cityCode, 鄉鎮市區代碼: deptCode, 編號: _.padStart(tboxNo, 4, '0') });
    console.log(案件, 縣市, 鄉鎮市區, 編號);
    const base = Number(prof7);
    const agreeRate = (agreeTks / base * 100).toFixed(2);
    const disagreeRate = (disagreeTks / base * 100).toFixed(2);
    data.push([
      案件, 縣市, 鄉鎮市區, 里, 鄰, 編號, 投開票所, 地址,
      agreeTks, disagreeTks, prof1, prof2, prof3,
      prof4, prof5, prof6, prof7, `${profRate}%`,
      `${agreeRate}%`, `${disagreeRate}%`, (agreeRate - disagreeRate).toFixed(2),
    ]);
  });

  fs.writeFileSync(`results2/${title}.csv`, stringify(data));
});
