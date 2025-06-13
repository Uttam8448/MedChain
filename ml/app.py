from flask import Flask, request, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load models and scalers
diabetes_model = pickle.load(open('diabetes_model.pkl', 'rb'))
heart_model = pickle.load(open('heart_model.pkl', 'rb'))
anemia_model = pickle.load(open('anemia_model.pkl', 'rb'))

scaler_diabetes = pickle.load(open('scaler_diabetes.pkl', 'rb'))
scaler_heart = pickle.load(open('scaler_heart.pkl', 'rb'))
scaler_anemia = pickle.load(open('scaler_anemia.pkl', 'rb'))

diabetes_features = pickle.load(open('diabetes_features.pkl', 'rb'))
heart_features = pickle.load(open('heart_features.pkl', 'rb'))
anemia_features = pickle.load(open('anemia_features.pkl', 'rb'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict_form', methods=['POST'])
def predict_form():
    try:
        form_data = request.form.to_dict()
        form_data = {k: float(v) for k, v in form_data.items()}
    
        form_data['Gender'] = form_data['Sex']


        d_input = [form_data[f] for f in diabetes_features]
        h_input = [form_data[f] for f in heart_features]
        a_input = [form_data[f] for f in anemia_features]

        d_scaled = scaler_diabetes.transform([d_input])
        h_scaled = scaler_heart.transform([h_input])
        a_scaled = scaler_anemia.transform([a_input])

        d_pred = diabetes_model.predict(d_scaled)[0]
        h_pred = heart_model.predict(h_scaled)[0]
        a_pred = anemia_model.predict(a_scaled)[0]

        result = {
            'diabetes': 'Positive' if d_pred == 1 else 'Negative',
            'heart_disease': 'Positive' if h_pred == 1 else 'Negative',
            'anemia': 'Positive' if a_pred == 1 else 'Negative'
        }

        return render_template('index.html', result=result)

    except Exception as e:
        return f"⚠️ Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)

