from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.units import inch
from .business_health_score import BusinessHealthScoreService
from .swot_generator import SWOTGeneratorService
from .recommendation_engine import RecommendationEngineService
from .executive_summary import ExecutiveSummaryService
from .chart_generator import VectorChartGenerator
from ai_engine.analytics_engine import ConsultingAnalyticsEngine
import datetime

class ReportTemplatesBuilder:
    @staticmethod
    def build_report_story(report_type, client_name, report_title, kpis, recommendations, styles):
        """
        Orchestrates and builds a professional multi-page ReportLab story.
        """
        # Load custom styles
        primary_color = colors.HexColor('#0f172a')  # Slate 900
        secondary_color = colors.HexColor('#1e293b') # Slate 800
        accent_color = colors.HexColor('#3b82f6')    # Blue 500
        text_color = colors.HexColor('#334155')      # Slate 700
        bg_light = colors.HexColor('#f8fafc')        # Slate 50

        title_style = styles['CoverTitle']
        subtitle_style = styles['CoverSubtitle']
        h1_style = styles['SectionHeader']
        h2_style = styles['SubsectionHeader']
        body_style = styles['ReportBody']
        table_header_style = styles['TableHeader']
        table_body_style = styles['TableBody']

        story = []

        # ----------------------------------------------------
        # 1. Dedicated Executive Cover Page (All Templates)
        # ----------------------------------------------------
        # Large top banner
        banner_data = [['']]
        banner_table = Table(banner_data, colWidths=[7.0 * inch], rowHeights=[20])
        banner_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), primary_color),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(banner_table)
        story.append(Spacer(1, 40))

        # Title block
        story.append(Paragraph("AI-INTEGRATED MANAGEMENT CONSULTING FRAMEWORK", subtitle_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(report_title, title_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f"Template Standard: {report_type.replace('_', ' ').title()}", styles['SubsectionHeader']))
        story.append(Spacer(1, 60))

        # Metadata table
        now = datetime.datetime.now().strftime("%B %d, %Y")
        meta_data = [
            [Paragraph("<b>PREPARED FOR:</b>", body_style), Paragraph(client_name, body_style)],
            [Paragraph("<b>GENERATED DATE:</b>", body_style), Paragraph(now, body_style)],
            [Paragraph("<b>CLASSIFICATION:</b>", body_style), Paragraph("Confidential Advisory Report", body_style)],
            [Paragraph("<b>PREPARED BY:</b>", body_style), Paragraph("AIMCF Strategic Consulting Engine", body_style)],
            [Paragraph("<b>REPORT ID:</b>", body_style), Paragraph(f"AIMCF-REP-{hash(client_name)%100000:05d}", body_style)],
        ]
        meta_table = Table(meta_data, colWidths=[2.2 * inch, 4.8 * inch])
        meta_table.setStyle(TableStyle([
            ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 80))

        # Footer branding signature
        branding_data = [[
            Paragraph("<font color='#3b82f6'><b>AIMCF Enterprise Consulting Standard</b></font><br/><font color='#64748b'>Delivering high-fidelity strategic diagnostics and predictive analytics models.</font>", body_style)
        ]]
        branding_table = Table(branding_data, colWidths=[7.0 * inch])
        branding_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_light),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0,0), (-1,-1), 12),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
            ('LEFTPADDING', (0,0), (-1,-1), 15),
        ]))
        story.append(branding_table)
        story.append(PageBreak())

        # Fetch calculated business assets
        churn = kpis.get('churn_rate', 4.2)
        sentiment = kpis.get('sentiment_score', 0.6)
        
        health_data = BusinessHealthScoreService.calculate_health_score(kpis)
        health_score = health_data['total_score']
        health_rating = health_data['rating']
        health_interpretation = health_data['interpretation']

        swot = SWOTGeneratorService.generate_swot(kpis)
        full_rec_cards = RecommendationEngineService.generate_recommendation_cards(kpis)
        narrative = ExecutiveSummaryService.generate_narrative(client_name, kpis)

        # ----------------------------------------------------
        # 2. Page 2: Table of Contents (Except very short ones, but let's include it professionally)
        # ----------------------------------------------------
        if report_type != 'executive_summary':
            story.append(Paragraph("Table of Contents", h1_style))
            story.append(Spacer(1, 10))
            toc_data = [
                [Paragraph("<b>1. Executive Summary</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 3</b>", body_style)],
                [Paragraph("<b>2. Corporate KPI Dashboard</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 4</b>", body_style)]
            ]
            if report_type == 'full_consulting_report':
                toc_data.extend([
                    [Paragraph("<b>3. Business Health Score Card</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 5</b>", body_style)],
                    [Paragraph("<b>4. Corporate SWOT Analysis</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 6</b>", body_style)],
                    [Paragraph("<b>5. Predictive Analytics & ML Models</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 7</b>", body_style)],
                    [Paragraph("<b>6. Strategic Recommendations Deck</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 8</b>", body_style)],
                    [Paragraph("<b>7. Strategic Execution Roadmap</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 10</b>", body_style)],
                ])
            else: # ai_insights
                toc_data.extend([
                    [Paragraph("<b>3. Machine Learning Sales Forecast</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 5</b>", body_style)],
                    [Paragraph("<b>4. Customer Attrition Analytics</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 6</b>", body_style)],
                    [Paragraph("<b>5. Strategic Interventions Deck</b>", body_style), Paragraph(". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .", body_style), Paragraph("<b>Page 7</b>", body_style)]
                ])
            toc_table = Table(toc_data, colWidths=[2.2 * inch, 4.0 * inch, 0.8 * inch])
            toc_table.setStyle(TableStyle([
                ('TOPPADDING', (0,0), (-1,-1), 6),
                ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(toc_table)
            story.append(PageBreak())

        # ----------------------------------------------------
        # 3. Section: Executive Summary (All templates, styled as McKinsey narratives)
        # ----------------------------------------------------
        story.append(Paragraph("1. Executive Summary", h1_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph("<b>Current Business Position</b>", h2_style))
        story.append(Paragraph(narrative['position'], body_style))
        story.append(Spacer(1, 10))
        
        story.append(Paragraph("<b>Core Strategic Outlook</b>", h2_style))
        story.append(Paragraph(narrative['outlook'], body_style))
        story.append(Spacer(1, 10))

        story.append(Paragraph("<b>Primary Operational Vulnerabilities</b>", h2_style))
        story.append(Paragraph(narrative['risks'], body_style))
        story.append(Spacer(1, 15))

        if report_type == 'executive_summary':
            story.append(PageBreak())

        # ----------------------------------------------------
        # 4. Section: KPI Dashboard & Tables
        # ----------------------------------------------------
        story.append(Paragraph("2. Corporate Key Performance Metrics", h1_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(
            "The corporate KPIs below serve as baseline health metrics evaluated by the AIMCF consulting engine. "
            "Visual status indicators demonstrate operational compliance against baseline targets.",
            body_style
        ))
        story.append(Spacer(1, 10))

        # Status badge helper
        def get_status_badge(val, type_):
            if type_ == 'growth':
                return "<font color='#10b981'><b>Healthy (>=5%)</b></font>" if val >= 0.05 else "<font color='#f59e0b'><b>Warning (<5%)</b></font>"
            elif type_ == 'churn':
                return "<font color='#10b981'><b>Healthy (<3%)</b></font>" if val < 3.0 else ("<font color='#ef4444'><b>Critical (>=5%)</b></font>" if val >= 5.0 else "<font color='#f59e0b'><b>Warning</b></font>")
            elif type_ == 'risk':
                return "<font color='#10b981'><b>Healthy (Low)</b></font>" if val <= 4 else ("<font color='#ef4444'><b>Critical (High)</b></font>" if val >= 8 else "<font color='#f59e0b'><b>Warning (Medium)</b></font>")
            else: # sentiment
                return "<font color='#10b981'><b>Excellent (>=70%)</b></font>" if val >= 0.70 else "<font color='#f59e0b'><b>Moderate (<70%)</b></font>"

        kpi_data = [
            [Paragraph('<b>Indicator Metric</b>', table_header_style), Paragraph('<b>Current Value</b>', table_header_style), Paragraph('<b>Baseline Compliance</b>', table_header_style)],
            [Paragraph('Gross Revenue Growth', table_body_style), Paragraph(f"{round(kpis.get('revenue_growth', 0.05) * 100, 1)}%", table_body_style), Paragraph(get_status_badge(kpis.get('revenue_growth', 0.05), 'growth'), table_body_style)],
            [Paragraph('Customer Churn Risk', table_body_style), Paragraph(f"{round(kpis.get('churn_rate', 4.2), 1)}%", table_body_style), Paragraph(get_status_badge(kpis.get('churn_rate', 4.2), 'churn'), table_body_style)],
            [Paragraph('Financial Debt Risk Score', table_body_style), Paragraph(f"{kpis.get('risk_score', 4)} / 12", table_body_style), Paragraph(get_status_badge(kpis.get('risk_score', 4), 'risk'), table_body_style)],
            [Paragraph('Market Sentiment Index', table_body_style), Paragraph(f"{round(kpis.get('sentiment_score', 0.6) * 100, 1)}%", table_body_style), Paragraph(get_status_badge(kpis.get('sentiment_score', 0.6), 'sentiment'), table_body_style)]
        ]
        
        kpi_table = Table(kpi_data, colWidths=[2.5 * inch, 2.0 * inch, 2.5 * inch])
        kpi_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), primary_color),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(kpi_table)
        story.append(Spacer(1, 20))

        # Add customer factors chart for AI Insights or Full Report
        if report_type != 'executive_summary':
            story.append(Paragraph("<b>Customer Retention vs Sentiment Analysis</b>", h2_style))
            story.append(VectorChartGenerator.generate_churn_factor_chart(sentiment, churn))
            story.append(Spacer(1, 10))
            story.append(PageBreak())

        # ----------------------------------------------------
        # 5. Section: Business Health Score Gauge (Full Report Only)
        # ----------------------------------------------------
        if report_type == 'full_consulting_report':
            story.append(Paragraph("3. Business Health Score Card", h1_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(
                f"The composite <b>Business Health Score</b> provides a weighted overview of organizational metrics. "
                f"Currently rated as <b>{health_rating.upper()} ({health_score}/100)</b>, the rating is parsed below:",
                body_style
            ))
            story.append(Spacer(1, 10))
            story.append(VectorChartGenerator.generate_health_gauge(health_score))
            story.append(Spacer(1, 15))
            
            # Subscore breakdown table
            score_data = [
                [Paragraph('<b>Health Vector Dimension</b>', table_header_style), Paragraph('<b>Subscore (Max 20)</b>', table_header_style), Paragraph('<b>Strategic Status</b>', table_header_style)],
                [Paragraph('Revenue Growth Performance', table_body_style), Paragraph(str(health_data['subscores']['revenue_performance']), table_body_style), Paragraph("Optimized" if health_data['subscores']['revenue_performance'] >= 16 else "Needs Capital Lift", table_body_style)],
                [Paragraph('Customer Retention Index', table_body_style), Paragraph(str(health_data['subscores']['customer_retention']), table_body_style), Paragraph("Optimized" if health_data['subscores']['customer_retention'] >= 16 else "Needs Churn Intercept", table_body_style)],
                [Paragraph('Financial Stability Leverage', table_body_style), Paragraph(str(health_data['subscores']['financial_stability']), table_body_style), Paragraph("Low Debt Exposure" if health_data['subscores']['financial_stability'] >= 16 else "Leverage Exposure", table_body_style)],
                [Paragraph('Market NLP Brand Sentiment', table_body_style), Paragraph(str(health_data['subscores']['market_sentiment']), table_body_style), Paragraph("Positive Brand Equity" if health_data['subscores']['market_sentiment'] >= 16 else "Feedback QA Backlog", table_body_style)],
                [Paragraph('Calculated Operational Efficiency', table_body_style), Paragraph(str(health_data['subscores']['operational_efficiency']), table_body_style), Paragraph("Streamlined" if health_data['subscores']['operational_efficiency'] >= 16 else "Marginal Bottlenecks", table_body_style)],
            ]
            score_table = Table(score_data, colWidths=[2.6 * inch, 2.0 * inch, 2.4 * inch])
            score_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), secondary_color),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
                ('TOPPADDING', (0,0), (-1,-1), 8),
                ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(score_table)
            story.append(Spacer(1, 15))
            story.append(Paragraph(f"<b>Strategic Advisor Assessment:</b> {health_interpretation}", body_style))
            story.append(PageBreak())

        # ----------------------------------------------------
        # 6. Section: SWOT Analysis (Full Report Only)
        # ----------------------------------------------------
        if report_type == 'full_consulting_report':
            story.append(Paragraph("4. Corporate SWOT Analysis Matrix", h1_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(
                "Based on recent KPI metrics and customer feedback telemetry, our model compiles a structured SWOT matrix:",
                body_style
            ))
            story.append(Spacer(1, 15))

            # SWOT Grid formatting
            swot_s = "".join([f"• {x}<br/>" for x in swot['strengths']])
            swot_w = "".join([f"• {x}<br/>" for x in swot['weaknesses']])
            swot_o = "".join([f"• {x}<br/>" for x in swot['opportunities']])
            swot_t = "".join([f"• {x}<br/>" for x in swot['threats']])

            swot_data = [
                [
                    Paragraph("<b>STRENGTHS (Internal Positives)</b><br/><br/>" + swot_s, body_style),
                    Paragraph("<b>WEAKNESSES (Internal Risks)</b><br/><br/>" + swot_w, body_style)
                ],
                [
                    Paragraph("<b>OPPORTUNITIES (External Positives)</b><br/><br/>" + swot_o, body_style),
                    Paragraph("<b>THREATS (External Risks)</b><br/><br/>" + swot_t, body_style)
                ]
            ]

            swot_table = Table(swot_data, colWidths=[3.4 * inch, 3.4 * inch])
            swot_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (0,0), colors.HexColor('#ecfdf5')), # light green
                ('BACKGROUND', (1,0), (1,0), colors.HexColor('#fef2f2')), # light red
                ('BACKGROUND', (0,1), (0,1), colors.HexColor('#eff6ff')), # light blue
                ('BACKGROUND', (1,1), (1,1), colors.HexColor('#fffbeb')), # light yellow
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
                ('TOPPADDING', (0,0), (-1,-1), 15),
                ('BOTTOMPADDING', (0,0), (-1,-1), 15),
                ('LEFTPADDING', (0,0), (-1,-1), 15),
                ('RIGHTPADDING', (0,0), (-1,-1), 15),
            ]))
            story.append(swot_table)
            story.append(PageBreak())

        # ----------------------------------------------------
        # 7. Section: Predictive Analytics & ML (AI Insights & Full Report)
        # ----------------------------------------------------
        if report_type != 'executive_summary':
            story.append(Paragraph("3. Predictive Analytics & Machine Learning Models", h1_style) if report_type == 'ai_insights' else Paragraph("5. Predictive Analytics & Machine Learning Models", h1_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(
                "By training Scikit-Learn linear regressions and isolation forests on corporate transaction history, "
                "the consulting framework extracts sales forecasts and flags anomalies automatically.",
                body_style
            ))
            story.append(Spacer(1, 10))

            # Fetch prediction data
            forecast_results = ConsultingAnalyticsEngine.forecast_sales([])
            hist_recs = forecast_results['historical'][-6:] # Last 6 months
            fore_recs = forecast_results['forecast']

            # Render forecast line chart
            story.append(VectorChartGenerator.generate_revenue_forecast_chart(hist_recs, fore_recs))
            story.append(Spacer(1, 15))

            # Forecast interpretation
            slope = forecast_results['metrics']['growth_trend_slope']
            r2 = forecast_results['metrics']['r2_score']
            story.append(Paragraph(
                f"<b>Machine Learning Insights:</b> The fitted linear regression model reports an R² goodness of fit score of "
                f"<b>{r2}</b>. Sales trend lines demonstrate a monthly commercial coefficient of "
                f"<b>+${slope:,.2f}</b>, signaling a steady positive path. Reinvesting marketing overheads will maximize this trend.",
                body_style
            ))
            
            # Anomaly detections
            anom_results = ConsultingAnalyticsEngine.detect_anomalies(None)
            story.append(Spacer(1, 10))
            story.append(Paragraph("<b>Isolation Forest Operational Anomaly Detections</b>", h2_style))
            story.append(Paragraph(
                f"Operating an Isolation Forest anomaly classifier on transactional delays flagged "
                f"<b>{anom_results['anomaly_count']} outliers</b> out of {anom_results['total_data_points']} points. "
                f"These spikes indicate structural bottlenecks within the supply chain which trigger client churn warnings.",
                body_style
            ))
            story.append(PageBreak())

        # ----------------------------------------------------
        # 8. Section: Scenario Simulations (Full Report Only)
        # ----------------------------------------------------
        if report_type == 'full_consulting_report':
            story.append(Paragraph("6. Strategic 'What-If' Scenario Simulations", h1_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(
                "Running Multi-Variable Elasticity Simulations modeling a <b>+5% pricing shift</b> paired with "
                "<b>5 days of logistical delays</b> and a <b>+$30k marketing lift</b> demonstrates these changes:",
                body_style
            ))
            story.append(Spacer(1, 10))

            sim_results = ConsultingAnalyticsEngine.run_what_if_simulation(5.0, 5, 30.0)
            sim_rev = sim_results['summary']['simulated_total_revenue']
            base_rev = sim_results['summary']['baseline_total_revenue']
            rev_change = sim_results['summary']['revenue_change_percent']
            sim_churn = sim_results['summary']['simulated_churn_rate']

            sim_data = [
                [Paragraph('<b>Simulation Metric Variable</b>', table_header_style), Paragraph('<b>Baseline Model</b>', table_header_style), Paragraph('<b>Simulated Outcome</b>', table_header_style)],
                [Paragraph('Cumulative Annual Revenue', table_body_style), Paragraph(f"${base_rev:,.2f}", table_body_style), Paragraph(f"${sim_rev:,.2f} ({rev_change}%)", table_body_style)],
                [Paragraph('Customer Churn Risk Rate', table_body_style), Paragraph(f"{kpis.get('churn_rate', 4.2)}%", table_body_style), Paragraph(f"{sim_churn}%", table_body_style)],
            ]
            sim_table = Table(sim_data, colWidths=[2.6 * inch, 2.2 * inch, 2.2 * inch])
            sim_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), primary_color),
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
                ('TOPPADDING', (0,0), (-1,-1), 10),
                ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ]))
            story.append(sim_table)
            story.append(Spacer(1, 15))
            story.append(Paragraph(f"<b>Simulation Strategy Analysis:</b> {sim_results['consulting_assessment']}", body_style))
            story.append(PageBreak())

        # ----------------------------------------------------
        # 9. Section: Strategic Recommendations Deck (All Templates)
        # ----------------------------------------------------
        story.append(Paragraph("3. AI-Generated Strategic Recommendations" if report_type == 'executive_summary' else ("4. AI-Generated Strategic Recommendations" if report_type == 'ai_insights' else "7. AI-Generated Strategic Recommendations Deck"), h1_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(
            "Based on multi-variable linear regressions and health index diagnostics, our models formulate these actionable business recommendations:",
            body_style
        ))
        story.append(Spacer(1, 10))

        # Show filtered recommendation cards depending on template size
        # Executive Consulting Summary: Show top 2 recommendations
        # Predictive Analytics: Show 3 recommendations
        # Strategic Business Advisory: Show all 4-5 recommendations
        display_cards = full_rec_cards
        if report_type == 'executive_summary':
            display_cards = full_rec_cards[:2]
        elif report_type == 'ai_insights':
            display_cards = full_rec_cards[:3]

        for idx, rec in enumerate(display_cards, 1):
            story.append(Paragraph(f"<b>Recommendation {idx}: {rec.get('title')}</b>", h2_style))
            
            # Sub-table metadata card
            card_meta = [
                [
                    Paragraph(f"<b>Priority:</b> {rec.get('priority', 'High')}", body_style),
                    Paragraph(f"<b>Business Area:</b> {rec.get('category')}", body_style),
                    Paragraph(f"<b>Timeline:</b> {rec.get('timeline', '1-3 Months')}", body_style),
                ],
                [
                    Paragraph(f"<b>Expected Impact:</b> {rec.get('impact')}", body_style),
                    Paragraph(f"<b>Difficulty:</b> {rec.get('difficulty')}", body_style),
                    Paragraph("", body_style)
                ]
            ]
            card_table = Table(card_meta, colWidths=[2.3 * inch, 2.3 * inch, 2.4 * inch])
            card_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), bg_light),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ]))
            
            story.append(card_table)
            story.append(Spacer(1, 5))
            story.append(Paragraph(f"<b>Justification:</b> {rec.get('justification', rec.get('description'))}", body_style))
            story.append(Spacer(1, 4))
            story.append(Paragraph(f"<b>Expected Outcome:</b> {rec.get('outcome', 'Streamlined net operating efficiency improvements.')}", body_style))
            story.append(Spacer(1, 15))

        if report_type == 'full_consulting_report':
            story.append(PageBreak())

        # ----------------------------------------------------
        # 10. Section: Action Plan Roadmap (Full Report Only)
        # ----------------------------------------------------
        if report_type == 'full_consulting_report':
            story.append(Paragraph("8. Action Plan Strategic Execution Roadmap", h1_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(
                "To ensure systematic optimization, the client should follow this scheduled implementation timeline:",
                body_style
            ))
            story.append(Spacer(1, 15))

            roadmap_data = [
                [
                    Paragraph("<b>IMMEDIATE ACTIONS<br/>(0–30 Days)</b>", body_style),
                    Paragraph("• Retructure short-term high interest debt lines.<br/>• Launch early-warning client SUCCESS taskforce squads.", body_style)
                ],
                [
                    Paragraph("<b>SHORT-TERM ACTIONS<br/>(1–3 Months)</b>", body_style),
                    Paragraph("• Train Scikit-Learn linear sales forecast regression algorithms on active transactional datasets.<br/>• Complete zero-based budgeting OpEx overhead capital audits.", body_style)
                ],
                [
                    Paragraph("<b>MEDIUM-TERM ACTIONS<br/>(3–6 Months)</b>", body_style),
                    Paragraph("• Deploy automated login telemetry warnings.<br/>• Expand product sales campaigns inside Tier-1 enterprise territories.", body_style)
                ],
                [
                    Paragraph("<b>LONG-TERM ACTIONS<br/>(6–12 Months)</b>", body_style),
                    Paragraph("• Launch Net Promoter Score client referral seeding incentives.<br/>• Refinance remaining debt to fixed long-term portfolios.", body_style)
                ],
            ]

            roadmap_table = Table(roadmap_data, colWidths=[2.2 * inch, 4.8 * inch])
            roadmap_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (0,-1), bg_light),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ('TOPPADDING', (0,0), (-1,-1), 12),
                ('BOTTOMPADDING', (0,0), (-1,-1), 12),
                ('LEFTPADDING', (0,0), (-1,-1), 15),
            ]))
            story.append(roadmap_table)

        return story
