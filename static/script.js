document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;

    canvas.width = 280;
    canvas.height = 280;

    // Fill the canvas with a white background initially
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Function to start drawing
    const startDrawing = (e) => {
        drawing = true;
        draw(e);
    };

    // Function to stop drawing
    const endDrawing = () => {
        drawing = false;
        ctx.beginPath();
    };

    // Function to draw on the canvas

        function draw(event) {
            if (!drawing) return;

            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'black';

            let x, y;
            if (event.type.includes('touch')) {
                const rect = canvas.getBoundingClientRect();
                x = event.touches[0].clientX - rect.left;
                y = event.touches[0].clientY - rect.top;
            } else {
                x = event.offsetX;
                y = event.offsetY;
            }

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        // Mouse events
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);

        // Touch events
        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchmove', draw);

    // Reset button functionality
    document.getElementById('Reset').addEventListener('click', () => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    });

    // Submit button functionality
    document.getElementById('Submit').addEventListener('click', () => {
        const imageData = canvas.toDataURL('image/png');
        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

