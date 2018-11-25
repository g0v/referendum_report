const _ = require('lodash');
const cheerio = require('cheerio');
const fs = require('fs');
const stringify = require('csv-stringify/lib/sync')

const results = {
  '01': '第7案：你是否同意以「平均每年至少降低1%」之方式逐年降低火力發電廠發電量？',
  '02': '第8案：您是否同意確立「停止新建、擴建任何燃煤發電廠或發電機組（包括深澳電廠擴建）」之能源政策？',
  '03': '第9案：你是否同意政府維持禁止開放日本福島311核災相關地區，包括福島與周遭4縣市（茨城、櫪木、群馬、千葉）等地區農產品及食品進口？',
  '04': '第10案：你是否同意民法婚姻規定應限定在一男一女的結合?',
  '05': '第11案：你是否同意在國民教育階段內（國中及國小），教育部及各級學校不應對學生實施性別平等教育法施行細則所定之同志教育？',
  '06': '第12案：你是否同意以民法婚姻規定以外之其他形式來保障同性別二人經營永久共同生活的權益？',
  '07': '第13案：你是否同意，以「台灣」（Taiwan）為全名申請參加所有國際運動賽事及2020年東京奧運？',
  '08': '第14案：您是否同意，以民法婚姻章保障同性別二人建立婚姻關係？',
  '09': '第15案：您是否同意，以「性別平等教育法」明定在國民教育各階段內實施性別平等教育，且內容應涵蓋情感教育、性教育、同志教育等課程？',
  '10': '第16案：您是否同意：廢除電業法第95條第1項，即廢除「核能發電設備應於中華民國一百十四年以前，全部停止運轉」之條文？',
};

_.forEach(results, (title, idx) => {
  const data = [['案件', '縣市', '地區', '同意票數','不同意票數','有效票數','無效票數','投票數','投票權人數','投票率(%)','有效同意票數對投票權人數百分比(%)', '有效不同意票數對投票權人數百分比(%)', '有效同意與不同意票數對投票權人數百分比(%)差值']];
  const dir = `${__dirname}/../raw/${idx}`;
  const files = fs.readdirSync(dir);

  _.forEach(files, (file) => {
    if (!/\.html$/.test(file)) return;
    const $ = cheerio.load(fs.readFileSync(`${dir}/${file}`));
    const content = $('#divContent tr');
    const label = content.eq(0).find('td').eq(1).text().replace(/\s公民投票結果\s-\s/, '_');
    console.log(title, label);
    const names = /^(.+)_([^縣市國]+[縣市國])(.*)/.exec(label);
    const resultA = content.eq(3).find('table').eq(0).find('.trT td').map((i, td) => $(td).text()).get();
    const resultB = content.eq(3).find('table').eq(1).find('.trT td').map((i, td) => $(td).text()).get();
    const no = `${(parseInt(resultA[1].replace(/,/g, '')) / parseInt(resultB[1].replace(/,/g, '')) * 100).toFixed(2)}%`;
    const difference = (parseFloat(resultB[3].replace('%', '')) - parseFloat(no.replace('%', ''))).toFixed(2);
    data.push([names[1], names[2], names[3], ...resultA, ...resultB, no, difference]);
  });

  fs.writeFileSync(`results/${title}.csv`, stringify(data));
});
