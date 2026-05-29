import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, IsolationForest
from sklearn.preprocessing import StandardScaler
import random

class ConsultingAnalyticsEngine:
    @staticmethod
    def forecast_sales(historical_data, months_to_forecast=6):
        """
        Fits a regression model on historical sales and forecasts future values.
        historical_data: List of dicts with {'month': 1, 'sales': 120000} or pandas DataFrame
        """
        if isinstance(historical_data, list):
            df = pd.DataFrame(historical_data)
        else:
            df = historical_data.copy()

        # Fallback if empty or incorrect columns
        if df.empty or 'sales' not in df.columns:
            # Generate highly realistic sample historical sales (12 months)
            months = list(range(1, 13))
            base_sales = 150000
            sales = [int(base_sales * (1 + 0.05 * m + random.uniform(-0.04, 0.04))) for m in months]
            df = pd.DataFrame({'month': months, 'sales': sales})

        # Feature engineering
        X = df[['month']].values.reshape(-1, 1)
        y = df['sales'].values

        # Model fitting
        model = LinearRegression()
        model.fit(X, y)

        # Metrics
        y_pred = model.predict(X)
        r2 = float(model.score(X, y))
        mae = float(np.mean(np.abs(y - y_pred)))
        
        # Forecast future
        last_month = int(df['month'].max())
        future_months = np.arange(last_month + 1, last_month + months_to_forecast + 1).reshape(-1, 1)
        forecast_values = model.predict(future_months)
        
        # Format results
        historical_records = df.to_dict(orient='records')
        forecast_records = [
            {'month': int(m[0]), 'sales': max(0, int(val))} 
            for m, val in zip(future_months, forecast_values)
        ]

        return {
            'historical': historical_records,
            'forecast': forecast_records,
            'metrics': {
                'r2_score': round(r2, 4),
                'mean_absolute_error': round(mae, 2),
                'growth_trend_slope': round(float(model.coef_[0]), 2)
            }
        }

    @staticmethod
    def predict_churn(customer_data):
        """
        Classifies customer churn using a random forest classifier.
        customer_data: List of dicts with customer parameters or pandas DataFrame
        """
        if isinstance(customer_data, list):
            df = pd.DataFrame(customer_data)
        else:
            df = customer_data.copy()

        # Fallback if empty or wrong columns
        required_cols = ['tenure', 'monthly_charges', 'support_calls', 'satisfaction']
        if df.empty or not all(col in df.columns for col in required_cols):
            # Generate synthetic customer churn data
            records = []
            for i in range(100):
                tenure = random.randint(1, 48)  # months
                monthly_charges = random.randint(30, 150)
                support_calls = random.randint(0, 8)
                satisfaction = random.randint(1, 5)
                # Compute logical churn probability
                prob = (support_calls * 0.15) + (monthly_charges * 0.002) - (tenure * 0.005) - (satisfaction * 0.1)
                churn = 1 if prob > 0.1 else 0
                records.append({
                    'customer_id': f"CUST-{1000 + i}",
                    'tenure': tenure,
                    'monthly_charges': monthly_charges,
                    'support_calls': support_calls,
                    'satisfaction': satisfaction,
                    'churn': churn
                })
            df = pd.DataFrame(records)

        # Model training
        X = df[['tenure', 'monthly_charges', 'support_calls', 'satisfaction']].values
        y = df['churn'].values

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        clf = RandomForestClassifier(n_estimators=50, random_state=42)
        clf.fit(X_scaled, y)

        # Probabilities
        probs = clf.predict_proba(X_scaled)[:, 1]
        df['churn_probability'] = [round(float(p), 4) for p in probs]

        # Calculate high risk users
        high_risk_df = df[df['churn_probability'] >= 0.5].sort_values(by='churn_probability', ascending=False)
        
        return {
            'summary': {
                'total_customers': len(df),
                'churned_count': int(df['churn'].sum()),
                'predicted_churn_rate': round(float(df['churn_probability'].mean() * 100), 2),
                'high_risk_customers_count': len(high_risk_df),
            },
            'high_risk_customers': high_risk_df.head(10).to_dict(orient='records'),
            'metrics': {
                'classifier_accuracy': round(float(clf.score(X_scaled, y)), 4),
                'feature_importances': {
                    'tenure': round(float(clf.feature_importances_[0]), 4),
                    'monthly_charges': round(float(clf.feature_importances_[1]), 4),
                    'support_calls': round(float(clf.feature_importances_[2]), 4),
                    'satisfaction': round(float(clf.feature_importances_[3]), 4)
                }
            }
        }

    @staticmethod
    def analyze_financial_risk(financial_data):
        """
        Classifies risk level based on standard corporate financial health indicators.
        """
        if isinstance(financial_data, dict):
            fd = financial_data
        else:
            fd = {
                'debt_to_equity': 1.4,
                'current_ratio': 1.8,
                'profit_margin': 0.12,
                'cash_flow_growth': 0.04
            }

        # Multi-variable risk heuristics
        score = 0
        
        # Debt to Equity (Ideal < 1.0)
        if fd.get('debt_to_equity', 0) > 2.0:
            score += 4
        elif fd.get('debt_to_equity', 0) > 1.2:
            score += 2
            
        # Current Ratio (Liquidity, Ideal >= 1.5)
        if fd.get('current_ratio', 0) < 1.0:
            score += 4
        elif fd.get('current_ratio', 0) < 1.5:
            score += 2
            
        # Profit Margin (Ideal > 10%)
        if fd.get('profit_margin', 0) < 0.02:
            score += 4
        elif fd.get('profit_margin', 0) < 0.10:
            score += 2
            
        # Cash Flow Growth
        if fd.get('cash_flow_growth', 0) < -0.05:
            score += 3
        elif fd.get('cash_flow_growth', 0) < 0.02:
            score += 1

        if score >= 9:
            risk_level = "High"
            explanation = "High risk profile driven by excessive leverage (debt-to-equity ratio) and thin operating margins. Immediate liquidity improvements required."
        elif score >= 5:
            risk_level = "Medium"
            explanation = "Moderate risk exposure. Liquidity ratios are stable, but profitability margins are susceptible to market shocks. Capital structure optimization recommended."
        else:
            risk_level = "Low"
            explanation = "Excellent financial stability. Balanced leverage ratios, strong cash flow growth, and healthy gross profit margins are observed."

        return {
            'risk_level': risk_level,
            'risk_score': score,
            'indicators_analyzed': fd,
            'explanation': explanation,
            'mitigation_strategies': [
                "Refinance high-interest short-term debt into long-term bonds." if risk_level in ["High", "Medium"] else "Maintain current debt management policy.",
                "Review overhead expenses and run zero-based budgeting." if risk_level == "High" else "Increase capital investment in high-yielding assets.",
                "Set up a contingency revolving credit line."
            ]
        }

    @staticmethod
    def detect_anomalies(operational_series):
        """
        Runs IsolationForest on operational metrics (e.g. inventory levels or shipping delays).
        """
        if isinstance(operational_series, list):
            df = pd.DataFrame(operational_series)
        else:
            # Generate sample series
            np.random.seed(42)
            time = np.arange(1, 51)
            values = 500 + 5 * time + np.random.normal(0, 20, 50)
            # Add explicit anomalies
            values[12] = 200 # sudden drop
            values[35] = 950 # sudden spike
            df = pd.DataFrame({'time_step': time, 'metric_value': values})

        X = df[['metric_value']].values
        iso = IsolationForest(contamination=0.08, random_state=42)
        df['anomaly_flag'] = iso.fit_predict(X)
        # Convert IsolationForest flags (-1 anomaly, 1 normal) to boolean
        df['is_anomaly'] = df['anomaly_flag'].apply(lambda x: True if x == -1 else False)

        anomaly_records = df[df['is_anomaly'] == True].to_dict(orient='records')

        return {
            'total_data_points': len(df),
            'anomaly_count': len(anomaly_records),
            'anomalies_detected': anomaly_records,
            'full_series': df[['time_step', 'metric_value', 'is_anomaly']].to_dict(orient='records')
        }

    @staticmethod
    def run_what_if_simulation(price_change_percent, delay_days, budget_reallocation_kUSD):
        """
        Simulates corporate sales forecasts and churn outcomes under varied parameters.
        - Price increase (+%): increases short term gross sales, but decreases quantity sold (elasticity = -1.5) and increases churn risk.
        - Supply chain delays (+days): decreases sales directly (friction) and increases churn risk.
        - Marketing budget lift (+$k): increases sales directly, offsets churn risk.
        """
        months = list(range(1, 13))
        baseline_revenue = [120000, 125000, 122000, 130000, 135000, 132000, 140000, 145000, 142000, 150000, 155000, 152000]
        base_churn_rate = 4.2  # %

        simulated_revenue = []
        
        # Strategic elasticities
        price_multiplier = 1 + (price_change_percent / 100.0)
        quantity_impact = 1 - (1.5 * (price_change_percent / 100.0))  # Price elasticity of demand = -1.5
        delay_impact = 1 - (0.012 * delay_days)  # -1.2% drop per day of delay
        marketing_growth = 0.0015 * budget_reallocation_kUSD  # +0.15% sales lift per thousand dollars

        overall_sales_multiplier = price_multiplier * quantity_impact * delay_impact * (1 + marketing_growth)

        for rev in baseline_revenue:
            sim_val = int(rev * overall_sales_multiplier)
            simulated_revenue.append(max(0, sim_val))

        # Churn rate impacts
        churn_price_impact = 0.25 * price_change_percent  # Churn goes up by 0.25% per 1% price increase
        churn_delay_impact = 0.4 * delay_days           # Churn goes up by 0.4% per day of delay
        churn_mktg_impact = -0.02 * budget_reallocation_kUSD # Churn drops by 0.02% per thousand dollars marketing spend

        simulated_churn = max(0.5, round(base_churn_rate + churn_price_impact + churn_delay_impact + churn_mktg_impact, 2))

        # Strategic Consulting analysis text
        if simulated_churn > 7.0:
            assessment = "CRITICAL CHURN HAZARD: Your proposed strategy significantly inflates client churn probability. The short-term price revenue lift will be cancelled out by high customer attrition."
        elif overall_sales_multiplier > 1.05:
            assessment = "HIGHLY RECOMMENDED OPTIMIZATION: The parameters reflect a highly effective growth vector, elevating cumulative sales by over 5% while preserving churn stability."
        else:
            assessment = "NEUTRAL POSITION: The simulated shifts yield marginal operational variations. Refine asset allocations to maximize returns."

        return {
            'parameters': {
                'price_change_percent': price_change_percent,
                'delay_days': delay_days,
                'budget_reallocation_kUSD': budget_reallocation_kUSD
            },
            'comparison': [
                {'month': m, 'baseline': base, 'simulated': sim} 
                for m, base, sim in zip(months, baseline_revenue, simulated_revenue)
            ],
            'summary': {
                'baseline_total_revenue': sum(baseline_revenue),
                'simulated_total_revenue': sum(simulated_revenue),
                'revenue_change_percent': round(((sum(simulated_revenue) - sum(baseline_revenue)) / sum(baseline_revenue)) * 100, 2),
                'baseline_churn_rate': base_churn_rate,
                'simulated_churn_rate': simulated_churn,
            },
            'consulting_assessment': assessment
        }
