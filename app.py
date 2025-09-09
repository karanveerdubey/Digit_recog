import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import tensorflow as tf
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageOps
import base64
import io
from dotenv import load_dotenv

# Load machine learning model
model = tf.keras.models.load_model('digit_reader_project.model')
load_dotenv()
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

# get env variable
app.config['DEBUG'] = os.environ.get('FLASK_DEBUG')



@app.route('/')
def home():
    return render_template('index.HTML')  # Ensure this HTML file exists in a 'templates' folder


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        image_data = data['image']
        
        image_data = image_data.split(",")[1]  # Remove the base64 header
        image = Image.open(io.BytesIO(base64.b64decode(image_data)))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        # image.save("debug_input_image.png")
        # image.show("debug_input_image.png")
        image = image.convert('L')
        image = image.resize((28, 28))  # Resize to match MNIST image dimensions
        image = ImageOps.invert(image)
        image = np.array(image)
        image = image / 255.0  # Normalize pixel values
        image = image.reshape(1, 28, 28, 1)
        



        prediction = model.predict(image)
        predicted_number = np.argmax(prediction)
        
        return jsonify({'prediction': int(predicted_number)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':

    app.run(host="0.0.0.0", port=8080)

# plt.imshow(image[0], plt.cm.binary)
# plt.show()