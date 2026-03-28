/**
 * quote.js - Quotation Logic and Live Preview
 * MRANGA TOURS & SAFARIS LTD
 */

// Package Data Mapping
const PACKAGE_DATA = {
    "1/2 Day Mombasa City Tour": { price: 70, nights: 0, type: "Excursion" },
    "1 Day Mombasa City Tour": { price: 120, nights: 0, type: "Excursion" },
    "1 Day Shimba": { price: 155, nights: 0, type: "Excursion" },
    "1 Day Tsavo East": { price: 220, nights: 0, type: "Excursion" },
    "2 Days Tsavo East": { price: 410, nights: 1, type: "Road Safari" },
    "2 Days Saltlick Special": { price: 440, nights: 1, type: "Road Safari" },
    "2 Days Tsavo East and West": { price: 490, nights: 1, type: "Road Safari" },
    "2 Days Tsavo East-Taita (Saltlick)": { price: 460, nights: 1, type: "Road Safari" },
    "2 Days Ngutuni-Taita Hills (Saltlick)": { price: 460, nights: 1, type: "Road Safari" },
    "3 Days Tsavo East-Taita (Saltlick)": { price: 600, nights: 2, type: "Road Safari" },
    "3 Days Tsavo East and West": { price: 650, nights: 2, type: "Road Safari" },
    "3 Days Tsavo East or West and Amboseli": { price: 680, nights: 2, type: "Road Safari" },
    "4 Days Tsavo East-Amboseli-Tsavo west – (BIG FIVE SAFARI)": { price: 900, nights: 3, type: "Road Safari" },
    "2 Days Masai Mara": { price: 1035, nights: 1, type: "Air Safari" },
    "3 Maasai Mara (Mara Timbo/Royal Mara/Governors Camp)": { price: 1495, nights: 2, type: "Road Safari" },
    "3 Days Maasai Mara (Tipilikwani camp/Camp Oloshaiki/Fig tree)": { price: 1575, nights: 2, type: "Road Safari" }
};

// Currency Conversion Rates (USD to X)
let currentRates = {
    USD: 1,
    KES: 130, // Fallback
    EUR: 0.92, // Fallback
    GBP: 0.79 // Fallback
};

document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    const previewCard = document.getElementById('quotation-card');
    const clearBtn = document.getElementById('clear-form-btn');
    const packageNameSelect = document.getElementById('package-name');

    if (!quoteForm) return;

    // Initialize Quotation
    initQuotation();

    // Fetch live rates
    fetchLatestRates();

    // Listen for changes
    quoteForm.addEventListener('input', (e) => {
        updatePreview();
        saveDraft();
    });

    // Package change logic
    if (packageNameSelect) {
        packageNameSelect.addEventListener('change', () => {
            const selectedPackage = PACKAGE_DATA[packageNameSelect.value];
            if (selectedPackage) {
                document.getElementById('adult-price').value = selectedPackage.price;
                document.getElementById('nights').value = selectedPackage.nights;
                document.getElementById('package-type').value = selectedPackage.type;
                updatePreview();
                saveDraft();
            }
        });
    }

    // Clear form
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all form data?')) {
                quoteForm.reset();
                localStorage.removeItem('quoteDraft');
                initQuotation();
                updatePreview();
            }
        });
    }
});

/**
 * Initialize fields on load
 */
function initQuotation() {
    const quoteNumField = document.getElementById('quote-number');
    const travelDateField = document.getElementById('travel-date');
    const dateCreatedField = document.getElementById('p-date-created');

    // Auto-generate Quotation Number
    if (!quoteNumField.value) {
        quoteNumField.value = generateQuoteNumber();
    }

    // Set Current Date for Travel Date (default) and Date Created
    const today = new Date().toISOString().split('T')[0];
    if (travelDateField) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        travelDateField.value = tomorrow.toISOString().split('T')[0];
    }
    if (dateCreatedField) {
        dateCreatedField.textContent = formatDate(new Date());
    }

    // Restore Draft
    restoreDraft();

    // Initial Preview
    updatePreview();
}

/**
 * Fetch latest rates from Frankfurter API with caching
 */
async function fetchLatestRates() {
    const CACHE_KEY = 'currencyRates';
    const CACHE_EXPIRY = 6 * 60 * 60 * 1000; // 6 hours
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { rates, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
            currentRates = rates;
            console.log('Using cached currency rates');
            updatePreview();
            return;
        }
    }

    try {
        const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=KES,EUR,GBP');
        const data = await response.json();
        
        if (data && data.rates) {
            currentRates = { USD: 1, ...data.rates };
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                rates: currentRates,
                timestamp: Date.now()
            }));
            console.log('Currency rates updated from API');
            updatePreview();
        }
    } catch (error) {
        console.error('Failed to fetch currency rates, using fallbacks:', error);
    }
}

/**
 * Generate a unique quotation number
 */
function generateQuoteNumber() {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `QT-${dateStr}-${random}`;
}

/**
 * Format date for display
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Update the live preview card
 */
function updatePreview() {
    // Basic Details
    syncText('quote-number', 'p-quote-number');
    syncDate('travel-date', 'p-travel-date');
    syncText('client-name', 'p-client-name');
    syncText('client-phone', 'p-client-phone');
    syncText('client-email', 'p-client-email');
    syncText('package-name', 'p-package-name');
    syncValue('package-type', 'p-package-type');
    syncValue('nights', 'p-nights');
    syncValue('currency', 'p-currency-label');

    // Performance Calculations
    calculateTotals();
    updateTable();
}

/**
 * Sync text content from input to preview element
 */
function syncText(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (input && preview) {
        preview.textContent = input.value || '...';
    }
}

/**
 * Sync value attribute from input/select to preview
 */
function syncValue(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (input && preview) {
        preview.textContent = input.value;
    }
}

/**
 * Sync date from input to preview with nice formatting
 */
function syncDate(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    if (input && preview && input.value) {
        preview.textContent = formatDate(input.value);
    }
}

/**
 * Calculate all totals and subtotals
 */
function calculateTotals() {
    const currency = document.getElementById('currency').value;
    const rate = currentRates[currency] || 1;

    const nights = getNum('nights');
    const days = nights > 0 ? (nights + 1) : 1;

    const adults = getNum('adults');
    const adultPrice = getNum('adult-price');
    const children = getNum('children');
    const childPrice = getNum('child-price');
    const transport = getNum('transport-cost');
    const accommodationRate = getNum('accommodation-cost');
    const parkFeesRate = getNum('park-fees');
    const extras = getNum('extra-charges');
    const discount = getNum('discount');

    const accommodationTotal = accommodationRate * nights;
    const parkFeesTotal = parkFeesRate * days;

    const baseSubtotal = (adults * adultPrice) + (children * childPrice) + transport + accommodationTotal + parkFeesTotal + extras;
    const profitMargin = baseSubtotal * 0.10;
    const totalWithMargin = (baseSubtotal + profitMargin) * rate;
    const convertedDiscount = discount * rate;
    const grandTotal = Math.max(0, totalWithMargin - convertedDiscount);

    document.getElementById('p-subtotal').textContent = totalWithMargin.toFixed(2);
    document.getElementById('p-discount').textContent = convertedDiscount.toFixed(2);
    document.getElementById('p-grand-total').textContent = grandTotal.toFixed(2);

    // Notes
    const notesInput = document.getElementById('notes');
    const notesPreview = document.getElementById('p-notes');
    if (notesInput && notesPreview) {
        notesPreview.textContent = notesInput.value || 'No special requests.';
    }
}

/**
 * Helper to get numeric value from input
 */
function getNum(id) {
    const val = parseFloat(document.getElementById(id).value);
    return isNaN(val) ? 0 : val;
}

/**
 * Update the breakdown table in the preview
 */
function updateTable() {
    const tableBody = document.getElementById('p-table-body');
    const currency = document.getElementById('currency').value;
    const rate = currentRates[currency] || 1;
    tableBody.innerHTML = '';

    const nights = getNum('nights');
    const days = nights > 0 ? (nights + 1) : 1;

    const adults = getNum('adults');
    const adultPrice = getNum('adult-price');
    const children = getNum('children');
    const childPrice = getNum('child-price');
    const transport = getNum('transport-cost');
    const accommodationRate = getNum('accommodation-cost');
    const parkFeesRate = getNum('park-fees');
    const extras = getNum('extra-charges');

    const accommodationTotal = accommodationRate * nights;
    const parkFeesTotal = parkFeesRate * days;

    const baseSubtotal = (adults * adultPrice) + (children * childPrice) + transport + accommodationTotal + parkFeesTotal + extras;
    const profitMargin = baseSubtotal * 0.10;

    // Add rows if value > 0 (converted to selected currency)
    if (adults > 0) addTableRow('Adults', adultPrice * rate, adults);
    if (children > 0) addTableRow('Children', childPrice * rate, children);
    if (transport > 0) addTableRow('Transport', transport * rate, 1);
    if (accommodationRate > 0) addTableRow('Accommodation', accommodationRate * rate, nights);
    if (parkFeesRate > 0) addTableRow('Park Fees', parkFeesRate * rate, days);
    if (extras > 0) addTableRow('Extra Charges', extras * rate, 1);

    // Add Profit Margin Row
    if (profitMargin > 0) {
        addTableRow('Company Profit Margin (10%)', profitMargin * rate, 1);
    }
}

/**
 * Add a row to the preview table
 */
function addTableRow(description, rate, qty) {
    const tableBody = document.getElementById('p-table-body');
    const total = rate * qty;
    
    const row = `
        <tr>
            <td>${description}</td>
            <td>${rate.toFixed(2)}</td>
            <td>${qty}</td>
            <td>${total.toFixed(2)}</td>
        </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
}

/**
 * Save draft data to localStorage
 */
function saveDraft() {
    const formData = new FormData(document.getElementById('quote-form'));
    const draft = {};
    formData.forEach((value, key) => {
        draft[key] = value;
    });
    localStorage.setItem('quoteDraft', JSON.stringify(draft));
}

/**
 * Restore draft data from localStorage
 */
function restoreDraft() {
    const draftStr = localStorage.getItem('quoteDraft');
    if (draftStr) {
        const draft = JSON.parse(draftStr);
        const form = document.getElementById('quote-form');
        for (let key in draft) {
            const field = form.elements[key];
            if (field) {
                field.value = draft[key];
            }
        }
    }
}
