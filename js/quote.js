/**
 * quote.js - Quotation Logic and Live Preview
 * MRANGA TOURS & SAFARIS LTD
 */

// Package Data Mapping
const PACKAGE_DATA = {
    "1/2 Day Mombasa City Tour": { 
        price: 70, days: "1/2", nights: 0, type: "Excursion",
        description: "Enjoy shopping in the Old Town, visit Fort Jesus, and see the Akamba wood carvers village."
    },
    "1 Day Mombasa City Tour": { 
        price: 120, days: "1", nights: 0, type: "Excursion",
        description: "Enjoy shopping in the Old Town, visit Fort Jesus and the wood carvers village, elephant tusks, and Bamburi Nature Trail. Lunch included."
    },
    "1 Day Shimba": { 
        price: 155, days: "1", nights: 0, type: "Excursion",
        description: "Visit the tropical forest park, home to sable antelopes, elephants, buffaloes, and other wildlife. Enjoy a nature walk to Sheldrick Falls, followed by lunch at Shimba Hills Lodge, the only tree hotel at the Coast."
    },
    "1 Day Tsavo East": { 
        price: 220, days: "1", nights: 0, type: "Excursion",
        description: "A day safari to Kenya’s largest game park, with the chance to see red elephants, lions, cheetahs, buffaloes, antelopes, and other wildlife."
    },
    "2 Days Tsavo East": { 
        price: 410, days: "2", nights: 1, type: "Road Safari",
        description: "Visit the Aruba Dam and enjoy game viewing with chances of seeing hippos, elephants, and many bird species. Overnight at a camp or lodge and enjoy panoramic views of Tsavo East."
    },
    "2 Days Salt Lick Special": { 
        price: 440, days: "2", nights: 1, type: "Road Safari",
        description: "Visit Taita Hills Sanctuary for game drives, then proceed for more game viewing before dinner and overnight at Salt Lick Lodge. Early morning game drive before breakfast, then lunch in Voi town."
    },
    "2 Days Tsavo East and West": { 
        price: 490, days: "2", nights: 1, type: "Road Safari",
        description: "Visit Kenya’s largest park and look out for the Big Five. After lunch, proceed to Tsavo West for another game drive. Overnight with a chance to watch leopard feeding at night at Ngulia Lodge or stay at Ngulia Safari Camp."
    },
    "2 Days Tsavo East-Taita (Salt Lick)": { 
        price: 460, days: "2", nights: 1, type: "Road Safari",
        description: "Drive to Tsavo East for game viewing in Kenya’s largest park. After lunch in Voi town, proceed to Taita Hills Sanctuary for an afternoon game drive and overnight at Salt Lick Lodge."
    },
    "2 Days Ngutuni-Taita Hills (Salt Lick)": { 
        price: 460, days: "2", nights: 1, type: "Road Safari",
        description: "Drive to Ngutuni Sanctuary for a game drive, then after lunch at Ngutuni Lodge proceed to Taita Hills Sanctuary for an afternoon game drive and overnight at Salt Lick Lodge."
    },
    "3 Days Tsavo East-Taita (Salt Lick)": { 
        price: 600, days: "3", nights: 2, type: "Road Safari",
        description: "Drive to Tsavo East and look out for red elephants, lions, cheetahs, buffaloes, and other wildlife. Overnight at Voi Wildlife Lodge. On the second day, continue to Taita Hills Sanctuary for another game drive and overnight at Salt Lick Lodge."
    },
    "3 Days Tsavo East and West": { 
        price: 650, days: "3", nights: 2, type: "Road Safari",
        description: "Drive to Tsavo East for wildlife viewing and birdlife, with overnight at Voi Lodge. The next day proceed to Tsavo West to visit Mzima Springs and Rhino Sanctuary, with overnight at Ngulia Lodge."
    },
    "3 Days Tsavo East or West and Amboseli": { 
        price: 680, days: "3", nights: 2, type: "Road Safari",
        description: "Visit Tsavo, Kenya’s largest park, and also enjoy views of Africa’s highest mountain, Mount Kilimanjaro, while in Amboseli Game Reserve. Overnight in lodges or camps."
    },
    "4 Days Tsavo East-Amboseli-Tsavo West (Big Five Safari)": { 
        price: 900, days: "4", nights: 3, type: "Road Safari",
        description: "Visit Kenya’s largest national park, continue to Amboseli, the land of Kilimanjaro, and on the last day drive to Tsavo West for Mzima Springs and Rhino Sanctuary. Overnight in lodges or camps."
    },
    "2 Days Masai Mara": { 
        price: 1035, days: "2", nights: 1, type: "Air Safari",
        description: "Visit the jewel park of Kenya, with excellent chances of seeing the Big Five: lion, rhino, leopard, buffalo, and elephant, for a memorable safari experience."
    },
    "3 Days Masai Mara (Mara Timbo / Royal Mara / Governors Camp)": { 
        price: 1495, days: "3", nights: 2, type: "Road Safari",
        description: "A well-planned Masai Mara safari with comfortable camp options, offering quality game viewing and a memorable stay in one of Kenya’s most famous reserves."
    },
    "3 Days Masai Mara (Tipilikwani Camp / Camp Oloshaiki / Fig Tree)": { 
        price: 1575, days: "3", nights: 2, type: "Road Safari",
        description: "Enjoy a rewarding Masai Mara safari with exciting game drives, comfortable camp accommodation, and a memorable stay in this jewel park of Kenya."
    }
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
                document.getElementById('nights').value = selectedPackage.days; // Use the new .days property
                document.getElementById('package-type').value = selectedPackage.type;
                
                // Set automated description
                const notesField = document.getElementById('notes');
                if (notesField) {
                    notesField.value = selectedPackage.description;
                }

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

    // Restore Draft First
    restoreDraft();

    // Auto-generate or Update Prefix of Quotation Number
    if (!quoteNumField.value || quoteNumField.value.startsWith('QT-')) {
        quoteNumField.value = generateQuoteNumber();
    }

    // Set Current Date for Travel Date (default) and Date Created
    if (travelDateField && !travelDateField.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        travelDateField.value = tomorrow.toISOString().split('T')[0];
    }
    if (dateCreatedField) {
        dateCreatedField.textContent = formatDate(new Date());
    }

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
    const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number for better uniqueness
    return `MT-${dateStr}-${random}`;
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
    
    // Format duration: X Days, Y Nights
    const daysRaw = document.getElementById('nights').value;
    const daysNum = parseDuration(daysRaw);
    const nights = daysNum > 1 ? Math.floor(daysNum - 1) : 0;
    
    let durationText = "";
    if (daysRaw === "1/2") {
        durationText = "1/2 Day (Excursion)";
    } else {
        durationText = nights > 0 ? `${daysRaw} Days, ${nights} Night(s)` : `${daysRaw} Day (Excursion)`;
    }
    
    const durationPreview = document.getElementById('p-duration');
    if (durationPreview) durationPreview.textContent = durationText;

    syncValue('currency', 'p-currency-label');

    // Terms & Conditions
    syncText('quote-validity', 'p-quote-validity');
    syncText('deposit-terms', 'p-deposit-terms');
    syncCheckboxes('payment-method', 'p-payment-methods');

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
 * Sync checkbox group values to preview
 */
function syncCheckboxes(name, previewId) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    const preview = document.getElementById(previewId);
    if (preview) {
        const values = Array.from(checkboxes).map(cb => cb.value);
        preview.textContent = values.length > 0 ? values.join(', ') : 'None selected';
    }
}

/**
 * Calculate all totals and subtotals
 */
function calculateTotals() {
    const currency = document.getElementById('currency').value;
    const rate = currentRates[currency] || 1;

    const days = parseDuration(document.getElementById('nights').value);
    const nights = days > 1 ? Math.floor(days - 1) : 0;

    const adults = getNum('adults');
    const adultPrice = getNum('adult-price');
    const children = getNum('children');
    const childPrice = getNum('child-price');
    const extras = getNum('extra-charges');
    const discount = getNum('discount');

    const baseSubtotal = (adults * adultPrice) + (children * childPrice) + extras;
    const totalWithMargin = baseSubtotal * rate;
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
 * Helper to parse duration string (handles "1/2" -> 0.5)
 */
function parseDuration(val) {
    if (val === "1/2") return 0.5;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
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

    const adults = getNum('adults');
    const adultPrice = getNum('adult-price');
    const children = getNum('children');
    const childPrice = getNum('child-price');
    const extras = getNum('extra-charges');

    if (adults > 0) addTableRow('Adults', adultPrice * rate, adults);
    if (children > 0) addTableRow('Children', childPrice * rate, children);
    if (extras > 0) addTableRow('Extra Charges', extras * rate, 1);
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
