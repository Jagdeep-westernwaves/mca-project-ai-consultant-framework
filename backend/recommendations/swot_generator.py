class SWOTGenerator:
    @staticmethod
    def generate_swot(kpis):
        """
        Dynamically generates a board-ready SWOT analysis based on active company KPIs:
        - revenue_growth (float, e.g. 0.015 for 1.5%)
        - churn_rate (float, e.g. 4.2 for 4.2%)
        - risk_score (int, 0 to 15)
        - sentiment_score (float, 0.0 to 1.0)
        - delay_days (int/float, e.g. 3.0)
        """
        revenue_growth = kpis.get('revenue_growth', 0.03)
        churn_rate = kpis.get('churn_rate', 4.0)
        risk_score = kpis.get('risk_score', 4)
        sentiment_score = kpis.get('sentiment_score', 0.6)
        delay_days = kpis.get('delay_days', 2.0)

        strengths = []
        weaknesses = []
        opportunities = []
        threats = []

        # --- STRENGTHS ---
        if revenue_growth >= 0.04:
            strengths.append(f"Strong quarterly financial momentum with {round(revenue_growth * 100, 1)}% sales expansion rate.")
        else:
            strengths.append("Established core operational revenue run-rate.")

        if churn_rate < 3.0:
            strengths.append(f"Outstanding merchant retention with attrition controlled at a stable {round(churn_rate, 1)}%.")
        else:
            strengths.append("Dedicated customer loyalty initiatives currently in place.")

        if risk_score < 5:
            strengths.append(f"Favorable capital balance with high liquidity and secure leverage scoring ({risk_score}/15).")

        if sentiment_score >= 0.70:
            strengths.append(f"Premium brand equity backed by a highly positive {round(sentiment_score * 100, 1)}% market sentiment index.")

        # Ensure we always have at least two strengths
        if len(strengths) < 2:
            strengths.append("Adaptive enterprise service models responding to customer requirements.")

        # --- WEAKNESSES ---
        if revenue_growth < 0.02:
            weaknesses.append(f"Stagnating growth speed recorded at a sluggish {round(revenue_growth * 100, 1)}% annually.")

        if churn_rate >= 5.0:
            weaknesses.append(f"Elevated client attrition risk flagging a high {round(churn_rate, 1)}% customer cancelation rate.")

        if risk_score >= 8:
            weaknesses.append(f"Aggressive financial risk exposure triggered by a leveraged balance sheet ({risk_score}/15).")

        if sentiment_score < 0.50:
            weaknesses.append(f"Sub-optimal customer perception rating with negative flags at {round((1 - sentiment_score) * 100, 1)}%.")

        if delay_days >= 4.0:
            weaknesses.append(f"Operational delay friction in supply logistics averaging {round(delay_days, 1)} days.")

        # Ensure we always have at least two weaknesses
        while len(weaknesses) < 2:
            if "Stagnating growth speed recorded" not in "".join(weaknesses) and revenue_growth < 0.04:
                weaknesses.append("Narrow growth margins susceptible to competitor pricing plays.")
            elif "Operational delay friction" not in "".join(weaknesses):
                weaknesses.append("Siloed data analytics slowing strategic pivot execution times.")
            else:
                weaknesses.append("Heavy administrative overhead locking capital away from R&D.")

        # --- OPPORTUNITIES ---
        opportunities.append("Deploy automated CRM telemetry workflows to identify high-attrition flags early.")
        
        if churn_rate >= 4.0:
            opportunities.append("Roll out proactive accounts-management squads targeting clients with NPS < 7.")
        else:
            opportunities.append("Cross-sell premium predictive analytical add-on services to loyal accounts.")

        if risk_score >= 6:
            opportunities.append("Execute zero-based budgeting models to reallocate 15% of administrative overhead toward de-leveraging.")
        else:
            opportunities.append("Accelerate capital deployment cycles into proprietary machine-learning IP assets.")

        # --- THREATS ---
        threats.append("Short-term pricing increases may trigger merchant attrition under price elasticity pressure (-1.5).")
        
        if delay_days >= 3.0:
            threats.append(f"Unmitigated logistic delays exceeding {round(delay_days, 1)} days leading to permanent service-level agreement breaches.")
        else:
            threats.append("Rising industry competitor models offering automated self-serve pricing triggers.")

        if risk_score >= 9:
            threats.append("Macroeconomic credit contractions triggering high-interest rate spikes on short-term corporate debt.")

        return {
            "strengths": strengths[:3],
            "weaknesses": weaknesses[:3],
            "opportunities": opportunities[:3],
            "threats": threats[:3]
        }
