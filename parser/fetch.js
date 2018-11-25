const _ = require('lodash');
const axios = require('axios');
const path = require('path');
const cheerio = require('cheerio');
const fs = require('fs');

const $ = cheerio.load(fs.readFileSync(`${__dirname}/menu.html`));

_.reduce(_.map($('a').toArray(), 'attribs.href'), async (result, href) => {
  await result;
  const file = /..(\/\d+\/\d+\.html)/.exec(href);

  if (!file) return;

  const url = `http://referendum.2018.nat.gov.tw/pc/zh_TW${file[1]}`
  const target = `${__dirname}/../raw${file[1]}`;

  if (!fs.existsSync(path.dirname(target))) fs.mkdirSync(path.dirname(target));
  if (fs.existsSync(target)) return;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`/> ${url}`);
  try {
    const response = await axios.get(url);
    fs.writeFileSync(target, response.data);
  } catch (e) {
    console.log(e);
    console.log(`/> ${url} FAILED`);
  }
}, Promise.resolve());
