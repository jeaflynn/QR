document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const qrText = document.getElementById('qr-text');
    const qrSize = document.getElementById('qr-size');
    const generateBtn = document.getElementById('generate-btn');
    const downloadBtn = document.getElementById('download-btn');
    const qrContainer = document.getElementById('qr-code');
    
    // QR code instance
    let qrCode;
    
    // Generate QR code function
    function generateQRCode() {
        const text = qrText.value.trim();
        const size = parseInt(qrSize.value);
        
        if (text === '') {
            alert('Please enter some text or URL');
            return;
        }
        
        // Clear previous QR code
        qrContainer.innerHTML = '';
        
        // Create new QR code
        qrCode = new QRCode(qrContainer, {
            text: text,
            width: size,
            height: size,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Enable download button
        setTimeout(() => {
            downloadBtn.disabled = false;
        }, 300);
    }
    
    // Download QR code as image
    function downloadQRCode() {
        if (!qrCode) return;
        
        // Get the QR code image
        const imgSrc = qrContainer.querySelector('img').src;
        
        // Create a download link
        const link = document.createElement('a');
        link.href = imgSrc;
        link.download = 'qrcode.png';
        
        // Simulate click to download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);
    
    // Generate QR code on Enter key
    qrText.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
});