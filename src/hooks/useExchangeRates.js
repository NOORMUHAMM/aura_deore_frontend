import { useEffect, useState } from "react";
import { fetchJSON, api, EXCHANGE_API } from "../utils/api";

export default function useExchangeRates() {
  const [rates, setRates] = useState({ USD: 1, INR: 83 });

  useEffect(() => {
    const load = async () => {
      const url = EXCHANGE_API || api("/rates");
      const data = await fetchJSON(url, null);
      if (data && data.rates) setRates(data.rates);
    };
    load();
  }, []);

  const convert = (amount, from = "USD", to = "USD") => {
    const rateFrom = rates[from] || 1;
    const rateTo = rates[to] || 1;
    return (amount / rateFrom) * rateTo;
  };

  return { rates, convert };
}
