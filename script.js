const kelime_uzunlugu = 8;
const L = Array.from({ length: kelime_uzunlugu }, (_, i) => 2**i);

const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');

const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');

// Örnek bir resmi yükleme
const img = new Image();
img.src = '/image/autonom.jpg';

img.onload = () => {
    // Gönderilen resmi çizme
    ctx1.drawImage(img, 0, 0, canvas1.width, canvas1.height);
    ctx1.setTransform(1, 0, 0, 1, 0, 0);  // Dönüşüm matrisini sıfırla

    // Gürültü ekleyip alıcıda çözme
    const SNR_dB = 3;
    const Eb_No = 10**(SNR_dB / 10);
    const var_noise = L.reduce((sum, val) => sum + val**2, 0) / (2 * Eb_No);
    const noise = Math.sqrt(var_noise);

    // Gönderilen sinyalin üzerine gürültü eklenmiş sinyali oluşturma
    ctx1.globalAlpha = 0.5;  // Opacity for noise
    ctx1.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

    ctx1.globalAlpha = 1;  // Reset opacity
    ctx1.drawImage(img, noise, noise, canvas1.width, canvas1.height);
    
    // Alıcı tasarımı ve çözme
    const imageData = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);
    const data = new Uint8Array(imageData.data.buffer);

    const B = new Uint8Array(data.length);

    for (let i = 0; i < data.length; i++) {
        const d = Math.floor(data[i] / L[i % kelime_uzunlugu]);
        B[i] = d * L[i % kelime_uzunlugu];
    }

    // Gürültü eklenmiş resmi çizme
    ctx2.putImageData(new ImageData(B, canvas2.width, canvas2.height), 0, 0);
    
    // Başlıkları ekleyerek gösterme
    ctx1.font = '18px Arial';
    ctx1.fillStyle = 'black';
    ctx1.fillText('Gönderilen Resim', 10, 25);

    ctx2.font = '18px Arial';
    ctx2.fillStyle = 'black';
    ctx2.fillText('Alınan Resim', 10, 25);
};
