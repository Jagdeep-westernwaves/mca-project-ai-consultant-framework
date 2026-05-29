class SWOTGeneratorService:
    @staticmethod
    def generate_swot(kpis):
        """
        Generates dynamic corporate SWOT analysis based on current KPIs.
        kpis: dict containing {revenue_growth, churn_rate, risk_score, sentiment_score}
        """
        rev_growth = kpis.get('revenue_growth', 0.05)
        churn = kpis.get('churn_rate', 4.2)
        risk = kpis.get('risk_score', 4)
        sentiment = kpis.get('sentiment_score', 0.6)

        strengths = []
        weaknesses = []
        opportunities = []
        threats = []

        # 1. Strengths
        if rev_growth >= 0.04:
            strengths.append("High commercial momentum with solid positive revenue expansion.")
        else:
            strengths.append("Established core operations with a stable baseline revenue model.")

        if churn < 4.0:
            strengths.append(f"Resilient customer loyalty base with low annual churn rates ({round(churn, 1)}%).")
        else:
            strengths.append("Cross-functional teams aligned on key corporate accounts.")

        if sentiment >= 0.65:
            strengths.append(f"Outstanding brand equity and positive customer sentiment rating ({round(sentiment * 100, 1)}%).")
        else:
            strengths.append("Capable internal operations and client representative relationships.")

        # 2. Weaknesses
        if rev_growth < 0.02:
            weaknesses.append("Flatlining top-line growth indicates standard sales friction or market saturation.")
        if churn >= 5.0:
            weaknesses.append(f"High client attrition rate ({round(churn, 1)}%) draining average customer lifetime value.")
        if risk >= 6:
            weaknesses.append(f"Elevated debt leverage and capital risk score ({risk}/12), limiting immediate liquid flexibility.")
        if sentiment < 0.5:
            weaknesses.append(f"Friction points detected in customer feedback causing depressed sentiment scores ({round(sentiment * 100, 1)}%).")

        if len(weaknesses) == 0:
            weaknesses.append("High dependence on standard core accounts might limit rapid product diversification.")
            weaknesses.append("Heavy operational overhead slightly dragging down net margin efficiency.")

        # 3. Opportunities
        opportunities.append("Deploy automated machine learning telemetry models to pre-emptively flag at-risk clients.")
        opportunities.append("Transition established client base to longer-term enterprise subscription contracts.")
        opportunities.append("Leverage positive customer feedback via targeted content marketing to capture competitor shares.")
        opportunities.append("Introduce zero-based budgeting allocations to redirect OpEx savings toward high-margin ML services.")

        # 4. Threats
        if churn >= 4.0:
            threats.append("Aggressive competitor acquisition campaigns targeting vulnerable client segments.")
        threats.append("Macroeconomic shifts affecting corporate spending budgets and postponing strategic deployments.")
        if risk >= 5:
            threats.append("Rising interest rate environments increasing financing costs for credit facilities.")
        threats.append("Disruption in supply-chain or client logistics workflows causing client satisfaction drops.")

        return {
            'strengths': strengths[:3],
            'weaknesses': weaknesses[:3],
            'opportunities': opportunities[:3],
            'threats': threats[:3]
        }
