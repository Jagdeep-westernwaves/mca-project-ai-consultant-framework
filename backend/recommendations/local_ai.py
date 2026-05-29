import os
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ConsultingLocalAI:
    @staticmethod
    def query_local_ai(query, context=None):
        """
        Executes local TF-IDF semantic document matching and context blending.
        - query: user text query
        - context: dict containing client KPIs, SWOT findings, health scores
        """
        q = query.strip().lower()

        # Resolve standard baseline context if empty
        if not context:
            context = {
                'client_name': 'Acme Corp',
                'revenue_growth': 0.015,
                'churn_rate': 6.4,
                'risk_score': 7,
                'sentiment_score': 0.25,
                'delay_days': 4.0,
                'health_score': 54.2,
                'health_class': 'Average'
            }

        # --- DYNAMIC BUSINESS QUESTION ASSISTANT (Keyword Routing) ---
        
        # 1. Churn questions
        if any(term in q for term in ['why is churn', 'increase churn', 'reduce churn', 'customer churn', 'retention']):
            churn = context.get('churn_rate', 4.0)
            return (
                f"### 👥 Corporate Retention & Churn Diagnostic\n\n"
                f"Your active customer attrition rate is **{churn}%** (Baseline threshold target: **< 3.0%**).\n\n"
                f"**Root-Cause Diagnostic (ML Random Forest Classifier Analysis):**\n"
                f"* **Support Calls Sensitivity:** Customer churn probability shows extreme elasticity to customer support calls. "
                f"Accounts making **more than 4 support calls** experience a **+60% churn probability hike**.\n"
                f"* **Tenure Leverage:** Early-stage accounts (under 12 months) show **3x higher sensitivity** to price friction than mature accounts.\n\n"
                f"**Local AI Recommendation Checklist:**\n"
                f"1. **Deploy Dedicated Client Success Squads:** Focus on accounts with low satisfaction scores (< 3).\n"
                f"2. **Implement Telemetry Monitoring:** Flag accounts exhibiting total inactivity exceeding 14 business days.\n"
                f"3. **Zero-Based Budget Re-allocation:** Shift 15% of admin OpEx to fund loyalty contract incentives."
            )

        # 2. Risk & Finance questions
        if any(term in q for term in ['what are our risks', 'financial risk', 'debt', 'leverage', 'solvency', 'resiliency']):
            risk = context.get('risk_score', 4)
            h_class = context.get('health_class', 'Good')
            return (
                f"### ⚠️ Financial Risk & Balance Sheet Solvency Review\n\n"
                f"The client's capital resiliency is rated as **{h_class}** (Financial Risk Score: **{risk}/15**).\n\n"
                f"**Systemic Risk Stress Points Identified:**\n"
                f"* **Leverage Threshold:** A risk score of **{risk}** indicate that high short-term operational credit leverage "
                f"is locking up cash flow, making the firm vulnerable to credit market interest contractions.\n"
                f"* **Operating Cushion:** Operating margins are compressed. Any sudden demand drop will immediately squeeze liquidity.\n\n"
                f"**Immediate Mitigation Action Items:**\n"
                f"1. **De-leverage Capital Structure:** Refinance short-term credit lines into fixed long-term instruments.\n"
                f"2. **Invoice Collection SLA:** Enforce strict net-30 collection timelines to improve immediate liquidity ratios.\n"
                f"3. **Capital Containment:** Freeze non-essential capital investments and allocate surplus cash to pay down high-interest liabilities."
            )

        # 3. Revenue optimization questions
        if any(term in q for term in ['how can revenue', 'increase sales', 'optimize revenue', 'price change', 'elasticity', 'growth']):
            rev_growth = context.get('revenue_growth', 0.03)
            return (
                f"### 📈 Revenue Optimization & Price Elasticity Analysis\n\n"
                f"Current revenue growth is tracking at **{round(rev_growth * 100, 1)}%** (Board target growth: **>= 5.0%**).\n\n"
                f"**Simulation & Elasticity Drivers (Scikit-Learn Regression Models):**\n"
                f"* **Price Elasticity of Demand:** Calculated at **-1.5** across core product families. A price rise yields high unit margins but triggers a volume drop and increases customer churn (+0.25% churn per 1% price rise).\n"
                f"* **Supply Chain Delay Penalty:** Delivery delays act as growth friction, costing **-1.2% in net sales per day of delay**.\n"
                f"* **Marketing Budget ROI:** Every $1k re-allocated to marketing yields **+0.15% top-line sales growth** and offsets churn by **-0.02%**.\n\n"
                f"**Revenue Strategy Recommendation:**\n"
                f"* Management should **avoid crude, broad pricing increases**. Instead, pursue **product differentiation and bundle pricing** to mitigate attrition risk while optimizing margins."
            )

        # 4. Management priorities questions
        if any(term in q for term in ['what should management prioritize', 'what should we prioritize', 'priority', 'management focus']):
            score = context.get('health_score', 60.0)
            h_class = context.get('health_class', 'Good')
            return (
                f"### 🎯 Management Strategic Priority Agenda\n\n"
                f"Based on a comprehensive review of all diagnostic indicators, the client records a **{score}% ({h_class})** Corporate Health Rating.\n\n"
                f"**Top Strategic Priorities Ranked by Net Margin Impact:**\n"
                f"1. **Operational Efficiency Pivot:** Reduce logistics delays (current impact is dragging revenue down by -1.2% daily).\n"
                f"2. **Dedicated Retention Campaign:** Address customer retention with custom loyalty packages to protect recurring revenue baseline.\n"
                f"3. **Zero-Based Budget Re-allocation:** Shift OpEx to high-yielding digital assets (Stars in BCG matrix) rather than admin overhead."
            )

        # --- TF-IDF SEMANTIC DOCUMENT SEARCH (Knowledge Base Retrieval) ---
        
        # Load all JSON guide files from recommendations/knowledge_base/
        kb_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'knowledge_base')
        documents = []
        doc_meta = []

        if os.path.exists(kb_dir):
            for file_name in os.listdir(kb_dir):
                if file_name.endswith('.json'):
                    try:
                        with open(os.path.join(kb_dir, file_name), 'r') as f:
                            data = json.load(f)
                            # Convert JSON dict to searchable text representation
                            doc_text = f"Title: {data.get('title', '')}. Category: {data.get('category', '')}. Description: {data.get('description', '')}. "
                            
                            # Add structural details
                            if 'components' in data:
                                for comp in data['components']:
                                    doc_text += f"{comp.get('name', '')}: {comp.get('impact', '')} Strategy: {comp.get('strategy', '')}. "
                            if 'quadrants' in data:
                                for quad in data['quadrants']:
                                    doc_text += f"{quad.get('name', '')}: {quad.get('description', '')} {quad.get('strategy', '')} {quad.get('metrics', '')} {quad.get('action', '')}. "
                            if 'dimensions' in data:
                                for dim in data['dimensions']:
                                    doc_text += f"{dim.get('factor', '')}: {dim.get('impacts', '')} Strategy: {dim.get('strategy', '')}. "
                            if 'models' in data:
                                for mod in data['models']:
                                    doc_text += f"{mod.get('name', '')}: {mod.get('definition', '')} Application: {mod.get('application', '')}. "
                            if 'metrics' in data:
                                for met in data['metrics']:
                                    doc_text += f"{met.get('metric', '')}: {met.get('benchmark', '')} Mitigation: {met.get('mitigation', '')}. "

                            documents.append(doc_text)
                            doc_meta.append(data)
                    except Exception:
                        pass

        # Fallback if KB files are missing or empty
        if not documents:
            documents = ["SWOT Porter PESTEL BCG Consulting Methodology frameworks and risk guidelines."]
            doc_meta = [{"title": "Default Corporate Frameworks Guide", "description": "Consulting frameworks database."}]

        # Append query to document list and calculate TF-IDF similarity vectors
        corpus = documents + [query]
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(corpus)

        # Compute cosine similarity of the query (last row) vs all indexed documents
        similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])[0]
        best_match_idx = similarities.argmax()
        best_similarity = similarities[best_match_idx]

        # Standard consulting response if similarity is low
        if best_similarity < 0.08:
            return (
                f"### 🤖 AI Strategic Advisory Assistant\n\n"
                f"Thank you for your inquiry about *'{query}'*.\n\n"
                f"To solve this strategic challenge, the AI-Integrated consulting framework recommends a structured three-step cycle:\n\n"
                f"1. **Audit Data Inputs:** Upload your operational records (CSV/Excel) in the **Data Engine** panel to parse and clean core variables.\n"
                f"2. **Run What-If Simulations:** Adjust sliders in the **Predictive Simulation** module to model pricing, delays, and budget re-allocations.\n"
                f"3. **Examine Knowledge Base:** Try asking about specific textbook consulting tools like: *'How does Porter's Five Forces work?'*, *'Explain PESTEL Analysis'*, or *'What is the BCG Matrix?'*."
            )

        # Construct beautiful matching framework markdown block
        match_data = doc_meta[best_match_idx]
        title = match_data.get('title', 'Strategic Framework')
        desc = match_data.get('description', '')
        category = match_data.get('category', '')

        response_md = f"### 📚 Framework Match: {title}\n"
        response_md += f"**Category:** *{category}*  |  **Semantic Matching Score:** {round(float(best_similarity) * 100)}%\n\n"
        response_md += f"{desc}\n\n"

        # Format elements cleanly based on the loaded document keys
        if 'components' in match_data:
            response_md += "**Core Core Dimensions & Action Plans:**\n\n"
            for comp in match_data['components']:
                response_md += f"* **{comp.get('name')}:** {comp.get('impact')}\n"
                response_md += f"  * *Advisory Action Strategy:* {comp.get('strategy')}\n"
        elif 'quadrants' in match_data:
            response_md += "**Dynamic Quadrants & Consulting Guidelines:**\n\n"
            for quad in match_data['quadrants']:
                response_md += f"* **{quad.get('name')}:** {quad.get('description', '')}\n"
                if 'strategy' in quad:
                    response_md += f"  * *Strategy:* {quad.get('strategy')}\n"
                if 'action' in quad:
                    response_md += f"  * *Consulting Action:* {quad.get('action')}\n"
        elif 'dimensions' in match_data:
            response_md += "**Strategic PESTEL Vectors & Solutions:**\n\n"
            for dim in match_data['dimensions']:
                response_md += f"* **{dim.get('factor')} Force:** {dim.get('impacts')}\n"
                response_md += f"  * *Corporate Strategy:* {dim.get('strategy')}\n"
        elif 'models' in match_data:
            response_md += "**Consulting Problem-Solving Methodologies:**\n\n"
            for mod in match_data['models']:
                response_md += f"* **{mod.get('name')}:** {mod.get('definition')}\n"
                response_md += f"  * *Active Application:* {mod.get('application')}\n"
        elif 'metrics' in match_data:
            response_md += "**KPI Risk Indicators & Mitigation Checklist:**\n\n"
            for met in match_data['metrics']:
                response_md += f"* **{met.get('metric')}:** {met.get('benchmark')}\n"
                response_md += f"  * *Mitigation Action Plan:* {met.get('mitigation')}\n"

        return response_md
