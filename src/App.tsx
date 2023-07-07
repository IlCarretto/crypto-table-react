import React, { useEffect, useState } from "react";
import "./App.css";
import {
  AppDataPerPage,
  AppHeader,
  AppPagination,
  AppSidebar,
  AppTable,
} from "./components";
import axios from "axios";

function App() {
  const apiKey = process.env.REACT_APP_API_KEY;
  const baseApiUrl = "https://api.coinranking.com/v2";
  const [state, setState] = useState({
    coins: [],
    total: 0,
    currentPage: 1,
    limitPerPage: 50,
    totalPages: 0,
    orderBy: "marketCap",
    orderDirection: "desc",
  });
  const [apiState, setApiState] = useState({
    loading: false,
    error: false,
    success: false,
  });

  async function getCoinsData() {
    try {
      setApiState({
        ...apiState,
        loading: true,
      });
      const params = new URLSearchParams({
        limit: state.limitPerPage.toString(),
        offset: (state.limitPerPage * (state.currentPage - 1)).toString(),
        orderBy: state.orderBy,
        orderDirection: state.orderDirection,
      });
      const response = await axios.get(`${baseApiUrl}/coins?${params}`, {
        headers: {
          Authorization: apiKey,
        },
      });
      const result = response.data;
      const totalPages = Math.ceil(
        result.data.stats.total / state.limitPerPage
      );
      setState({
        ...state,
        coins: result.data.coins,
        total: result.data.stats.total,
        totalPages,
      });
      setApiState({
        loading: false,
        error: false,
        success: true,
      });
    } catch (error) {
      console.log(error, "Errore nella richiesta dei dati");
      setApiState({
        loading: false,
        success: false,
        error: true,
      });
    }
  }

  const handleOrderChange = (value: string) => {
    if (value !== state.orderBy) {
      setState({
        ...state,
        orderBy: value,
      });
    } else {
      setState({
        ...state,
        orderDirection: state.orderDirection === "desc" ? "asc" : "desc",
      });
    }
  };

  function handleLimitChange(value: number) {
    const maxLimit = 100;
    const minLimit = 1;
    if (value <= maxLimit && value >= minLimit) {
      setState({
        ...state,
        limitPerPage: value,
      });
    } else {
      setState({
        ...state,
        limitPerPage: 50,
      });
    }
  }

  function handlePaginationChange(value: number) {
    const maxLimit = state.totalPages;
    const minLimit = 1;
    if (value <= maxLimit && value >= minLimit) {
      setState({
        ...state,
        currentPage: value,
      });
    } else {
      setState({
        ...state,
        currentPage: 1,
      });
    }
  }

  function handlePrevBtn() {
    if (state.currentPage > 0 && state.currentPage !== 1) {
      setState({
        ...state,
        currentPage: state.currentPage - 1,
      });
    } else {
      setState({
        ...state,
        currentPage: state.totalPages,
      });
    }
  }

  function handleNextBtn() {
    if (state.currentPage < state.totalPages) {
      setState({
        ...state,
        currentPage: state.currentPage + 1,
      });
    } else {
      setState({
        ...state,
        currentPage: 1,
      });
    }
  }

  useEffect(() => {
    getCoinsData();
  }, [
    state.limitPerPage,
    state.currentPage,
    state.orderBy,
    state.orderDirection,
  ]);

  return (
    <div className="wrapper">
      <AppHeader />
      <main>
        <AppSidebar />
        <div className="main-content">
          <div className="content-header">
            <AppDataPerPage
              limit={state.limitPerPage}
              limitChange={handleLimitChange}
            />
            <h5>Trovati {state.total} coins</h5>
          </div>
          <div className="content-main">
            {apiState.success ? (
              <AppTable state={state} orderChange={handleOrderChange} />
            ) : apiState.loading ? (
              <h1>Loading..</h1>
            ) : (
              <h1>Something went wrong.. try reloading the page</h1>
            )}
          </div>
          <footer className="content-footer">
            <h5>
              Pagina {state.currentPage} / {state.totalPages}
            </h5>
            <AppPagination
              currPage={state.currentPage}
              onPrevBtn={handlePrevBtn}
              onNextBtn={handleNextBtn}
              paginationChange={handlePaginationChange}
            />
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
