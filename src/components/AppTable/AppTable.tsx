import React, { useEffect, useState } from "react";
import "./AppTable.css";
import { Coin } from "../../Coin";
import LineChart from "../LineChart";

interface IProps {
  state: {
    coins: Coin[];
    total: number;
    currentPage: number;
    limitPerPage: number;
    totalPages: number;
    orderBy: string;
    orderDirection: string;
  };
  orderChange: (order: string) => void;
}

interface Column {
  title: string;
  param: string;
  active: boolean;
}

const AppTable = ({
  state: {
    coins,
    limitPerPage,
    total,
    currentPage,
    totalPages,
    orderBy,
    orderDirection,
  },
  orderChange,
}: IProps) => {
  const [columns, setColumns] = useState<Column[]>([
    {
      title: "Price",
      param: "price",
      active: false,
    },
    {
      title: "Market Cap",
      param: "marketCap",
      active: true,
    },
    {
      title: "24h",
      param: "24h",
      active: false,
    },
  ]);

  function formatPrice(price: string) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return formatter.format(parseFloat(price));
  }

  function formatBillionPrice(price: string) {
    const bPrice =
      "$" + (Math.abs(Number(price)) / 1.0e9).toFixed(2) + " billion";
    return bPrice;
  }

  function prepareDataset(coin: Coin) {
    const data = coin.sparkline.map((item) => parseFloat(item));
    return data;
  }

  const getRows = () => {
    return coins.map((coin) => (
      <tr key={coin.uuid}>
        <td>
          <img src={coin.iconUrl} alt="Coin Alt" />
          <div className="name">
            <h4 style={{ color: coin.color }}>{coin.name}</h4>
            <p>{coin.symbol}</p>
          </div>
        </td>
        <td className="price">{formatPrice(coin.price)}</td>
        <td className="market-cap">{formatBillionPrice(coin.marketCap)}</td>
        <td className="chart">
          <LineChart dataset={prepareDataset(coin)} title={coin.change} />
        </td>
      </tr>
    ));
  };

  const getTHeadIcons = (newOrder: string, index: number) => {
    const iconClass = `
      fa-solid
      ${
        orderDirection === "desc"
          ? "fa-arrow-down-wide-short"
          : "fa-arrow-up-wide-short"
      }
      ${columns[index].active === true ? "active" : ""}
    `;
    const handleIconClick = () => {
      const updatedColumns = columns.map((col, i) => ({
        ...col,
        active: i === index,
      }));
      orderChange(newOrder);
      setColumns(updatedColumns);
    };
    return <i className={iconClass} onClick={handleIconClick}></i>;
  };

  const getTHeadRow = () => {
    return columns.map((col, index) => (
      <th key={index}>
        {col.title}
        <>{getTHeadIcons(col.param, index)}</>
      </th>
    ));
  };

  // useEffect(() => {
  //   console.log(orderBy, orderDirection);
  // }, [orderBy, orderDirection]);

  return (
    <table>
      <thead>
        <tr>
          <th>Coins</th>
          {getTHeadRow()}
        </tr>
      </thead>
      <tbody>{getRows()}</tbody>
    </table>
  );
};

export default AppTable;
