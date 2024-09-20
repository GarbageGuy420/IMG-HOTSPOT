(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const selectionType = document.getElementById('selectionType');
    const appearanceType = document.getElementById('appearanceType');
    let hotspots = [];
    let singleSelection = true; // Default to single selection

    // Load the image onto the canvas when uploaded
    imageUpload.addEventListener('change', function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          addCanvasClickListener();
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(file);
    });

    // Toggle single or multiple selection based on user input
    selectionType.addEventListener('change', function () {
      singleSelection = selectionType.value === 'single';
      hotspots = []; // Reset hotspots when selection type changes
      redrawCanvas(); // Clear existing selections visually
    });

    // Function to handle clicks on the canvas to add hotspots
    function addCanvasClickListener() {
      canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (singleSelection) {
          hotspots = [{ x, y }];
        } else {
          hotspots.push({ x, y });
        }

        redrawCanvas();
      });
    }

    // Redraw the canvas and display hotspots based on user selection style
    function redrawCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = new Image();
      img.src = canvas.toDataURL(); // Load the existing image
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        hotspots.forEach(({ x, y }, index) => {
          drawHotspot(x, y, index);
        });
      };
    }

    // Draw the selected hotspots with visual styles
    function drawHotspot(x, y, index) {
      const appearance = appearanceType.value;
      if (appearance === 'overlay') {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
      } else if (appearance === 'checkbox') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 10, y - 10, 20, 20);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText('✔', x - 6, y + 4);
      }
    }

    // Handle form submission
    JFCustomWidget.subscribe('submit', function () {
      JFCustomWidget.sendSubmit({
        valid: true,
        value: JSON.stringify(hotspots),
      });
    });

    // Adjust iframe size
    JFCustomWidget.requestFrameResize({
      height: document.body.scrollHeight,
    });
  });
})();
