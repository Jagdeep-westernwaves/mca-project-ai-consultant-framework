class RecommendationEngineService:
    @staticmethod
    def generate_recommendation_cards(kpis):
        """
        Calculates highly-structured professional consulting recommendation cards.
        """
        rev_growth = kpis.get('revenue_growth', 0.05)
        churn = kpis.get('churn_rate', 4.2)
        risk = kpis.get('risk_score', 4)
        sentiment = kpis.get('sentiment_score', 0.6)

        cards = []

        # 1. Growth Pillar
        if rev_growth < 0.02:
            cards.append({
                'title': 'Struggling Sales Growth Interventions',
                'priority': 'Critical',
                'category': 'Growth',
                'impact': 'High',
                'difficulty': 'Medium',
                'timeline': '0-30 Days',
                'justification': 'Current revenue expansion is significantly below the corporate benchmark (2% vs. 5%). Rapid intervention is required to stabilize booking channels.',
                'outcome': 'A projected 15% increase in top-line bookings within 90 days of launch.'
            })
        else:
            cards.append({
                'title': 'Market Share Consolidation Strategy',
                'priority': 'High',
                'category': 'Growth',
                'impact': 'Medium',
                'difficulty': 'Low',
                'timeline': '1-3 Months',
                'justification': 'Current growth rates are healthy. Capitalizing on market momentum allows cross-selling high-margin consulting add-ons to core accounts with low customer resistance.',
                'outcome': 'A expected 8% lift in average contract value across existing corporate accounts.'
            })

        # 2. Operations Pillar (Churn)
        if churn >= 5.0:
            cards.append({
                'title': 'Proactive Client Retainment Taskforce',
                'priority': 'Critical',
                'category': 'Operations',
                'impact': 'High',
                'difficulty': 'Medium',
                'timeline': '0-30 Days',
                'justification': 'Customer attrition stands at a critical rate of ' + str(round(churn, 1)) + '%. Establishing a high-priority Client Success squad is vital to intercept dissatisfied accounts.',
                'outcome': 'Reduction of client churn rate below the 3.0% industry standard within 60 days.'
            })
        else:
            cards.append({
                'title': 'Automated Telemetry Warning Triggers',
                'priority': 'Medium',
                'category': 'Operations',
                'impact': 'Medium',
                'difficulty': 'High',
                'timeline': '3-6 Months',
                'justification': 'While churn is stable, proactive monitoring acts as an early warning system. Tracking client login frequencies will flag idle corporate accounts before attrition occurs.',
                'outcome': 'Pre-emptive flag alerts to consultants, reducing reactive save efforts by 40%.'
            })

        # 3. Capital Pillar (Risk)
        if risk >= 6:
            cards.append({
                'title': 'De-Leverage & Capital Restructuring',
                'priority': 'High',
                'category': 'Finance',
                'impact': 'High',
                'difficulty': 'High',
                'timeline': '1-3 Months',
                'justification': 'Corporate risk rating has reached ' + str(risk) + '/12, indicating thin interest coverage. Paying down short-term high-interest credit lines is essential to improve liquid runway.',
                'outcome': 'Refinanced long-term debt facilities and reduced monthly interest expenses by 25%.'
            })
        else:
            cards.append({
                'title': 'Capital Deployment & Asset Acceleration',
                'priority': 'Medium',
                'category': 'Finance',
                'impact': 'Medium',
                'difficulty': 'Low',
                'timeline': '3-6 Months',
                'justification': 'The client maintains an excellent liquid capitalization profile. Reinvesting excess operational cash flows into scalable ML intellectual property will drive long-term structural efficiencies.',
                'outcome': 'Creation of proprietary predictive algorithms, establishing a technical moat.'
            })

        # 4. Sentiment Overhaul (Customer Support)
        if sentiment < 0.5:
            cards.append({
                'title': 'Quality Assurance & Shipping SLA Overhaul',
                'priority': 'Critical',
                'category': 'Customer Service',
                'impact': 'High',
                'difficulty': 'Medium',
                'timeline': '0-30 Days',
                'justification': 'Negative NLP keyword frequencies in review text indicate customer friction regarding delivery speed and technical support response time.',
                'outcome': 'Stabilized customer sentiment index above 70% and cut support ticket resolution time by half.'
            })
        else:
            cards.append({
                'title': 'NPS Advocacy and Referral Seeding',
                'priority': 'Low',
                'category': 'Customer Service',
                'impact': 'Low',
                'difficulty': 'Low',
                'timeline': '6-12 Months',
                'justification': 'Customer sentiment rating is exceptional (' + str(round(sentiment * 100, 1)) + '%). Translating high NPS scores into peer-to-peer enterprise referral programs will drive organic sales.',
                'outcome': 'Generated a steady pipeline of qualified warm sales leads, reducing customer acquisition costs.'
            })

        # 5. Strategic Budgeting
        cards.append({
            'title': 'Zero-Based Budgeting Realignment',
            'priority': 'High',
            'category': 'Budget',
            'impact': 'High',
            'difficulty': 'Medium',
            'timeline': '1-3 Months',
            'justification': 'Reallocating standard administrative overhead costs is a non-dilutive financing method to fund machine learning telemetry and automated onboarding tools.',
            'outcome': 'Freed up $120k in annual operating capital to reallocate directly to core software engineering.'
        })

        return cards
