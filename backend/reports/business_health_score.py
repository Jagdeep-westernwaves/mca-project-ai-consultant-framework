class BusinessHealthScoreService:
    @staticmethod
    def calculate_health_score(kpis):
        """
        Calculates a corporate business health score out of 100 based on standard consulting benchmarks.
        kpis: dict containing {revenue_growth, churn_rate, risk_score, sentiment_score}
        """
        rev_growth = kpis.get('revenue_growth', 0.05)
        churn = kpis.get('churn_rate', 4.2)
        risk = kpis.get('risk_score', 4)  # 0 to 12
        sentiment = kpis.get('sentiment_score', 0.6)

        # 1. Revenue Growth component (Max 20 points)
        # Benchmark: >= 5% growth is excellent (20 pts), 0% is 10 pts, negative is < 10 pts
        if rev_growth >= 0.05:
            rev_score = 20
        elif rev_growth >= 0.02:
            rev_score = 16
        elif rev_growth >= 0:
            rev_score = 12
        else:
            rev_score = max(0, 12 + int(rev_growth * 50))

        # 2. Customer Retention component (Max 20 points)
        # Benchmark: < 3% churn is excellent (20 pts), > 8% is poor (< 10 pts)
        if churn < 3.0:
            churn_score = 20
        elif churn < 5.0:
            churn_score = 17
        elif churn < 8.0:
            churn_score = 12
        else:
            churn_score = max(0, 20 - int(churn * 1.5))

        # 3. Financial Stability component (Max 20 points)
        # Benchmark: risk score < 4 is excellent (20 pts), > 8 is critical (< 8 pts)
        # Note: risk score is 0 to 12 (lower is better)
        if risk <= 3:
            risk_score = 20
        elif risk <= 5:
            risk_score = 16
        elif risk <= 8:
            risk_score = 11
        else:
            risk_score = max(0, 20 - int(risk * 1.5))

        # 4. Market Sentiment component (Max 20 points)
        # Benchmark: sentiment score >= 0.70 is excellent (20 pts), < 0.20 is poor (< 8 pts)
        if sentiment >= 0.7:
            sent_score = 20
        elif sentiment >= 0.5:
            sent_score = 16
        elif sentiment >= 0.3:
            sent_score = 12
        else:
            sent_score = max(0, int(sentiment * 30))

        # 5. Operational Efficiency component (Max 20 points)
        # Derived from churn and risk
        op_eff = 20 - max(0, int((churn - 3) * 1.2)) - max(0, int((risk - 4) * 0.8))
        op_score = max(5, min(20, op_eff))

        total_score = rev_score + churn_score + risk_score + sent_score + op_score

        if total_score >= 85:
            rating = "Excellent"
            interpretation = "The business demonstrates class-leading performance across core vectors. Highly stable operations with clear opportunities to reinvest surplus capital into R&D and aggressive market acquisition."
        elif total_score >= 70:
            rating = "Strong"
            interpretation = "Solid commercial position with stable customer retention and healthy capitalization. Focus on minor operational tweaks and tactical cross-selling to secure the market moat."
        elif total_score >= 55:
            rating = "Stable"
            interpretation = "Moderate performance with visible pressure on customer churn or net profit margins. Capital restructuring and dedicated client retention programs are highly recommended."
        else:
            rating = "Critical"
            interpretation = "Severe risk exposures across multiple dimensions. Immediate intervention required: restructure capitalization, cut operational overheads, and establish rapid QA cycles to salvage customer sentiment."

        return {
            'total_score': total_score,
            'rating': rating,
            'interpretation': interpretation,
            'subscores': {
                'revenue_performance': rev_score,
                'customer_retention': churn_score,
                'financial_stability': risk_score,
                'market_sentiment': sent_score,
                'operational_efficiency': op_score
            }
        }
