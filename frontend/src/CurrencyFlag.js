import React, { useState, useEffect } from 'react';
import currencyData from './currencyFlag.json';

const CurrencyFlag = ({ code }) => {
    const [countryCode, setCountryCode] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setCountryCode(null);
        setError(null);

        if (!code) return;

        const currency = currencyData.find(item => item.code === code);

        if (currency) {
            setCountryCode(currency.countryCode);
        } else {
            setError('No se encontró el país con ese código.');
        }
    }, [code]);

    if (error || !countryCode) {
        // Si hay un error o no se encontró el país, no renderizamos nada
        return null;
    }

    return (
        <img
            src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`}
            alt={`Bandera de ${code}`}
        />
    );
};

export default CurrencyFlag;
