function showSection(type) {
    document.getElementById('pdf-section').style.display = 'none';
    document.getElementById('image-section').style.display = 'none';
  
    if (type === 'pdf') {
      document.getElementById('pdf-section').style.display = 'block';
    } else if (type === 'image') {
      document.getElementById('image-section').style.display = 'block';
    }
  }
  
  function convertHandler() {
    const input = document.getElementById('pdfFileInput');
    const files = input.files;
    if (!files.length) return alert("Please select images");
  
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
  
    let loaded = 0;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const ratio = img.width / img.height;
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pageWidth / ratio;
  
          if (i !== 0) pdf.addPage();
          pdf.addImage(img, 'JPEG', 0, 0, pageWidth, pageHeight);
  
          loaded++;
          if (loaded === files.length) {
            pdf.save('output.pdf');
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(files[i]);
    }
  }
  
  const canvas = document.getElementById('previewCanvas');
  const ctx = canvas.getContext('2d');
  let currentImage = new Image();
  
  function applyFilters() {
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const saturation = document.getElementById('saturation').value;
    const hue = document.getElementById('hue').value;
    const grayscale = document.getElementById('grayscale').value;
    const sepia = document.getElementById('sepia').value;
    const invert = document.getElementById('invert').value;
    const blur = document.getElementById('blur').value;
    const opacity = document.getElementById('opacity').value;
  
    canvas.style.filter = `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      hue-rotate(${hue}deg)
      grayscale(${grayscale}%)
      sepia(${sepia}%)
      invert(${invert}%)
      blur(${blur}px)
      opacity(${opacity}%)
    `;
  }
  
  const inputs = document.querySelectorAll('input[type="range"]');
  inputs.forEach(input => {
    input.addEventListener('input', applyFilters);
  });
  
  document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      currentImage.onload = function() {
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;
        ctx.drawImage(currentImage, 0, 0);
        applyFilters();
      };
      currentImage.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });
  
  function autoEnhance() {
    document.getElementById('brightness').value = 120;
    document.getElementById('contrast').value = 130;
    document.getElementById('saturation').value = 140;
    document.getElementById('hue').value = 5;
    document.getElementById('grayscale').value = 0;
    document.getElementById('sepia').value = 0;
    document.getElementById('invert').value = 0;
    document.getElementById('blur').value = 0;
    document.getElementById('opacity').value = 100;
    applyFilters();
  }
  
  function saveImage() {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
  }
  