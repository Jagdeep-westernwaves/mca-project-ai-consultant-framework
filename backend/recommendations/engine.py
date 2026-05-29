import random

class ConsultingAdvisoryEngine:
    @staticmethod
    def generate_recommendations(kpis):
        """
        Evaluates current KPI variables and outputs contextual management advice.
        kpis: dict containing {revenue_growth, churn_rate, risk_score, sentiment_score}
        """
        revenue_growth = kpis.get('revenue_growth', 0.05)
        churn_rate = kpis.get('churn_rate', 4.2)
        risk_score = kpis.get('risk_score', 4)
        sentiment_score = kpis.get('sentiment_score', 0.6)

        recommendations = []

        # 1. Revenue & growth strategies
        if revenue_growth < 0.02:
            recommendations.append({
                'category': 'Growth',
                'title': 'Struggling Sales Growth Interventions',
                'description': 'Expand marketing outreach in Tier-1 territories and establish long-term enterprise subscription contracts to elevate recurring bookings.',
                'impact': 'High',
                'difficulty': 'Medium'
            })
        else:
            recommendations.append({
                'category': 'Growth',
                'title': 'Market Share Consolidation',
                'description': 'Leverage current healthy momentum to cross-sell high-margin consulting add-ons to established clients.',
                'impact': 'Medium',
                'difficulty': 'Low'
            })

        # 2. Customer retention (churn)
        if churn_rate > 5.0:
            recommendations.append({
                'category': 'Operations',
                'title': 'Proactive Client Retainment Program',
                'description': 'Establish a Dedicated Client Success squad tasked with conducting quarterly performance reviews for all accounts with NPS < 7.',
                'impact': 'High',
                'difficulty': 'Medium'
            })
        else:
            recommendations.append({
                'category': 'Operations',
                'title': 'Automate Churn Triggers',
                'description': 'Build telemetry warnings to track daily application activity and flag client inactivity exceeding 14 business days.',
                'impact': 'Medium',
                'difficulty': 'High'
            })

        # 3. Financial risk strategies
        if risk_score >= 6:
            recommendations.append({
                'category': 'Finance',
                'title': 'De-leverage and Capital Restructuring',
                'description': 'Aggressively pay down expensive short-term operational credit lines. Refinance remaining debt to long-term fixed rates.',
                'impact': 'High',
                'difficulty': 'High'
            })
        else:
            recommendations.append({
                'category': 'Finance',
                'title': 'Capital Deployment Acceleration',
                'description': 'Reinvest excess operating cash flows into market research and internal machine learning asset creation.',
                'impact': 'Medium',
                'difficulty': 'Low'
            })

        # 4. Sentiment-driven recommendations
        if sentiment_score < 0.3:
            recommendations.append({
                'category': 'Customer Service',
                'title': 'Quality Assurance Overhaul',
                'description': 'Address public friction points reported in customer reviews by executing strict SLAs on product shipment timelines.',
                'impact': 'High',
                'difficulty': 'Medium'
            })

        # 5. General optimization (budget)
        recommendations.append({
            'category': 'Budget',
            'title': 'Zero-Based Budgeting Allocation',
            'description': 'Reallocate 15% of administrative overhead expenditures to ML R&D and automated customer onboarding systems.',
            'impact': 'High',
            'difficulty': 'Medium'
        })

        return recommendations

    @staticmethod
    def chatbot_respond(query, context=None):
        """
        Parses consultant/client questions and generates a contextual, professional consulting response.
        """
        q = query.lower()
        
        # Default context values
        if not context:
            context = {
                'client_name': 'Acme Corp',
                'current_revenue': '$1.8M',
                'churn_risk': '4.2%',
                'risk_level': 'Medium'
            }

        # 1. Price/What-if questions
        if 'price' in q or 'simulate' in q or 'what-if' in q or 'what if' in q:
            return (
                f"### Strategic Pricing & Simulation Response\n\n"
                f"Based on the **What-If Simulation Engine**, adjusting pricing triggers structural changes across your company metrics:\n\n"
                f"* **Price Elasticity:** Our predictive regression models indicate an elasticity of **-1.5**. A price increase will boost unit margins but lead to a corresponding drop in overall sales volumes.\n"
                f"* **Churn Impact:** Higher pricing directly increases customer churn risk (approximately **+0.25% churn for every 1% price rise**).\n"
                f"* **Recommendation:** If you plan to increase prices, couple it with **budget re-allocations toward Customer Success** to offset the churn risk."
            )

        # 2. Risk/Debt questions
        if 'risk' in q or 'debt' in q or 'finance' in q or 'equity' in q:
            return (
                f"### Financial Risk & Capital Management Advisory\n\n"
                f"Analyzing **{context['client_name']}'s** capital metrics reveals a **{context['risk_level']}** risk profile. To optimize financial stability, implement these adjustments:\n\n"
                f"1. **Debt Restructuring:** Review your debt-to-equity ratio. Target a leverage ratio **under 1.2** to stay resilient during business downtime.\n"
                f"2. **Working Capital:** Maximize liquidity by tightening invoice collection collections (target accounts receivable under 30 days).\n"
                f"3. **Capital Budgeting:** Shift non-performing asset allocations toward automated internal tools that yield high operational expenditure (OpEx) savings."
            )

        # 3. Churn/Retention questions
        if 'churn' in q or 'retention' in q or 'customer' in q or 'satisfaction' in q:
            return (
                f"### Customer Retention & Churn Control Plan\n\n"
                f"Your current customer churn rate sits at **{context['churn_risk']}**. To keep this metric below the **3.0% industry standard**, the AI recommends:\n\n"
                f"* **Customer Service:** Run automated keyword extraction on customer reviews to flag negative issues (such as shipping delays or system bugs) before they trigger cancelations.\n"
                f"* **Loyalty Incentives:** Offer multi-year fixed-rate contracts to customers showing moderate churn risk.\n"
                f"* **Telemetry alerts:** Track daily application logins and alert assigned consultants when accounts go completely idle for over two weeks."
            )

        # 4. General Greeting or consulting questions
        if 'hello' in q or 'hi ' in q or 'who are you' in q or 'help' in q:
            return (
                f"### AI Management Consultant Bot\n\n"
                f"Welcome! I am your **AI Management Consulting Assistant**. I can help you evaluate your corporate health indices, analyze risks, run simulations, and review customer sentiment:\n\n"
                f"* Try asking: *'How does a 5% price increase impact our sales and churn?'*\n"
                f"* Try asking: *'How can we reduce our financial risk profile?'*\n"
                f"* Try asking: *'How do we lower our customer churn rate?'*\n\n"
                f"Let me know what business challenges you want to solve today!"
            )

        # 5. Fallback general consulting response
        return (
            f"### Strategic Business Advisory Summary\n\n"
            f"Thank you for your question. To address your inquiry regarding *'{query}'*, we recommend pursuing a three-pronged approach based on consulting best practices:\n\n"
            f"1. **Identify Bottlenecks:** Upload your latest CSV/Excel dataset in the **Data Upload** panel to map operational anomalies.\n"
            f"2. **Conduct 'What-If' Simulation:** Open the **Predictive Simulation** module to model resource adjustments and view forecasted revenues.\n"
            f"3. **De-silo Information:** Set up unified in-app notification alerts so that both consultants and client stakeholders share alignment on KPIs.\n\n"
            f"If you need a specific metric breakdown, please specify the indicators you wish to analyze."
        )
