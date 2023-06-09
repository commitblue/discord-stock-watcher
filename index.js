import { config } from "dotenv";
config();
import fetch from "node-fetch";
function hexToDecimal(hex) {
    return parseInt(hex.replace("#", ""), 16);
}
async function fetchRobloxStocks() {
    const ftch = await fetch("https://www.google.com/finance/quote/RBLX:NYSE");
    const text = await ftch.text();
    let constructedString = text.match(/(\$(\d+(\.(\d+))))/gm
    //, text.search("<div class=\"YMlKec fxKbKc\">")
    );
    return Number(constructedString[0]);
}
fetchRobloxStocks();
let lastStockResult = 0;
async function loop() {
    try {
        const stockNumber = await fetchRobloxStocks();
        if (!(lastStockResult === stockNumber)) {
            let percentageString = "";
            if (stockNumber > lastStockResult) {
                percentageString = `Stock increased by ${Math.floor((stockNumber - lastStockResult) / lastStockResult * 100)}%`;
            }
            else {
                percentageString = `Stock decreased by ${Math.floor((lastStockResult - stockNumber) / lastStockResult * 100)}%`;
            }
            let embed = {
                author: {
                    name: "ROBLOX STOCK"
                },
                "title": "$" + String(stockNumber),
                description: percentageString,
                color: hexToDecimal("#0000FF")
            };
            await fetch(process.env.webhookUrl, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    "embeds": [embed]
                })
            });
            lastStockResult = stockNumber;
        }
    }
    catch (err) {
        console.log(err);
    }
    setTimeout(loop, 2000);
}
loop();
