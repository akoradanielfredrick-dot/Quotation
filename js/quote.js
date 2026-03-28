/**
 * quote.js - Quotation Logic and Live Preview
 * MRANGA TOURS & SAFARIS LTD
 */

// Package Data Mapping
const PACKAGE_DATA = {
    "1/2 Day Mombasa City Tour": { 
        price: 70, days: "1/2", nights: 0, type: "Excursion",
        description: "Enjoy a relaxing tour of Mombasa as you shop in the Old Town, visit Fort Jesus, and explore the Akamba wood carvers village."
    },
    "1 Day Mombasa City Tour": { 
        price: 120, days: "1", nights: 0, type: "Excursion",
        description: "Enjoy a full day discovering Mombasa’s history and culture with visits to the Old Town, Fort Jesus, the wood carvers village, the elephant tusks, and Bamburi Nature Trail. Lunch included."
    },
    "1 Day Shimba": { 
        price: 155, days: "1", nights: 0, type: "Excursion",
        description: "Enjoy the beauty of Shimba Hills as you visit the tropical forest park, home to sable antelopes, elephants, buffaloes, and other wildlife. Experience a nature walk to Sheldrick Falls and later enjoy lunch at Shimba Hills Lodge."
    },
    "1 Day Tsavo East": { 
        price: 220, days: "1", nights: 0, type: "Excursion",
        description: "Enjoy an exciting day safari in Tsavo East, Kenya’s largest game park, where you can look out for red elephants, lions, cheetahs, buffaloes, antelopes, and other wildlife."
    },
    "2 Days Tsavo East": { 
        price: 410, days: "2", nights: 1, type: "Road Safari",
        description: "Enjoy rewarding game drives in Tsavo East, visit Aruba Dam, and spend the night in a comfortable lodge or camp while taking in the scenic beauty of the park."
    },
    "2 Days Salt Lick Special": { 
        price: 440, days: "2", nights: 1, type: "Road Safari",
        description: "Enjoy game drives in Taita Hills Sanctuary, followed by dinner and an overnight stay at the famous Salt Lick Lodge. Wake up to an early morning game drive before breakfast and later enjoy lunch in Voi town."
    },
    "2 Days Tsavo East and West": { 
        price: 490, days: "2", nights: 1, type: "Road Safari",
        description: "Enjoy the experience of visiting both Tsavo East and Tsavo West, with excellent opportunities for game viewing and a chance to look out for Kenya’s Big Five. After lunch, continue to Tsavo West for another exciting game drive and overnight stay."
    },
    "2 Days Tsavo East-Taita (Salt Lick)": { 
        price: 460, days: "2", nights: 1, type: "Road Safari",
        description: "Enjoy game viewing in Tsavo East and later continue to Taita Hills Sanctuary for an afternoon game drive. End your day with a comfortable overnight stay at Salt Lick Lodge."
    },
    "2 Days Ngutuni-Taita Hills (Salt Lick)": { 
        price: 460, days: "2", nights: 1, type: "Road Safari",
        description: "Enjoy a game drive in Ngutuni Sanctuary, followed by lunch at Ngutuni Lodge, then continue to Taita Hills Sanctuary for an afternoon game drive and overnight stay at Salt Lick Lodge."
    },
    "3 Days Tsavo East-Taita (Salt Lick)": { 
        price: 600, days: "3", nights: 2, type: "Road Safari",
        description: "Enjoy an extended safari through Tsavo East and Taita Hills, with opportunities to see red elephants, lions, cheetahs, buffaloes, and other wildlife. Spend your nights at Voi Wildlife Lodge and Salt Lick Lodge for a comfortable safari stay."
    },
    "3 Days Tsavo East and West": { 
        price: 650, days: "3", nights: 2, type: "Road Safari",
        description: "Enjoy the contrast of Tsavo East and Tsavo West as you explore different wildlife habitats, birdlife, Mzima Springs, and Rhino Sanctuary, with comfortable overnight stays along the way."
    },
    "3 Days Tsavo East or West and Amboseli": { 
        price: 680, days: "3", nights: 2, type: "Road Safari",
        description: "Enjoy a safari that combines Tsavo with Amboseli, where you can experience rewarding game drives and beautiful views of Mount Kilimanjaro while staying in comfortable lodges or camps."
    },
    "4 Days Tsavo East-Amboseli-Tsavo West (Big Five Safari)": { 
        price: 900, days: "4", nights: 3, type: "Road Safari",
        description: "Enjoy a wider safari experience across three outstanding parks, with more opportunities for wildlife viewing, scenic landscapes, Mzima Springs, Rhino Sanctuary, and views of Mount Kilimanjaro."
    },
    "2 Days Masai Mara": { 
        price: 1035, days: "2", nights: 1, type: "Air Safari",
        description: "Enjoy a memorable safari in the Masai Mara, the jewel park of Kenya, where you can look out for the Big Five including lion, rhino, leopard, buffalo, and elephant."
    },
    "3 Maasai Mara (Mara Timbo / Royal Mara / Governors Camp)": { 
        price: 1495, days: "3", nights: 2, type: "Road Safari",
        description: "Enjoy a comfortable stay in the Masai Mara with quality camp options, rewarding game drives, and the chance to experience one of Kenya’s most famous wildlife destinations."
    },
    "3 Days Masai Mara (Tipilikwani Camp / Camp Oloshaiki / Fig Tree)": { 
        price: 1575, days: "3", nights: 2, type: "Road Safari",
        description: "Enjoy exciting game drives, comfortable accommodation, and the beauty of the Masai Mara as you experience one of Kenya’s most admired safari destinations."
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
