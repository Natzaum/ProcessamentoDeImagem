document.getElementById("imageInput1").addEventListener("change", function(event) {
    loadImage(event.target.files[0], "canvas1");
});

document.getElementById("imageInput2").addEventListener("change", function(event) {
    loadImage(event.target.files[0], "canvas2");
});

document.getElementById("brightnessSlider").addEventListener("input", function() {
    document.getElementById("brightnessValue").innerText = this.value;
    adjustBrightnessContrast();
});

document.getElementById("contrastSlider").addEventListener("input", function() {
    document.getElementById("contrastValue").innerText = this.value;
    adjustBrightnessContrast();
});

function getWorkingCanvasData() {
    const result = getImageData("resultCanvas");
    if (result.data.some(v => v !== 0)) {
        return result;
    } else {
        return getImageData("canvas1");
    }
}

function loadImage(file, canvasId) {
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function() {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);
    };
}

function getImageData(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function applyImageData(imageData, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
}

function adjustBrightnessContrast() {
    const brightness = parseInt(document.getElementById("brightnessSlider").value);
    const contrast = parseFloat(document.getElementById("contrastSlider").value);
    const img = getImageData("canvas1");

    if (!img) return;

    const result = new ImageData(img.width, img.height);

    for (let i = 0; i < img.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            let newValue = img.data[i + j] * contrast + brightness;
            result.data[i + j] = Math.min(255, Math.max(0, newValue));
        }
        result.data[i + 3] = 255;
    }

    applyImageData(result, "resultCanvas");
}

function sumImages() {
    const img1 = getImageData("canvas1");
    const img2 = getImageData("canvas2");

    if (img1.width !== img2.width || img1.height !== img2.height) {
        alert("As imagens devem ter o mesmo tamanho!");
        return;
    }

    const result = new ImageData(img1.width, img1.height);
    for (let i = 0; i < img1.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            result.data[i + j] = Math.min(255, img1.data[i + j] + img2.data[i + j]);
        }
        result.data[i + 3] = 255;
    }
    applyImageData(result, "resultCanvas");
}

function subtractImages() {
    const img1 = getImageData("canvas1");
    const img2 = getImageData("canvas2");

    if (img1.width !== img2.width || img1.height !== img2.height) {
        alert("As imagens devem ter o mesmo tamanho!");
        return;
    }

    const result = new ImageData(img1.width, img1.height);
    for (let i = 0; i < img1.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            result.data[i + j] = Math.max(0, img1.data[i + j] - img2.data[i + j]);
        }
        result.data[i + 3] = 255;
    }
    applyImageData(result, "resultCanvas");
}

function convertToGrayscale() {
    const img = getWorkingCanvasData()
    if (!img) return;

    const result = new ImageData(img.width, img.height);

    for (let i = 0; i < img.data.length; i += 4) {
        const r = img.data[i];
        const g = img.data[i + 1];
        const b = img.data[i + 2];

        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        result.data[i] = gray;
        result.data[i + 1] = gray;
        result.data[i + 2] = gray;
        result.data[i + 3] = 255;
    }

    applyImageData(result, "resultCanvas");
}

// ------------------ Flip horizontal -------------------- \\

function flipHorizontal() {
    const img = getWorkingCanvasData()
    if (!img) return;

    const width = img.width;
    const height = img.height;
    const result = new ImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const srcIndex = (y * width + x) * 4;
            const destIndex = (y * width + (width - x - 1)) * 4;

            result.data[destIndex] = img.data[srcIndex];
            result.data[destIndex + 1] = img.data[srcIndex + 1];
            result.data[destIndex + 2] = img.data[srcIndex + 2];
            result.data[destIndex + 3] = img.data[srcIndex + 3];
        }
    }

    applyImageData(result, "resultCanvas");
}

// ------------------ Flip vertical -------------------- \\

function flipVertical() {
    const img = getWorkingCanvasData()
    if (!img) return;

    const width = img.width;
    const height = img.height;
    const result = new ImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const srcIndex = (y * width + x) * 4;
            const destIndex = ((height - y - 1) * width + x) * 4;

            result.data[destIndex] = img.data[srcIndex];
            result.data[destIndex + 1] = img.data[srcIndex + 1];
            result.data[destIndex + 2] = img.data[srcIndex + 2];
            result.data[destIndex + 3] = img.data[srcIndex + 3];
        }
    }

    applyImageData(result, "resultCanvas");
}

// ------------------ Diferença absoluta -------------------- \\

function differenceImages() {
    const img1 = getImageData("canvas1");
    const img2 = getImageData("canvas2");

    if (img1.width !== img2.width || img1.height !== img2.height) {
        alert("As imagens devem ter o mesmo tamanho!");
        return;
    }

    const result = new ImageData(img1.width, img1.height);

    for (let i = 0; i < img1.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            result.data[i + j] = Math.abs(img1.data[i + j] - img2.data[i + j]);
        }
        result.data[i + 3] = 255;
    }

    applyImageData(result, "resultCanvas");
}
