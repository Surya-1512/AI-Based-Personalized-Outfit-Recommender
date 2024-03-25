from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import re
from io import BytesIO
import base64
from PIL import Image
import urllib
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
import tensorflow
from tensorflow.keras.preprocessing import image
from tensorflow.keras.layers import GlobalMaxPooling2D
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
import gzip
import cv2

application = Flask(__name__)
CORS(application, resources={r"/*": {"origins": "http://localhost:3000"}})


# Load Myntra Dataset
myntra = pd.read_csv('/content/sample/myntra.csv')

# Sig file which contains similarity between each product
# sig = pickle.load(open('sig.pkl', 'rb'))
# Load the .npz file
# Load the compressed numpy array

# Load the compressed numpy array
with gzip.open('/content/sample/sig1.npy.gz', 'rb') as f:
    sig1 = np.load(f)

with gzip.open('/content/sample/sig2.npy.gz', 'rb') as f:
    sig2 = np.load(f)

with gzip.open('/content/sample/sig3.npy.gz', 'rb') as f:
    sig3 = np.load(f)

with gzip.open('/content/sample/sig4.npy.gz', 'rb') as f:
    sig4 = np.load(f)

# print(sig1.shape, sig2.shape, sig3.shape, sig4.shape)

# Merge arrays vertically
sig = np.vstack((sig1, sig2, sig3, sig4))

# print(sig)

# Indices to get product title
indices = pickle.load(open('/content/sample/indices.pkl', 'rb'))

# features of each product image in our dataset
embeddings = np.array(pickle.load(open('/content/sample/embeddings.pkl', 'rb')))

# all popular products in men's category
men_popular = pd.read_pickle(r'/content/sample/men_popular.pkl')

# all popular products in women's category
women_popular = pd.read_pickle(r'/content/sample/women_popular.pkl')

# all popular products
popular_products = pd.read_pickle(r'/content/sample/popular_products.pkl')

filtered_indices = pd.read_pickle(r'/content/sample/filtered_indices.pkl')
filtered_indices = np.array(filtered_indices)

# resnet model to train uploaded images
model = ResNet50(weights='imagenet', include_top=False,
                 input_shape=(224, 224, 3))
model.trainable = False

model = tensorflow.keras.Sequential([
    model,
    GlobalMaxPooling2D()
])

# function to extract features from image
def feature_extraction(img_array, model):

    # expand the dimention of image array
    expanded_img_array = np.expand_dims(img_array, axis=0)

    preprocessed_img = preprocess_input(expanded_img_array)

    # Get the features of image
    result = model.predict(expanded_img_array).flatten()

    return result / norm(result)

# Recommand sililar feature products
def recommend(features, feature_list):
    neighbors = NearestNeighbors(
        n_neighbors=6, algorithm='brute', metric='euclidean')
    neighbors.fit(feature_list)

    distances, indices = neighbors.kneighbors([features])

    return indices

# Return all best selling products
@application.route('/bestsellers', methods=['GET'])
def get_data():
    return popular_products.to_json(orient='records')

# return all best selling products in men's category
@application.route('/menProducts', methods=['GET'])
def get_men_data():
    return men_popular.to_json(orient='records')

# return all best selling products in women's category
@application.route('/womenProducts', methods=['GET'])
def get_women_data():
    return women_popular.to_json(orient='records')

# return all products data
@application.route('/allProducts', methods=['GET'])
def get_all_data():
    return myntra.to_json(orient='records')

# Give similar products data based on title
@application.route('/prod/<title>', methods=['GET'])
def get_prod(title):
    index = indices[title]
    sig_cs = list(enumerate(sig[index]))

    # Sorting done based on similarity
    sig2 = sorted(sig_cs, key=lambda x: x[1], reverse=True)

    # get 12 products
    sig_cs2 = sig2[1: 13]

    product_indices = [i[0] for i in sig_cs2]

    return myntra.iloc[product_indices].to_json(orient='records')

# Give buying recommandation of products based on title
@application.route('/recommand/<title>', methods=['GET'])
def get_recommand(title):
    index = np.where(myntra['title'] == title)[0][0]
    output = filtered_indices[index][1:]
    return myntra.iloc[output].to_json(orient='records')

# Return similar products based on image features
@application.route('/imageData', methods=['POST'])
def get_image_data():
    img_data = request.get_json()
    img = img_data['data'][23:]

    # Load the image from base64 format and resize it to (224 x 224) so that it can be fed to the model
    im = Image.open(BytesIO(base64.b64decode(img))).resize((224, 224))

    # Convert image into array
    img_array = np.array(im)

    # Extract features from the image
    features = feature_extraction(img_array, model)

    # Get the similar products indices
    indices = recommend(features, embeddings)

    return myntra.iloc[indices[0]].to_json(orient='records')


# Define the paths for uploaded images and main.py file
input_dir = '/content/sample/TryYours-Virtual-Try-On/static'
MAIN_PY_PATH = '/content/sample/TryYours-Virtual-Try-On/main.py'

# Function to run the main.py file
def run_main_py():
    # Check if the main.py file exists
    if os.path.exists(MAIN_PY_PATH):
        # Execute the main.py file
        subprocess.run(['python', MAIN_PY_PATH])
        return True
    else:
        return False

# Function to upload cloth image
@application.route('/upload_cloth', methods=['POST'])
def upload_cloth():
    if 'cloth_image' not in request.files:
        return jsonify({'error': 'No cloth image uploaded'})

    cloth_image = request.files['cloth_image']
    cloth_image.save(os.path.join(input_dir, 'cloth_web.jpg'))

    # Check if both images are uploaded and run main.py
    if 'person_image' in request.files:
        run_main_py()

    return jsonify({'message': 'Cloth image uploaded successfully'})

# Function to upload person image
@application.route('/upload_person', methods=['POST'])
def upload_person():
    if 'person_image' not in request.files:
        return jsonify({'error': 'No person image uploaded'})

    person_image = request.files['person_image']
    person_image.save(os.path.join(input_dir, 'origin_web.jpg'))

    # Check if both images are uploaded and run main.py
    if 'cloth_image' in request.files:
        run_main_py()

    return jsonify({'message': 'Person image uploaded successfully'})

# Function to display the final image
def display_final_image():
    image_path = "/content/sample/TryYours-Virtual-Try-On/static/finalimg.png"
    if os.path.exists(image_path):
        image1 = Image.open(image_path)
        image1.show()
        return jsonify({'message': 'Final image displayed'})
    else:
        return jsonify({'error': 'Final image not found'})

# Route to display the final image
@application.route('/display_image', methods=['GET'])
def display_image():
    return display_final_image()

if __name__ == '__main__':
    application.run()
