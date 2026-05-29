class ExecutiveSummaryService:
    @staticmethod
    def generate_narrative(client_name, kpis):
        """
        Formulates Deloitte-grade consulting narratives for reports.
        """
        rev_growth = kpis.get('revenue_growth', 0.05)
        churn = kpis.get('churn_rate', 4.2)
        risk = kpis.get('risk_score', 4)
        sentiment = kpis.get('sentiment_score', 0.6)

        # 1. Current Business Position
        if rev_growth >= 0.04:
            position = (
                f"Core financial data indicates that {client_name} is operating from a position of commercial "
                f"momentum, exhibiting a healthy annualized revenue growth of {round(rev_growth * 100, 1)}%. "
                f"This growth reflects robust underlying product demand and steady market expansion."
            )
        else:
            position = (
                f"A comprehensive review indicates that {client_name} is experiencing growth friction, with top-line "
                f"expansion pacing at {round(rev_growth * 100, 1)}%. The core commercial model remains resilient, "
                f"but is constrained by customer onboarding bottlenecks and localized sales cycles."
            )

        # 2. Major Risks
        risks = []
        if churn >= 5.0:
            risks.append(f"heightened client attrition levels ({round(churn, 1)}%) draining operational lifetime value")
        if risk >= 6:
            risks.append(f"capital leverage risk constraints ({risk}/12) affecting short-term working capital")
        if sentiment < 0.5:
            risks.append(f"depressed brand sentiment indicators ({round(sentiment * 100, 1)}%) from delivery delays")

        if not risks:
            risks_text = "Operational risks are currently low, though localized competitor acquisition campaigns and rising credit costs warrant ongoing monitoring."
        else:
            risks_text = f"Primary risk exposure is driven by " + ", combined with ".join(risks) + ". These friction points drag on net profit margins and require strategic QA interventions."

        # 3. Growth Opportunities
        if churn < 4.0 and sentiment >= 0.6:
            opportunities = (
                f"Given the high baseline brand loyalty ({round(sentiment * 100, 1)}% positive sentiment) and stable customer "
                f"retention ({round(churn, 1)}% churn), {client_name} is primed for structural cross-selling campaigns. "
                f"Expanding Tier-1 enterprise account coverage and introducing premium automated ML integrations represent "
                f"immediate, high-yield commercial paths."
            )
        else:
            opportunities = (
                f"{client_name} has a clear opportunity to reclaim lost margins by reallocating administrative overhead "
                f"toward customer success squads and automating early-warning churn telemetry. Establishing strict SLA standards "
                f"will restore positive sentiment, establishing a stable foundation for capital expansion."
            )

        # 4. Strategic Outlook
        if risk < 5:
            outlook = (
                "The strategic outlook is highly positive. A well-capitalized balance sheet combined with strong baseline "
                "sentiment provides the operational buffer needed to execute long-term technology roadmaps and secure a "
                "compelling product moat."
            )
        else:
            outlook = (
                "The strategic outlook remains cautiously stable. Financial and operational indicators can be normalized, "
                "provided the client aggressively de-leverages high-interest debt facilities and launches structured customer "
                "retainment interventions within the next 90 days."
            )

        # 5. Priority Actions
        priority_actions = [
            "Perform capital restructuring to pay down short-term operational credit lines.",
            "Deploy automated ML early-warning telemetry to preemptively flag at-risk clients.",
            "Introduce zero-based budgeting allocations to redirect 15% of OpEx into high-yield sales channels."
        ]

        return {
            'position': position,
            'risks': risks_text,
            'opportunities': opportunities,
            'outlook': outlook,
            'priority_actions': priority_actions
        }
