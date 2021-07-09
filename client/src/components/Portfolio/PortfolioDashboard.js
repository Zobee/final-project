import { Modal } from "@material-ui/core";
import { useEffect, useState } from "react";
import useCoinData from "../../hooks/useCoinData";
import PortfolioModalCoin from "./PortfolioModalCoin";
import DetailGraph from "../Coin/DetailGraph";
import CoinAsset from "./CoinAsset";
import { AiFillCloseCircle } from "react-icons/ai";
import SelectedCoinModalPage from "./SelectedCoinModalPage";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";

const PortfolioDashboard = ({ theme }) => {
  const { user, setUser } = useAuth();
  const [coins, loading] = useCoinData();
  const [updatePage, setUpdatePage] = useState(false);
  const [open, setOpen] = useState(false);
  const [clearPortfolioConfirm, setClearPortfolioConfirm] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  //Chart View State
  const [updatedCoinState, setUpdatedCoinState] = useState([]);
  const [chartIndex, setChartIndex] = useState(0);
  const chartViewData =
    updatedCoinState.length > 0 ? updatedCoinState[chartIndex].chartData : null;
  const chartViewCoin =
    updatedCoinState.length > 0 ? updatedCoinState[chartIndex].coin : null;

  useEffect(() => {
    setUpdatePage(true)
    if (user.portfolio.coins.length === 0) {
      setUpdatedCoinState([])
      setUpdatePage(false)
    }
    else {
      user.portfolio.coins.map(coin => {
        axios.get(`http://localhost:3001/api/coins/${coin.id}`)
        .then(res => {
          const { coin, dailyChart, weeklyChart, monthlyChart } = res.data;
          setUpdatedCoinState((prev) => {
            if (prev.length === 0) {
              return [
                ...prev,
                { coin, chartData: { dailyChart, weeklyChart, monthlyChart } },
              ];
            }
            if (prev.some((val) => val.coin.id === coin.id)) {
              return [...prev];
            }
    
            return [
              ...prev,
              { coin, chartData: { dailyChart, weeklyChart, monthlyChart } },
            ];
          });
        })
        .then(() => setUpdatePage(false))
      })
    }
  },[user])
  
  const getPortfolioBalance = () => {
    let total = 0;
    for (let coin of user.portfolio.coins) {
      total += coin.purchasePrice;
    }
    return total;
  };

  const filterCoinList = () => {
    return coins
      .filter((coin) =>
        searchTerm
          ? coin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase() === searchTerm.toLocaleLowerCase()
          : true
      )
      .map((coin, ind) => (
        <PortfolioModalCoin
          key={ind}
          coin={coin}
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
        />
      ));
  };

  const updateCoin = (id, quantity, purchasePrice) => {
    //If user.portfolio doesn't have coin
    setUpdatePage(true)
    if (user.portfolio.coins.length === 0) {
      axios
        .post(
          `http://localhost:3001/api/portfolios/${id}`,
          { quantity, purchasePrice },
          { headers: { "auth-token": localStorage.getItem("auth-token") } }
        )
        .then((res) => setUser(res.data.user))
        .then(() => setUpdatePage(false))
        .catch((err) => console.log(err));
    } else {
      // If coin already exists in user's portfolio
      if (user.portfolio.coins.filter((coin) => coin.id === id).length > 0) {
        axios
          .put(
            `http://localhost:3001/api/portfolios/${id}`,
            { quantity, purchasePrice },
            { headers: { "auth-token": localStorage.getItem("auth-token") } }
          )
          .then((res) => setUser(res.data.user))
          .then(() => setUpdatePage(false))
          .catch((err) => console.log(err));
      } else {
        axios
          .post(
            `http://localhost:3001/api/portfolios/${id}`,
            { quantity, purchasePrice },
            { headers: { "auth-token": localStorage.getItem("auth-token") } }
          )
          .then((res) => setUser(res.data.user))
          .then(() => setUpdatePage(false))
          .catch((err) => console.log(err));
      }
    }
  };

  const removeCoin = (coinId) => {
    setUpdatePage(true);
    axios
      .delete(`http://localhost:3001/api/portfolios/${coinId}`, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => setUser(res.data.user))
      .then(() => setUpdatePage(false))
      .catch((err) => console.log(err));
  };

  const clearPortfolio = () => {
    setUpdatePage(true);
    axios
      .delete("http://localhost:3001/api/portfolios/", {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => setUser(res.data.user))
      .then(() => setUpdatePage(true))
      .catch((err) => console.log(err));
  };

  const setChartView = (i) => {
    setChartIndex(i);
  };

  const body = (
    <div className="modal">
      {selectedCoin ? (
        <SelectedCoinModalPage
          selectedCoin={selectedCoin}
          setSelectedCoin={setSelectedCoin}
          setOpen={setOpen}
          updateCoin={updateCoin}
        />
      ) : (
        <>
          <h1 className="modal-title" id="simple-modal-title">
            Select Coin
          </h1>
          <form className="modal-form">
            <input
              type="text"
              placeholder="Find a coin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
          {loading ? null : (
            <div className="modal-coin-list">{filterCoinList()}</div>
          )}
          <AiFillCloseCircle
            className="modal-close"
            onClick={() => setOpen(false)}
          />
        </>
      )}
    </div>
  );

  if (updatePage) return <h1>loading...</h1>;

  return (
    <div
      className={`portfolio-dashboard ${
        theme === "light" ? "light-dashboard" : null
      }`}
    >
      <div
        className={`portfolio-banner ${
          theme === "light" ? "light-dashboard light-box" : null
        }`}
      >
        <div className="portfolio-banner-left">
          <div>
            <h1>Welcome Back {user.name}</h1>
            <h2>{user.portfolio.name}</h2>
          </div>
          <div>
            <h2>Balance: {getPortfolioBalance()}</h2>
          </div>
        </div>
        <div className="portfolio-banner-right">
          <button onClick={() => setOpen(true)}>Add Coin:</button>
        </div>
      </div>
      <div className="portfolio-info-container">
        <div
          className={`portfolio-graph ${
            theme === "light" ? "light-dashboard" : null
          }`}
        >
          <h1>Graph:</h1>

          {updatedCoinState.length > 0 ? (
            <DetailGraph coin={chartViewCoin} chartData={chartViewData} />
          ) : null}
        </div>

        <div
          className={`portfolio-coin-data ${
            theme === "light" ? "light-dashboard light-box" : null
          }`}
        >
          <h1>Your Assets:</h1>
          <p
            className="clear-portfolio-btn"
            onClick={() => setClearPortfolioConfirm(true)}
          >
            Clear Portfolio
          </p>

          {updatedCoinState.map((coinData, ind) => (
            <CoinAsset
              key={ind}
              userCoinData={user.portfolio.coins.find(coin => coin.id === coinData.coin.id)}
              coin={coinData.coin}
              updateCoin={updateCoin}
              removeCoin={removeCoin}
              onClick={() => setChartView(ind)}
            />
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
      >
        {body}
      </Modal>

      <Modal
        open={clearPortfolioConfirm}
        onClose={() => setClearPortfolioConfirm(false)}
        aria-labelledby="simple-modal-title"
      >
        <div className="clear-portfolio-modal">
          <h1>Are you sure?</h1>
          <button onClick={clearPortfolio}>Yes</button>
          <button onClick={() => setClearPortfolioConfirm(false)}>No</button>
        </div>
      </Modal>
    </div>
  );
};

export default PortfolioDashboard;
