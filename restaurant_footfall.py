
#################################################################################


import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime
import joblib

# ------------------------------------------------------------
# 1. LOAD DATASETS
# ------------------------------------------------------------
foot = pd.read_excel('/home/UnMasked9o9/Downloads/vb_hourly_footfall_updated.csv.xlsx')
events = pd.read_csv('/home/UnMasked9o9/Downloads/vidyarthi_bhavan_events.csv')

foot['date'] = pd.to_datetime(foot['date'])
events['date'] = pd.to_datetime(events['date'], dayfirst=True)

# If event names only → map them to numeric impact
event_map = {
    'Weekend Breakfast Rush': 150,
    'Gandhi Bazaar Market Peak': 300,
    'Tourist Footfall from Nearby Temples': 250,
    'College Crowd from NMKRV Visiting': 180,
    'Local Food Walk Event': 350
}

events['event_value'] = events['events'].map(event_map).fillna(50)

# Merge
df = foot.merge(events[['date', 'event_value']], on='date', how='left')
df['event_value'] = df['event_value'].fillna(0)

# Day + weekend
df['day'] = df['date'].dt.day_name()
df['is_weekend'] = (df['date'].dt.weekday >= 5).astype(int)

# Encode day as number
day_map = {
    'Monday':0,'Tuesday':1,'Wednesday':2,'Thursday':3,
    'Friday':4,'Saturday':5,'Sunday':6
}
df['day_num'] = df['day'].map(day_map)

# ------------------------------------------------------------
# 2. TRAIN MODEL
# ------------------------------------------------------------
X = df[['day_num', 'is_weekend', 'hour', 'event_value']]
y = df['customers_hourly']

model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, "footfall_model.pkl")
print("\n🎉 Model trained and saved as footfall_model.pkl")

# ------------------------------------------------------------
# 3. FUNCTION: PREDICT FROM DATE + TIME + EVENT
# ------------------------------------------------------------
def predict_footfall(date_str, hour, event_footfall):
    # Load model
    model = joblib.load("footfall_model.pkl")

    # Convert date
    date = pd.to_datetime(date_str)
    day_name = date.day_name()
    is_weekend = 1 if date.weekday() >= 5 else 0
    day_num = day_map[day_name]

    # Single row for prediction
    input_data = pd.DataFrame([{
        'day_num': day_num,
        'is_weekend': is_weekend,
        'hour': hour,
        'event_value': event_footfall
    }])

    pred = model.predict(input_data)[0]
    return int(pred)

# ------------------------------------------------------------
# 4. USER INPUT MODE
# ------------------------------------------------------------
print("\n=== Footfall Prediction ===")
date_in = input("Enter date (YYYY-MM-DD): ")
hour_in = int(input("Enter hour (0–23): "))
event_in = int(input("Enter event footfall expected: "))

result = predict_footfall(date_in, hour_in, event_in)
print(f"\n👉 Predicted footfall at {hour_in}:00 on {date_in}: {result}")
