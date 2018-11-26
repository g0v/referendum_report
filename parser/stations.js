const _ = require('lodash');
const fs = require('fs');
const stringify = require('csv-stringify/lib/sync')
const parse = require('csv-parse/lib/sync')

const dir = `${__dirname}/../raw_stations`;
const files = fs.readdirSync(dir);

const village = _.map(
  parse(fs.readFileSync(`${__dirname}/村里代碼.csv`)),
  ([prvCode, cityCode, deptCode, villageCode, name]) => ({ prvCode, cityCode, deptCode, villageCode, name }),
);

const district = _.map(
  parse(fs.readFileSync(`${__dirname}/縣市及鄉鎮市區代碼.csv`)),
  ([prvCode, cityCode, deptCode, name]) => ({ prvCode, cityCode, deptCode, name }),
);

const results = [['省市代碼', '縣市代碼', '鄉鎮市區代碼', '編號', '縣市', '鄉鎮市區', '里', '鄰', '投開票所', '地址']];

const convertToCity = (prvCode, cityCode, deptCode, villageCode, vName) => {
  const check = _.find(village, { prvCode, cityCode, deptCode, villageCode, name: vName });
  if (!check) throw new Error();
  const { name: dName } = _.find(district, { prvCode, cityCode, deptCode });
  const { name: cName } = _.find(district, { prvCode, cityCode, deptCode: '000' });
  return [deptCode, cName, dName];
}

_.forEach(files, (file) => {
  if (!/\.json$/.test(file)) return;
  const [, prvCode, cityCode] = /(\d{2})(\d{3})/.exec(file);
  const data = require(`${__dirname}/../raw_stations/${file}`).pollstations;
  _.forEach(data, (item) => {
    if (item['VType'] !== '01') return;
    const [deptCode, cName, dName] = convertToCity(prvCode, cityCode, item['T'], item['V'], item['VName']);
    results.push([
      prvCode, cityCode, deptCode,
      item['PNO'],
      ...[cName, dName],
      ..._.map(
        ['VName', 'VoteScopeNeighborhood', 'PSName', 'Addr'],
        name => item[name],
      ),
    ])
  });
});

fs.writeFileSync(`${__dirname}/stations.csv`, stringify(results));
