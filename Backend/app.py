from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import base64
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
CORS(app)

#load models
model1 = tf.keras.models.load_model(r'.\best_model.h5')
model2 = tf.keras.models.load_model(r'.\model_fit_12-1.00.h5')

IMAGE_SIZE = [224, 224]
classes1 = ["diseased", "not diseased"]
classes2 = [ "mange", "ringworm"]
ringworm_weights = {'q1': 0.03, 'q2': 0.5, 'q3': 0.03, 'q4': 0.5, 'q5': 0.03, 'q6': 0.5}
mange_weights = {'q1': 0.5, 'q2': 0.03, 'q3': 0.5, 'q4': 0.03, 'q5': 0.2, 'q6': 0.03}

def calculate_weighted_sum(weights, form_data):
    return sum(weights[q] * float(form_data[q]) for q in weights)

def load_image(filename):
    img = cv2.imread(filename)
    if img is None:
        raise ValueError("Unable to load image. Please check the file path.")
    img = cv2.resize(img, (IMAGE_SIZE[0], IMAGE_SIZE[1]))
    img = img / 255.0  # Normalize pixel values
    return img

def preprocess_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))  # Resize to model input size
    img_array = image.img_to_array(img)  # Convert to array
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Normalize (same as training)
    return img_array

def segment_image(image):
    if image.dtype != 'uint8':
        image = (image * 255).astype('uint8')
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Get the middle pixel of the image
    height, width, _ = image.shape
    middle_x = width // 2
    middle_y = height // 2

    # Get the HSV value of the middle pixel
    middle_hsv = hsv[middle_y, middle_x]

    # Define the color range for affected skin based on the middle pixel
    lower_affected_skin = np.array([middle_hsv[0] - 10, middle_hsv[1] - 50, middle_hsv[2] - 50])
    upper_affected_skin = np.array([middle_hsv[0] + 10, middle_hsv[1] + 50, middle_hsv[2] + 50])

    # Create a mask for affected skin
    mask_affected_skin = cv2.inRange(hsv, lower_affected_skin, upper_affected_skin)

    # Apply morphological operations to refine the mask
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    mask_affected_skin = cv2.erode(mask_affected_skin, kernel, iterations=2)
    mask_affected_skin = cv2.dilate(mask_affected_skin, kernel, iterations=2)

    # Find contours of the affected areas
    contours, _ = cv2.findContours(mask_affected_skin, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Create a mask for the contours
    contour_mask = np.zeros_like(image)
    cv2.drawContours(contour_mask, contours, -1, (255, 255, 255), thickness=cv2.FILLED)

    # Extract the regions of interest from the original image using the mask
    extracted_image = cv2.bitwise_and(image, contour_mask)

    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to enhance the contrast
    lab = cv2.cvtColor(extracted_image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    limg = cv2.merge((cl, a, b))
    enhanced_image = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

    # Apply unsharp masking to sharpen the image
    gaussian_blur = cv2.GaussianBlur(enhanced_image, (5, 5), 0)
    unsharp_mask = cv2.addWeighted(enhanced_image, 1.5, gaussian_blur, -0.5, 0)

    return unsharp_mask

def predict1(img_array):
    #probability = model1.predict(np.asarray([image]))[0][0]
    probability = model1.predict(img_array)[0][0]
    print(float(probability))
    predicted_class = classes1[1] if probability > 0.5 else classes1[0]
    confidence = probability if probability > 0.5 else 1 - probability
    return {predicted_class: float(confidence)}

def predict2(image):
    probability = model2.predict(np.asarray([image]))[0][0]
    predicted_class = classes2[1] if probability > 0.5 else classes2[0]
    confidence = probability if probability > 0.5 else 1 - probability
    return {predicted_class: float(confidence)}


@app.route('/api/survey', methods=['POST'])
def survey():
    # Check if image is in the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    # Get image file
    image_file = request.files['image']
    
    filename = 'uploaded_image.jpg'
    image_file.save(filename)

    segmented_filename = None
    
    try:
        # Load and preprocess the image
        image = load_image(filename)
        if image is None:
                return jsonify({'error': 'Unable to load image. Please check the file format.'})
        print("Image shape:", image.shape)
        print("Image data type:", image.dtype)
        
        if image.dtype != 'uint8':
            image = (image * 255).astype('uint8')

        segmented_image = segment_image(image)

        if segmented_image is None:
            return jsonify({'error': 'Segmentation failed. Please check the image content.'})
        segmented_filename = 'segmented_image.jpg'
        cv2.imwrite(segmented_filename, segmented_image)

        segmented_img = load_image(segmented_filename)
        if segmented_img is None:
            return jsonify({'error': 'Unable to load segmented image.'})

        prediction = predict2(segmented_img)
        if not prediction:
            return jsonify({'error': 'Prediction failed. Please check the model.'})
        
        print(prediction)

        form_data = {
            'q1': request.form.get('q1'),
            'q2': request.form.get('q2'),
            'q3': request.form.get('q3'),
            'q4': request.form.get('q4'),
            'q5': request.form.get('q5'),
            'q6': request.form.get('q6')
        }
        
        rw = calculate_weighted_sum(ringworm_weights, form_data)
        ma = calculate_weighted_sum(mange_weights, form_data)
        
        diagnosis = "Ringworm" if rw > ma else "Mange"
        final=""
        survey_score = 0.5*abs(rw-ma)
        model_score = 0.5*float(list(prediction.values())[0])
        print(survey_score, model_score)
        if survey_score >= model_score:
            final = diagnosis
        else:
            final = list(prediction.keys())[0]
        
        _, buffer = cv2.imencode('.jpg', segmented_img)
        output_image_base64 = base64.b64encode(buffer).decode('utf-8')

        
        return jsonify({
            'rw': rw,
            'ma': ma,
            'answer': final,
            'model_prediction': prediction,
            'output_image': output_image_base64
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # if segmented_filename and os.path.exists(segmented_filename):
        #     os.remove(segmented_filename)
        if filename and os.path.exists(filename):
            os.remove(filename)
                

@app.route('/api/validate-image', methods=['POST'])
def initial_diagnosis():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    filename = 'uploaded_image.jpg'
    file.save(filename)

    try:
        img_array = preprocess_image(filename)
        img = load_image(filename)
        if img.dtype != 'uint8':
            img = (img * 255).astype('uint8') 
        prediction = predict1(img_array)
        if not prediction:
            return jsonify({'error': 'Prediction failed. Please check the model.'})

        print(prediction)
        result = False
        if list(prediction.keys())[0] == "diseased":
            result = True
        _, buffer = cv2.imencode('.jpg', img)
        processed_image_base64 = base64.b64encode(buffer).decode('utf-8')

        return jsonify({
            'result': result,
            'initialDiagnosis': list(prediction.keys())[0],
            'confidence': float(list(prediction.values())[0]),
            'processed_image': processed_image_base64
        })
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'})
    finally:
        #Delete the temporary files
        if os.path.exists(filename):
            os.remove(filename)


if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
