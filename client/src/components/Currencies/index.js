import React from "react";
import TableTitle from "./TableTitle";
import CurrencyTable from "./CurrencyTable";

export default function Cryptocurrencies() {
  const data = [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image:
        "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
      current_price: 34682,
      market_cap: 650869560416,
      market_cap_rank: 1,
      fully_diluted_valuation: 729087178650,
      total_volume: 22766841138,
      high_24h: 34924,
      low_24h: 33174,
      price_change_24h: 1257.03,
      price_change_percentage_24h: 3.76078,
      market_cap_change_24h: 24161151719,
      market_cap_change_percentage_24h: 3.85525,
      circulating_supply: 18747087,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 64805,
      ath_change_percentage: -46.42388,
      ath_date: "2021-04-14T11:54:46.763Z",
      atl: 67.81,
      atl_change_percentage: 51102.42751,
      atl_date: "2013-07-06T00:00:00.000Z",
      roi: null,
      last_updated: "2021-07-03T18:24:23.220Z",
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image:
        "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
      current_price: 2357.81,
      market_cap: 274666618359,
      market_cap_rank: 2,
      fully_diluted_valuation: null,
      total_volume: 20880000308,
      high_24h: 2370.62,
      low_24h: 2195.5,
      price_change_24h: 133.64,
      price_change_percentage_24h: 6.00872,
      market_cap_change_24h: 14785729661,
      market_cap_change_percentage_24h: 5.68943,
      circulating_supply: 116558742.999,
      total_supply: null,
      max_supply: null,
      ath: 4356.99,
      ath_change_percentage: -45.91527,
      ath_date: "2021-05-12T14:41:48.623Z",
      atl: 0.432979,
      atl_change_percentage: 544145.18375,
      atl_date: "2015-10-20T00:00:00.000Z",
      roi: {
        times: 87.65135689672238,
        currency: "btc",
        percentage: 8765.135689672237,
      },
      last_updated: "2021-07-04T19:04:41.990Z",
    },
  ];
  return (
    <div className="currencies-page">
      <TableTitle data={data} />
      <CurrencyTable data={data} />
    </div>
  );
}
