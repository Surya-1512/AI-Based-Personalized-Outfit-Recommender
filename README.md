
#AI BASED PERSONALIZED OUTFIT RECOMMENDER - Wear Now


Wear Now is built using various recommandation algorithms such as popularity based ,content based and collaborative filtering.

Popularity Based Recommender System works on the principle of popularity and or anything which is in trend. It recommends products based on Total Number of Ratings on products and average product rating given by users and fetch popular amongst them.

Content Based Recommender System works on the principle of similar content. It recommends products based on similar content of the product.The model recommands similar products to the user based on cosine similarity.

Real-Time Weather-Based Suggestions
The system retrieves the user's location using the OpenWeather API and provides fashion recommendations tailored to the current weather conditions. This ensures that users receive suggestions suitable for their local weather, enhancing their shopping experience.

Occasion-Based Outfit Suggestions
Utilizing the OpenAI API, the system offers outfit recommendations based on various occasions such as parties, casual outings, formal events, etc. By analyzing the context provided by the user regarding the occasion, the system suggests appropriate clothing options to match the specific event or activity.

Virtual Try-On Based on HR-VITON Model and Graphonomy Master Postnet Modules
The virtual try-on feature utilizes advanced computer vision techniques powered by the HR-VITON model and Graphonomy master postnet modules. Users can upload images of themselves, and the system superimposes virtual outfits onto their images, allowing them to visualize how different clothing items would look on them before making a purchase. This immersive experience enhances user engagement and confidence in their purchasing decisions.

By integrating these additional features, Wear Now provides a comprehensive and personalized fashion recommendation system that caters to users' preferences, weather conditions, occasions, and virtual try-on needs. This multi-faceted approach ensures a rich and satisfying user experience, ultimately driving increased user satisfaction and engagement with the platform.



## Goals of the project

    The main goal of this project is to provide a personalized fashion recommendation system that can help users find fashion products that match their preferences. The system also aims to provide an interactive user interface that is easy to use and navigate.

## Process

    The first step in developing this project was to collect and prepare the dataset of 17000 Myntra products. Next, different machine learning algorithms such as popularity-based, collaborative filtering, hybrid, and ResNet-based feature extraction were trained using this dataset. Then, these algorithms and features were integrated into the Flask backend.

    For the front-end, Reactjs and Bootstrap were used to create an interactive user interface. Firebase authentication was also integrated into the system to ensure secure user authentication.

## Features

    1. Image-based fashion recommendation: 
    Users can upload images of fashion products they like, and the system will recommend similar products based on the ResNet-based feature extraction.

    2. Different recommendation algorithms: 
    The system uses different recommendation algorithms such as popularity-based, collaborative filtering, and hybrid to provide a variety of recommendations to users.

    3. Personalized recommendations: 
    The system provides personalized recommendations to users based on their preferences and past interactions with the website.

    4. Secure authentication: 
    Firebase authentication is used to ensure that only authorized users can access the website.

    5. Interactive user interface: 
    The system has an interactive user interface created using Reactjs and Bootstrap, making it easy for users to navigate and use the website.






## Tech Stack

**Client:** React, Materil-UI, react-bootstrap

**Server:** Python, Flask

**Database:** Firebase



## Run Locally - Front End


Clone the project

```bash
  git clone https://github.com/AI-Based-Personalized-Outfit-Recommender
```

Go to the project directory

```bash
  cd Frontend
```

Go to requirements.txt file in the same folder and install all required dependencies.


```bash
  npm install
```












#Before starting the server
Make sure to paste the appropriate API Keys 
1. In '\Frontend\src\components\Weather\Weather.js'
    paste the  OpenCage API key & OpenWeatherMap API key.
2. In '\Frontend\src\components\Occassion\Occasion.js'
   paste the OPENAI API key.

And also make sure to update the appropriate Backend url in '\Frontend\src\components\Product\axios.js' file.
* If you use ngrok then update the backend url according to it.
* If you're running the backend locally then no need to update as I had kept the default backend url as localhost url.
   
 
Start the server


```bash
  npm run start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Backend

For Backend take a look at this Notebook : [https://colab.research.google.com/drive/1tsAChJ4rytxk1RPRS8fdrgS8nB1o505I#scrollTo=hLqmAUF4Nh-A](https://colab.research.google.com/drive/1SkCvd_fSeoJJ0GY9MK30EJo151330DDL#scrollTo=hLqmAUF4Nh-A)

For Running Backend make sure to have your Ngrok auth token pasted in the above colab link.

## For Running Backend Locally 
It requires GPU to run the backend locally... only proceed if you have GPU and CUDA is configured, if not then run the project in colab which I gave above, if you're running the project in COlab make sure to update the **ngrok auth token** in colab and update the backend url in front end as mentioned above. **And also make sure to update the appropriate Backend url in '\Frontend\src\components\Product\axios.js' file.**
 Create .flaskenv file and add these 2 code in it
```bash
    FLASK_ENV=development
    FLASK_APP=application.py

```

Download backend_files from here:
***Paste the below two models in '\content\TryYours-Virtual-Try-On\HR-VITON-main' ***   
1. https://drive.google.com/u/0/uc?id=1T5_YDUhYSSKPC_nZMk2NeC-XXUFoYeNy&export=download   
2. https://drive.google.com/u/0/uc?id=1XJTCdRBOPVgVTmqzhVGFAgMm2NLkw5uQ&export=download   
*** Paste the below model in '\content\TryYours-Virtual-Try-On\Graphonomy-master' ***   
1. https://drive.google.com/u/0/uc?id=1eUe18HoH05p0yFUd_sN6GXdTj82aW0m9&export=download  

   
Open new terminal and run

```bash
  cd content\TryYours-Virtual-Try-On
```
Before creating virtual environment in order to run the tryon model need to install some neccessary models before
to install it in terminal run the following commands


```bash
  python -m pip install 'git+https://github.com/facebookresearch/detectron2.git'
  pip install --upgrade --no-cache-dir gdown
```
once they are installed then proceed to further steps
Create Virtual Environment in Python
```bash
  pip install virtualenv
```
```bash
  virtualenv env
```


For Windows
```bash
  .\env\Scripts\activate
```

For Mac

```bash
    source env/bin/activate
```

Install all python modules which are in content/TryYours-Virtual-Try-On/requirements.txt file

```bash
    pip install -r requirements.txt
```



Once all the requirement is installed then run the following command to run the backend 
```bash
    flask run
```
** It will start the server in 'http://127.0.0.1:5000/' **



## API Reference

#### Get 100 best selling Products- Popularity based recommendation

```
  GET /api/bestsellers
```




#### Get BestSelling products for men- Popularity based recommendation

```
  GET /menProducts
```
#### Get BestSelling products for women- Popularity based recommendation

```
  GET /womenProducts
```

#### Get all products data

```
  GET /allProducts
```

#### Get Similar Items - Content Based Recommandation

```
  GET /prod/${title}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | Title of the product from which fetch all similar products

#### Get Recommandation of products based on ratings- Collaborative Filtering

```
  GET /recommand/${title}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `title`      | `string` | Title of the product from which fetch related products which user should buy based on ratings

### get the similar products available on website based on image- Fashion recommandation using Resnet model

```
  GET /imageData
```

### Send uploaded image data to backend for image preprocessing, feature extraction and recommandation

```
  POST /imageData
```
### Upload Cloth Image

```
  POST /upload_cloth
```
### Upload Person Image

```
  POST /upload_person
```

### To run the main script i.e., for virtual try on
```
 GET /run_main_py
```
### To display the image i.e., try on output
```
 GET /display_image
```


In Case of any doubts or if you need assistance in running the project, feel free to reach out to me:
- **LinkedIn:** [Surya S S](https://www.linkedin.com/in/surya-s-s-1512-/)
- **Email:** suryass1215@gmail.com



