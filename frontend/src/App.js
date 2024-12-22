import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('1');
  const [exchangeRates, setExchangeRates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
            'http://api.exchangeratesapi.io/v1/latest?access_key=3004299f04ac0aa7e9665328b696988d'
        );
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || 'Error fetching exchange rates');
        }

        setExchangeRates(data.rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  const handleConvert = () => {
    if (!exchangeRates) return;

    if (!amount || isNaN(amount)) {
      setResult('');
      return;
    }

    const amountNumber = parseFloat(amount);
    let result;

    if (fromCurrency === 'EUR') {
      result = amountNumber * exchangeRates[toCurrency];
    } else if (toCurrency === 'EUR') {
      result = amountNumber / exchangeRates[fromCurrency];
    } else {
      const amountInEur = amountNumber / exchangeRates[fromCurrency];
      result = amountInEur * exchangeRates[toCurrency];
    }

    setResult(result.toFixed(2));
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    if (exchangeRates) {
      handleConvert();
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  if (loading) {
    return (
        <div className="App">
          <div className="converter-card">
            <p>Cargando tasas de cambio...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="App">
          <div className="converter-card error">
            <p>Error: {error}</p>
            <p>Por favor, intenta nuevamente más tarde.</p>
          </div>
        </div>
    );
  }

  return (
      <div className="App">
        <div className="converter-card">
          <h1>Conversor de Monedas</h1>
          <div className="converter-form">
            <div className="input-group">
              <label htmlFor="amount">Cantidad</label>
              <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="no-spinner"
                  placeholder="Ingrese la cantidad"
              />
            </div>
            <div className="currency-group">
              <div className="select-wrapper">
                <label htmlFor="fromCurrency">De</label>
                <select
                    id="fromCurrency"
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {exchangeRates && Object.keys(exchangeRates).map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                  ))}
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <button
                  className="swap-button"
                  onClick={handleSwapCurrencies}
                  aria-label="Intercambiar monedas"
              >
                ⇄
              </button>
              <div className="select-wrapper">
                <label htmlFor="toCurrency">A</label>
                <select
                    id="toCurrency"
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                >
                  {exchangeRates && Object.keys(exchangeRates).map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                  ))}
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>
          <div className="result">
            <p>Resultado:</p>
            <p className="result-value">
              {amount && !isNaN(amount) ? `${result} ${toCurrency}` : `0 ${toCurrency}`}
            </p>
          </div>
        </div>
      </div>
  );
}

export default App;

