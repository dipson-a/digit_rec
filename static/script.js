document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;

        function getPointerPosition(event) {
            const rect = canvas.getBoundingClientRect();
            let x, y;
            if (event.touches && event.touches[0]) {
                x = event.touches[0].clientX - rect.left;
                y = event.touches[0].clientY - rect.top;
            } else {
                x = event.clientX - rect.left;
                y = event.clientY - rect.top;
            }
            return { x, y };
        }

        function startDrawing(event) {
            drawing = true;
            const { x, y } = getPointerPosition(event);
            ctx.beginPath();
            ctx.moveTo(x, y);
            event.preventDefault();
        }

        function stopDrawing() {
            drawing = false;
            ctx.closePath();
        }

        function draw(event) {
            if (!drawing) return;
            const { x, y } = getPointerPosition(event);
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'black';
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            event.preventDefault();
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

