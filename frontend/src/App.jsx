import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

const ITEMS = [
  "Phone",
  "Wallet",
  "Keys",
  "Charger",
  "Water_Bottle",
  "Earphones",
  "Laptop",
  "Notebook",
  "Umbrella",
  "ID_Card",
];

function App() {
  const [form, setForm] = useState({
    day_of_week: "Monday",
    destination: "College",
    time_of_day: "Morning",
    weather: "Sunny",
    trip_duration: "Medium",
    item: "Phone",
    item_relevance: 5,
    item_importance: 5,
    times_carried_before: 10,
    previous_forget_count: 1,
  });

  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const [bagResults, setBagResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        [
          "item_relevance",
          "item_importance",
          "times_carried_before",
          "previous_forget_count",
        ].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const checkItem = async () => {
    setChecking(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Cannot connect to the backend. Make sure FastAPI is running on http://127.0.0.1:8000"
      );
    } finally {
      setChecking(false);
    }
  };

  const checkMyBag = async () => {
    setChecking(true);
    setError("");
    setBagResults([]);
    setResult(null);

    try {
      const results = [];

      for (const item of ITEMS) {
        const itemData = {
          ...form,
          item,
        };

        const response = await fetch(`${API_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemData),
        });

        if (!response.ok) {
          throw new Error(`Prediction failed for ${item}`);
        }

        const data = await response.json();

        results.push({
          ...data,
          item,
        });
      }

      results.sort(
        (a, b) => b.forget_probability - a.forget_probability
      );

      setBagResults(results);
    } catch (err) {
      console.error(err);
      setError(
        "Cannot connect to the backend. Make sure FastAPI is running on http://127.0.0.1:8000"
      );
    } finally {
      setChecking(false);
    }
  };

  const getRiskClass = (risk) => {
    if (risk === "HIGH") return "high";
    if (risk === "MEDIUM") return "medium";
    return "low";
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="hero-section">
        <div className="bag-icon">🎒</div><br/><br/>

        <h1>What Did I Forget?</h1>

        <p>
          AI-powered personal forgetfulness prediction
        </p>

        <div className="hero-badge">
          🧠 Machine Learning • Personalized Prediction
        </div>
      </header>

      {/* MAIN CARD */}
      <main className="main-card">

        {/* TRIP DETAILS */}
        <section className="section">
          <div className="section-title">
            <span>📍</span>
            <h2>Trip Details</h2>
          </div>

          <div className="form-grid">

            <div className="field">
              <label>Day of Week</label>

              <select
                name="day_of_week"
                value={form.day_of_week}
                onChange={handleChange}
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            </div>

            <div className="field">
              <label>Destination</label>

              <select
                name="destination"
                value={form.destination}
                onChange={handleChange}
              >
                <option>College</option>
                <option>Gym</option>
                <option>Home</option>
                <option>Office</option>
                <option>Travel</option>
              </select>
            </div>

            <div className="field">
              <label>Time of Day</label>

              <select
                name="time_of_day"
                value={form.time_of_day}
                onChange={handleChange}
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>

            <div className="field">
              <label>Weather</label>

              <select
                name="weather"
                value={form.weather}
                onChange={handleChange}
              >
                <option>Sunny</option>
                <option>Cloudy</option>
                <option>Rainy</option>
                <option>Hot</option>
                <option>Cold</option>
              </select>
            </div>

            <div className="field full">
              <label>Trip Duration</label>

              <select
                name="trip_duration"
                value={form.trip_duration}
                onChange={handleChange}
              >
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </select>
            </div>

          </div>
        </section>

        {/* ITEM DETAILS */}
        <section className="section item-section">

          <div className="section-title">
            <span>🎯</span>
            <h2>Item Details</h2>
          </div>

          <div className="form-grid">

            <div className="field full">
              <label>Select Item</label>

              <select
                name="item"
                value={form.item}
                onChange={handleChange}
              >
                {ITEMS.map((item) => (
                  <option key={item} value={item}>
                    {item.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>
                Item Relevance
                <span className="value">
                  {form.item_relevance}
                </span>
              </label>

              <input
                type="range"
                name="item_relevance"
                min="1"
                max="5"
                value={form.item_relevance}
                onChange={handleChange}
              />

              <div className="range-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="field">
              <label>
                Item Importance
                <span className="value">
                  {form.item_importance}
                </span>
              </label>

              <input
                type="range"
                name="item_importance"
                min="1"
                max="5"
                value={form.item_importance}
                onChange={handleChange}
              />

              <div className="range-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="field">
              <label>Times Carried Before</label>

              <input
                type="number"
                name="times_carried_before"
                min="0"
                value={form.times_carried_before}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Previous Forget Count</label>

              <input
                type="number"
                name="previous_forget_count"
                min="0"
                value={form.previous_forget_count}
                onChange={handleChange}
              />
            </div>

          </div>
        </section>

        {/* BUTTONS */}
        <div className="button-area">

          <button
            className="primary-button"
            onClick={checkItem}
            disabled={checking}
          >
            {checking ? "🔄 Checking..." : "🔍 Check My Item"}
          </button>

          <button
            className="secondary-button"
            onClick={checkMyBag}
            disabled={checking}
          >
            🎒 Check My Entire Bag
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            <strong>⚠️ Connection Error</strong>
            <p>{error}</p>
          </div>
        )}

        {/* SINGLE ITEM RESULT */}
        {result && (
          <section className="result-card">

            <div className="result-header">
              <span>🤖</span>
              <h2>Prediction Result</h2>
            </div>

            <div className="prediction-item">
              {result.item?.replace("_", " ")}
            </div>

            <div className="probability">
              {Number(result.forget_percentage).toFixed(1)}%
            </div><br/>

            <p className="probability-label">
              Forget Probability
            </p>

            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(
                    Number(result.forget_percentage),
                    100
                  )}%`,
                }}
              ></div>
            </div>

            <div className="result-details">

              <div>
                <span>Prediction</span>
                <strong>{result.prediction}</strong>
              </div>

              <div>
                <span>Risk Level</span>
                <strong
                  className={getRiskClass(result.risk)}
                >
                  {result.risk}
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* BAG RESULTS */}
        {bagResults.length > 0 && (
          <section className="bag-results">

            <div className="result-header">
              <span>🎒</span>
              <h2>Complete Bag Analysis</h2>
            </div>

            <p className="result-subtitle">
              Items are ranked according to their predicted
              forget probability.
            </p>

            <div className="top-alert">

              <span>🚨</span>

              <div>
                <strong>Top items to check before leaving</strong>

                <p>
                  {bagResults
                    .slice(0, 3)
                    .map((item) =>
                      item.item.replace("_", " ")
                    )
                    .join(" • ")}
                </p>
              </div>

            </div>

            <div className="bag-list">

              {bagResults.map((item, index) => (

                <div
                  className={`bag-item ${getRiskClass(
                    item.risk
                  )}`}
                  key={item.item}
                >

                  <div className="rank">
                    #{index + 1}
                  </div>

                  <div className="bag-item-name">
                    <strong>
                      {item.item.replace("_", " ")}
                    </strong>

                    <div className="mini-progress">
                      <div
                        style={{
                          width: `${Math.min(
                            Number(item.forget_percentage),
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bag-percentage">
                    {Number(
                      item.forget_percentage
                    ).toFixed(1)}
                    %
                  </div>

                  <div
                    className={`risk-badge ${getRiskClass(
                      item.risk
                    )}`}
                  >
                    {item.risk}
                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer>
        <p>
          Built with ❤️ using React + FastAPI + Machine Learning
        </p>

        <span>
          🎯 Personalized • 🧠 Intelligent • ⚡ Fast
        </span>
      </footer>

    </div>
  );
}

export default App;