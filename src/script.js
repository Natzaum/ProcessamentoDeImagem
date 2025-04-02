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
