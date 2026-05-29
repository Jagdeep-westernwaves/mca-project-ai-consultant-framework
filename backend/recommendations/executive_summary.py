class ExecutiveSummaryGenerator:
    @staticmethod
    def generate_summary(kpis, health_score_data):
        """
        Assembles a highly professional, cohesive consulting-style text narrative summarizing
        the company's performance, core challenges, and recommended action steps.
        - kpis: dict of client metrics
        - health_score_data: output from BusinessHealthScore.calculate_score
        """
        score = health_score_data["score"]
        classification = health_score_data["classification"]
        
        revenue_growth = kpis.get('revenue_growth', 0.03)
        churn_rate = kpis.get('churn_rate', 4.0)
        risk_score = kpis.get('risk_score', 4)
        delay_days = kpis.get('delay_days', 2.0)

        # 1. Base opening sentence based on health classification
        if classification == "Excellent":
            opening = f"Operational audit reviews indicate that the client exhibits a highly resilient operational model, achieving a premium Business Health Score of {score}% (Classification: {classification}). "
        elif classification == "Good":
            opening = f"A review of core business indicators indicates a highly stable operating footprint with a healthy Business Health Score of {score}% (Classification: {classification}). "
        elif classification == "Average":
            opening = f"Comprehensive system auditing reveals emerging stress points across the client organization, yielding an Average Business Health Score of {score}%. "
        else:
            opening = f"WARNING: Core business diagnostic reviews identify severe risk exposures, placing the client in the {classification} health bracket with a score of {score}%. "

        # 2. Performance narrative
        growth_text = f"annual sales expansion is proceeding at a rate of {round(revenue_growth * 100, 1)}%"
        if revenue_growth >= 0.04:
            growth_desc = f"Favorable commercial execution has driven robust top-line momentum, where {growth_text}."
        elif revenue_growth >= 0.0:
            growth_desc = f"Sales growth remains positive but plateaued, where {growth_text}."
        else:
            growth_desc = f"Systemic market headwinds have triggered active revenue contraction, with {growth_text}."

        # 3. Retainment narrative
        if churn_rate < 3.0:
            churn_desc = f"Furthermore, merchant relationships remain exceptionally sticky, registering a stable attrition rate of {round(churn_rate, 1)}%."
        elif churn_rate < 5.0:
            churn_desc = f"Meanwhile, customer churn is stable but warrants oversight, currently tracking at {round(churn_rate, 1)}%."
        else:
            churn_desc = f"Critically, high customer cancelations represent a severe strategic vulnerability, with churn spiking to an alarming {round(churn_rate, 1)}%."

        # 4. Core bottleneck / risk narrative
        bottlenecks = []
        if risk_score >= 7:
            bottlenecks.append(f"aggressive capital leverage (Financial Risk Index: {risk_score}/15)")
        if delay_days >= 3.0:
            bottlenecks.append(f"logistic friction causing delay periods of {round(delay_days, 1)} days")
        if churn_rate >= 5.0:
            bottlenecks.append("critical customer retention attrition")

        if bottlenecks:
            risk_desc = f"The primary operational bottlenecks requiring board-level attention include {', and '.join(bottlenecks)}. These stress vectors directly impact operating margins and liquidity."
        else:
            risk_desc = "Capital allocations and debt-to-equity leverage ratios are well within highly conservative bounds, maintaining excellent financial solvency."

        # 5. Dynamic recommended pivot actions
        if classification in ["Excellent", "Good"]:
            recommendation = (
                "Based on this strong performance, management should focus on cross-selling high-margin consulting "
                "modules to established accounts and reinvesting excess cash flows to automate back-office operations."
            )
        elif classification == "Average":
            recommendation = (
                "To optimize baseline performance, it is recommended that management implement automated telemetry alerts "
                "to track accounts activity, run a zero-based budget audit to release OpEx capital, and establish a dedicated Client Success squad."
            )
        else:
            recommendation = (
                "IMMEDIATE ACTIONS REQUIRED: Management must immediately halt expansion capital expenditure and execute debt restructuring "
                "to reduce leverage. Couple this with a strict quality-assurance SLA review to reverse negative client sentiment and stop the attrition loop."
            )

        full_narrative = f"{opening}{growth_desc} {churn_desc} {risk_desc} {recommendation}"
        return full_narrative
