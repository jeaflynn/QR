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
        
         // Create a temporary container to generate the QR code
         const tempContainer = document.createElement('div');
         tempContainer.style.display = 'none';
         document.body.appendChild(tempContainer);

        // Create new QR code
        qrCode = new QRCode(tempContainer, {
            text: text,
            width: size,
            height: size,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        await new Promise(resolve => setTimeout(resolve, 200));
        
        const qrImg = tempContainer.querySelector('img');

        // Create canvas to get pixel data
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // Wait for the QR code image to load
        await new Promise(resolve => {
            qrImg.onload = resolve;
            setTimeout(resolve, 300);
        });
        
        // Draw the QR code on canvas
        ctx.drawImage(qrImg, 0, 0, size, size);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;
        
        // Clean up temporary elements
        tempContainer.remove();
        
        // Create a container for our animated QR code
        const pixelContainer = document.createElement('div');
        pixelContainer.style.position = 'relative';
        pixelContainer.style.width = size + 'px';
        pixelContainer.style.height = size + 'px';
        pixelContainer.style.backgroundColor = '#ffffff'; // White background
        qrContainer.appendChild(pixelContainer);
        
        // Create pixel blocks
        const pixelSize = Math.max(2, Math.floor(size / 40)); // Adjust for QR code density
        const gridSize = Math.floor(size / pixelSize);
        const blocks = [];
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const pixelX = x * pixelSize;
                const pixelY = y * pixelSize;
                
                // Sample the center of each grid cell
                const centerX = pixelX + Math.floor(pixelSize / 2);
                const centerY = pixelY + Math.floor(pixelSize / 2);
                
                if (centerX < size && centerY < size) {
                    const index = (centerY * size + centerX) * 4;
                    // Check if this pixel is black (QR code data)
                    if (pixels[index] < 128 && pixels[index + 1] < 128 && pixels[index + 2] < 128) {
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
                        // Create a hidden but scannable QR code for downloading
                        const hiddenQR = document.createElement('div');
                        hiddenQR.style.display = 'none';
                        hiddenQR.className = 'hidden-qr';
                        qrContainer.appendChild(hiddenQR);
                    
                        new QRCode(hiddenQR, {
                            text: text,
                            width: size,
                            height: size,
                            colorDark: '#000000',
                            colorLight: '#ffffff',
                            correctLevel: QRCode.CorrectLevel.H
                            });
                    }, 300);
                }
            }, i * 2); // 5ms delay between each pixel
        }
    }
    
    // Download QR code as image
    function downloadQRCode() {
        const hiddenQR = qrContainer.querySelector('.hidden-qr img');
        if (!hiddenQR) return;
        
        // Create a download link
        const link = document.createElement('a');
        link.href = hiddenQR.src;
        link.download = 'qrcode.png';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
