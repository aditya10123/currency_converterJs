const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD";
const currencySymbols = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "INR": "₹",
    "JPY": "¥",
    "CAD": "C$",
    // Add more currencies and symbols as needed
};

// Fetch currency rates from API
async function fetchRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch exchange rates.");
        return data.rates;
    } catch (error) {
        console.error("Error fetching currency rates:", error);
        alert("Failed to load currency data. Please try again later.");
        return {};
    }
}

// Populate dropdown with available currencies
async function populateCurrencyOptions() {
    const rates = await fetchRates();
    const currencyDropdowns = document.querySelectorAll("select");
    if (Object.keys(rates).length === 0) return; // If rates are empty, do not populate

    for (const dropdown of currencyDropdowns) {
        for (const currency in rates) {
            const option = document.createElement("option");
            option.value = currency;
            option.text = `${currencySymbols[currency] || ''} ${currency} (${currencyName(currency)})`;
            dropdown.add(option);
        }
    }
}

// Map currency codes to full names
function currencyName(currencyCode) {
    const currencyNames = {
        "USD": "United States Dollar",
        "EUR": "Euro",
        "GBP": "British Pound",
        "INR": "Indian Rupee",
        "JPY": "Japanese Yen",
        "CAD": "Canadian Dollar",
        // Add more currency names as needed
    };
    return currencyNames[currencyCode] || "Unknown Currency";
}

// Convert the entered amount between the selected currencies
async function convertCurrency() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than zero");
        return;
    }

    const rates = await fetchRates();
    if (!rates[fromCurrency] || !rates[toCurrency]) {
        alert("Invalid currency selected. Please try again.");
        return;
    }

    const convertedAmount = (amount / rates[fromCurrency]) * rates[toCurrency];
    document.getElementById("result").innerText = `${currencySymbols[fromCurrency] || ''}${amount} ${fromCurrency} = ${currencySymbols[toCurrency] || ''}${convertedAmount.toFixed(2)} ${toCurrency}`;
}

// Swap the selected currencies
function swapCurrencies() {
    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
}

// Initialize the currency options when the page loads
window.onload = populateCurrencyOptions;
