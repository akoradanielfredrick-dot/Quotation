/**
 * download.js - Image Capture and Download
 * MRANGA TOURS & SAFARIS LTD
 */

document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-btn');
    const previewCard = document.getElementById('receipt-card');
    const downloadMsg = document.getElementById('download-message');

    if (downloadBtn && previewCard) {
        downloadBtn.addEventListener('click', () => {
            // Validation: Ensure Client Name and Package Name are filled
            const clientName = document.getElementById('client-name').value;
            const packageName = document.getElementById('package-name').value;
            const receiptNum = document.getElementById('receipt-number').value;

            if (!packageName) {
                alert('Please select a Tour Package before downloading.');
                return;
            }

            // Show loading or signal start
            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Generating Image...';

            // Capture using html2canvas
            html2canvas(previewCard, {
                scale: 2, // Higher resolution
                useCORS: true, // Allow cross-origin images (if any)
                logging: false,
                backgroundColor: '#FFFFFF'
            }).then(canvas => {
                // Convert to image
                const imgData = canvas.toDataURL('image/png');
                
                // Create download link
                const link = document.createElement('a');
                
                // Filename fallback if client name is empty
                const safeClientName = clientName ? clientName.replace(/\s+/g, '-').toLowerCase() : 'valuable-client';
                const filename = `receipt-${safeClientName}-${receiptNum}.png`;
                
                link.href = imgData;
                link.download = filename;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Show success message
                if (downloadMsg) {
                    downloadMsg.classList.remove('hidden');
                    setTimeout(() => {
                        downloadMsg.classList.add('hidden');
                    }, 5000);
                }

                // Reset button
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Download RECEIPT as Image';

                // Randomise number for next time
                const receiptNumField = document.getElementById('receipt-number');
                if (typeof generateReceiptNumber === 'function' && receiptNumField) {
                    receiptNumField.value = generateReceiptNumber();
                    if (typeof updatePreview === 'function') {
                        updatePreview();
                    }
                }
            }).catch(err => {
                console.error('Download failed:', err);
                alert('Oops! Something went wrong while generating the image.');
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Download RECEIPT as Image';
            });
        });
    }
});
