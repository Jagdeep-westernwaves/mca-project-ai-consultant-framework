class BusinessHealthScore:
    @staticmethod
    def calculate_score(kpis):
        """
        Calculates a unified corporate health index score from 0 to 100 based on weighted metrics:
        - revenue_growth: weight 25% (normalized around 5% target)
        - churn_rate: weight 25% (normalized around 3% threshold)
        - risk_score: weight 20% (normalized around 0-15 risk scale)
        - sentiment_score: weight 15% (normalized around 0-1 scale)
        - delay_days: weight 15% (normalized around 0-10 delay scale)
        """
        revenue_growth = kpis.get('revenue_growth', 0.03)
        churn_rate = kpis.get('churn_rate', 4.0)
        risk_score = kpis.get('risk_score', 4)
        sentiment_score = kpis.get('sentiment_score', 0.6)
        delay_days = kpis.get('delay_days', 2.0)

        # 1. Growth Sub-score (Target >= 5%)
        # 5% growth -> 100, 0% growth -> 50, -5% growth -> 0
        growth_score = max(0.0, min(100.0, (revenue_growth + 0.05) * 1000.0))

        # 2. Retention Sub-score (Target <= 3% churn)
        # 0% churn -> 100, 3% churn -> 85, 10% churn -> 50, >=20% churn -> 0
        retention_score = max(0.0, min(100.0, 100.0 - (churn_rate * 5.0)))

        # 3. Financial Resiliency Sub-score (Scale 0 to 15, low is excellent)
        # 0 risk score -> 100, 15 risk score -> 0
        resiliency_score = max(0.0, min(100.0, ((15.0 - risk_score) / 15.0) * 100.0))

        # 4. Sentiment Sub-score (Scale 0 to 1)
        # 1.0 sentiment -> 100, 0.0 sentiment -> 0
        customer_score = max(0.0, min(100.0, sentiment_score * 100.0))

        # 5. Operational Efficiency Sub-score (Target <= 1 day delay)
        # 0 delay -> 100, 10 days delay -> 0
        ops_score = max(0.0, min(100.0, 100.0 - (delay_days * 10.0)))

        # Aggregate weighted score
        final_score = (
            (growth_score * 0.25) +
            (retention_score * 0.25) +
            (resiliency_score * 0.20) +
            (customer_score * 0.15) +
            (ops_score * 0.15)
        )
        final_score = round(final_score, 1)

        # Classification
        if final_score >= 80.0:
            classification = "Excellent"
            explanation = "Outstanding financial and operational indicators. Capital structure is highly optimized, growth vectors are stable, and customer retention exceeds baseline benchmarks."
        elif final_score >= 60.0:
            classification = "Good"
            explanation = "Solid overall corporate structure. Stable cash flows and healthy market perception are offset by minor operational delay friction or slight margin squeeze."
        elif final_score >= 40.0:
            classification = "Average"
            explanation = "Moderate systemic risks observed. Growth is stagnant and customer attrition is bordering critical alert indicators. Prompt strategic intervention recommended."
        else:
            classification = "Poor"
            explanation = "Critical operational vulnerabilities detected. Leverage is unsustainably high, sales are contracting, and immediate debt restructuring coupled with QA audits is mandatory."

        return {
            "score": final_score,
            "classification": classification,
            "explanation": explanation,
            "breakdown": {
                "revenue_growth": round(growth_score, 1),
                "customer_retention": round(retention_score, 1),
                "financial_resiliency": round(resiliency_score, 1),
                "customer_sentiment": round(customer_score, 1),
                "operational_efficiency": round(ops_score, 1)
            }
        }
