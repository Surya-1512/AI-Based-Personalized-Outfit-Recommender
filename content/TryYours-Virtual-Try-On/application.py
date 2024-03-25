from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import re
from io import BytesIO
import base64
from PIL import Image
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
import tensorflow
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
import gzip
import cv2
import subprocess
import os

application = Flask(__name__)
CORS(application, resources={r"/*": {"origins": "*"}})  # Allow requests from all origins

# Load Myntra Dataset
myntra = pd.read_csv('/content/TryYours-Virtual-Try-On/sample/myntra.csv')

# Load the compressed numpy arrays
with gzip.open('/content/TryYours-Virtual-Try-On/sample/sig1.npy.gz', 'rb') as f:
    sig1 = np.load(f)

with gzip.open('/content/TryYours-Virtual-Try-On/sample/sig2.npy.gz', 'rb') as f:
    sig2 = np.load(f)

with gzip.open('/content/TryYours-Virtual-Try-On/sample/sig3.npy.gz', 'rb') as f:
    sig3 = np.load(f)

with gzip.open('/content/TryYours-Virtual-Try-On/sample/sig4.npy.gz', 'rb') as f:
    sig4 = np.load(f)

# Merge arrays vertically
sig = np.vstack((sig1, sig2, sig3, sig4))

# Indices to get product title
indices = pickle.load(open('/content/TryYours-Virtual-Try-On/sample/indices.pkl', 'rb'))

# Features of each product image in our dataset
embeddings = np.array(pickle.load(open('/content/TryYours-Virtual-Try-On/sample/embeddings.pkl', 'rb')))

# All popular products in men's category
men_popular = pd.read_pickle(r'/content/TryYours-Virtual-Try-On/sample/men_popular.pkl')

# All popular products in women's category
women_popular = pd.read_pickle(r'/content/TryYours-Virtual-Try-On/sample/women_popular.pkl')

# All popular products
popular_products = pd.read_pickle(r'/content/TryYours-Virtual-Try-On/sample/popular_products.pkl')

filtered_indices = pd.read_pickle(r'/content/TryYours-Virtual-Try-On/sample/filtered_indices.pkl')
filtered_indices = np.array(filtered_indices)

# Resnet model to train uploaded images
model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model.trainable = False
model = tensorflow.keras.Sequential([
    model,
    GlobalMaxPooling2D()
])

# Function to extract features from image
def feature_extraction(img_array, model):
    expanded_img_array = np.expand_dims(img_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img_array)
    result = model.predict(expanded_img_array).flatten()
    return result / norm(result)

# Recommend similar feature products
def recommend(features, feature_list):
    neighbors = NearestNeighbors(n_neighbors=6, algorithm='brute', metric='euclidean')
    neighbors.fit(feature_list)
    distances, indices = neighbors.kneighbors([features])
    return indices

# Routes
@application.route('/bestsellers', methods=['GET'])
def get_data():
    return popular_products.to_json(orient='records')

@application.route('/menProducts', methods=['GET'])
def get_men_data():
    return men_popular.to_json(orient='records')

@application.route('/womenProducts', methods=['GET'])
def get_women_data():
    return women_popular.to_json(orient='records')

@application.route('/allProducts', methods=['GET'])
def get_all_data():
    return myntra.to_json(orient='records')

@application.route('/prod/<title>', methods=['GET'])
def get_prod(title):
    index = indices[title]
    sig_cs = list(enumerate(sig[index]))
    sig2 = sorted(sig_cs, key=lambda x: x[1], reverse=True)
    sig_cs2 = sig2[1: 13]
    product_indices = [i[0] for i in sig_cs2]
    return myntra.iloc[product_indices].to_json(orient='records')

@application.route('/recommand/<title>', methods=['GET'])
def get_recommand(title):
    index = np.where(myntra['title'] == title)[0][0]
    output = filtered_indices[index][1:]
    return myntra.iloc[output].to_json(orient='records')

@application.route('/imageData', methods=['POST'])
def get_image_data():
    img_data = request.get_json()
    img = img_data['data'][23:]
    im = Image.open(BytesIO(base64.b64decode(img))).resize((224, 224))
    img_array = np.array(im)
    features = feature_extraction(img_array, model)
    indices = recommend(features, embeddings)
    return myntra.iloc[indices[0]].to_json(orient='records')

# Paths for uploaded images and main.py file
input_dir = '/content/TryYours-Virtual-Try-On/static'
MAIN_PY_PATH = '/content/TryYours-Virtual-Try-On/main.py'

# Function to run the main.py file
@application.route('/run_main_py', methods=['GET'])
def run_main_py():
    try:
        result = subprocess.run(['python', MAIN_PY_PATH])
        return jsonify({'message': 'Main script executed successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@application.route('/upload_cloth', methods=['POST'])
def upload_cloth():
    if 'cloth_image' not in request.files:
        return jsonify({'error': 'No cloth image uploaded'})
    cloth_image = request.files['cloth_image']
    cloth_image.save(os.path.join(input_dir, 'cloth_web.jpg'))
    return jsonify({'message': 'Cloth image uploaded successfully'})

@application.route('/upload_person', methods=['POST'])
def upload_person():
    if 'person_image' not in request.files:
        return jsonify({'error': 'No person image uploaded'})
    person_image = request.files['person_image']
    person_image.save(os.path.join(input_dir, 'origin_web.jpg'))
    return jsonify({'message': 'Person image uploaded successfully'})

@application.route('/display_image', methods=['GET'])
def display_final_image():
    image_path = "/content/TryYours-Virtual-Try-On/static/finalimg.png"
    if os.path.exists(image_path):
        return send_file(image_path, mimetype='image/png')
    else:
        return jsonify({'error': 'Final image not found'})

if __name__ == '__main__':
    application.run()
