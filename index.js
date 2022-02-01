const fs = require('fs');
const pdfreader = require('pdfreader');
const download = require('download');

(async ()=>{
    
const url = 'https://www.city.narashino.lg.jp/jigyosha/sangyo/cashless-payment/R03campaign.files/R03CP_list01.pdf';
await download(url, './public', {filename: 'shops.pdf'});

let rows = {};
let y;
const shops = [];
class Shop{
    constructor(name,area,address,industry,note1,note2,note3){
        this.name = name;
        this.area = area;
        this.address = address;
        this.industry = industry;
        this.note1 = note1;
        this.note2 = note2;
        this.note3 = note3;
    }
}

function printRows() {
    Object.keys(rows)
        .sort((y1, y2) => parseFloat(y1) - parseFloat(y2))
        .forEach((y) => {
            if(!/店舗名|令和|確認中|2022/.test(rows[y][0])) {
                shops.push(new Shop(...rows[y]));
            }
        });
}
new pdfreader.PdfReader().parseFileItems(
    "./public/shops.pdf",
    function (err, item) {
        if (!item || item.page) {
            printRows();
            // clear rows for next page
            rows = {};
            y = null;
            if(item == null) fs.writeFileSync('./public/shops.json',JSON.stringify(shops, null, '\t'));
        } else if (item.text) {
            if(y == null) y = item.y;
            if(item.y - y > 0.3) y = item.y;
            (rows[y] = rows[y] || []).push(item.text.replace(/\r?\n/g, ''));
        }
    }
);

})()
