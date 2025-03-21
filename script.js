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
    async function generateQRCode() {
        const text = qrText.value.trim();
        const size = parseInt(qrSize.value);
        
        if (text === '') {
            alert('Please enter some text or URL');
            return;
        }

        // Disable during animation
        generateBtn.disabled = true;
        
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
        
        // Hide the generated QR code
        const qrImg = qrContainer.querySelector('img');
        qrImg.style.display = 'none';
        
        // Wait for the QR code image to load
        await new Promise(resolve => {
            qrImg.onload = resolve;
            setTimeout(resolve, 300);
        });
        
        // Create canvas for pixel animation
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        qrContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(qrImg, 0, 0, size, size);
        
        // Get image data for pixel-by-pixel animation
        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;
        
        // Create pixel grid
        const pixelSize = Math.max(2, Math.floor(size / 50)); // Pixel blocks size
        const gridSize = Math.floor(size / pixelSize);
        
        canvas.remove();
        
        // Create a container for pixel blocks
        const pixelContainer = document.createElement('div');
        pixelContainer.style.position = 'relative';
        pixelContainer.style.width = size + 'px';
        pixelContainer.style.height = size + 'px';
        qrContainer.appendChild(pixelContainer);
        
        // Generate pixel blocks
        const blocks = [];
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const pixelX = x * pixelSize;
                const pixelY = y * pixelSize;
                
                // Get color from average of pixels in this block
                const index = (pixelY * size + pixelX) * 4;
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];
                
                // Only create blocks for non-white pixels
                if (r < 200 || g < 200 || b < 200) {
                    const block = document.createElement('div');
                    block.className = 'pixel-block';
                    block.style.width = pixelSize + 'px';
                    block.style.height = pixelSize + 'px';
                    block.style.left = pixelX + 'px';
                    block.style.top = pixelY + 'px';
                    
                    pixelContainer.appendChild(block);
                    blocks.push(block);
                }
            }
        }
        
        // Animate pixels appearing
        shuffleArray(blocks); // Randomize animation order
        
        for (let i = 0; i < blocks.length; i++) {
            setTimeout(() => {
                blocks[i].style.opacity = 1;
                
                // Enable download when animation completes
                if (i === blocks.length - 1) {
                    setTimeout(() => {
                        generateBtn.disabled = false;
                        downloadBtn.disabled = false;
                    }, 300);
                }
            }, i * 5); // 5ms delay between each pixel
        }
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