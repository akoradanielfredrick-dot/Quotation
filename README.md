# Safari RECEIPT Calculator - MRANGA TOURS & SAFARIS LTD

A professional, clean, and responsive receipt web application designed for a tours and safaris business. This tool allows staff to quickly generate receipts, preview them in a document-ready format, and download them as high-quality images for sharing with clients.

## Features

- **Secure Login**: Simple authentication for internal use.
- **Dynamic Form**: Automatic calculations for travel costs, adults, children, and discounts.
- **Live Preview**: Real-time synchronization between the form and a professional receipt document.
- **Image Export**: One-click download of the receipt document as a `.png` image using `html2canvas`.
- **Draft Persistence**: Auto-saves form progress in `localStorage` to prevent data loss on page refresh.
- **Responsive Design**: Optimized for desktops and tablets.

## Project Structure

```text
/
├── index.html          # Login Page (Entry Point)
├── dashboard.html      # Main RECEIPT Dashboard
├── css/
│   └── style.css       # Styling for both pages
├── js/
│   ├── auth.js         # Authentication & Route Protection
│   ├── receipt.js      # RECEIPT Calculations & Live Preview
│   └── download.js      # Image Export logic
├── assets/
│   └── logo.png        # Company Logo
└── README.md           # Documentation
```

## Default Login Credentials

- **Username**: `admin`
- **Password**: `mranga123`

## How to Run Locally

1.  Clone or download this repository.
2.  Open `index.html` in any modern web browser.
3.  Enter the default credentials to access the dashboard.

## Deployment on GitHub Pages

This app is built using only HTML, CSS, and Vanilla JavaScript, making it perfectly suited for GitHub Pages.

1.  Create a new repository on GitHub.
2.  Upload all files (including `css`, `js`, and `assets` folders).
3.  Go to **Settings > Pages**.
4.  In the **Build and deployment** section, select the `main` branch.
5.  Save and wait for the deployment link!

## Technical Implementation

- **Styling**: Built with Vanilla CSS using custom properties and a responsive grid system.
- **Logic**: Vanilla JavaScript with zero external dependencies (except for `html2canvas`).
- **Export**: Uses `html2canvas` library loaded via CDN for high-quality DOM-to-Image conversion.

---
© 2026 MRANGA TOURS & SAFARIS LTD. All rights reserved.



