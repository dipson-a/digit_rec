from flask import Flask, render_template, request, jsonify
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import base64
from PIL import Image, ImageFilter
from io import BytesIO
from matplotlib import pylab as plt

model = load_model('digitrec_97.keras')
app = Flask(__name__)

def base64_to_array(base64_string):
    
    image_data = base64_string.replace('data:image/png;base64', '')
    # print(len(image_data))
    padding = len(image_data) % 4
    # print(padding)
    if padding != 0:
        image_data += ('=' * (4-padding))
    binary_data = base64.b64decode(image_data)
    
    # print(binary_data, type(binary_data))

    image = Image.open(BytesIO(binary_data))
    image = image.resize((28,28), Image.BILINEAR)
    image = image.convert('L')
    array = np.array(image)
    inverted = array - 255
    # print(array, type(array), array.shape)
    # print(inverted, type(inverted), inverted.shape)

    plt.title("recreated")
    plt.imshow(inverted, cmap = "gray")
    plt.show()
    flattened_im = np.reshape(inverted, (1, -1))
    # print(flattened_im, flattened_im.shape)
    return flattened_im

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/submit', methods = ['POST'])
def submit():
    data = request.json.get('imageData')

    if not data:
        return jsonify({'message': 'No image Data received'}), 400
    
    # print(data)
    image_flat = base64_to_array(data)
    prediction = model.predict(image_flat)
    preds = tf.nn.softmax(prediction)
    print("Prediction probabilities:", preds)
    predicted_label = np.argmax(preds)
    return jsonify({'message': f"your number is {predicted_label}"})

if __name__ == "__main__":
    app.run(debug=True)