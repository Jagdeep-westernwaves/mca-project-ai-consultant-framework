from reportlab.graphics.shapes import Drawing, Rect, Circle, String, Group, Line, Polygon
from reportlab.lib import colors

class VectorChartGenerator:
    @staticmethod
    def generate_health_gauge(score):
        """
        Draws a premium corporate progress gauge.
        """
        d = Drawing(400, 100)
        
        # Background bar
        d.add(Rect(20, 40, 360, 20, rx=10, ry=10, fillColor=colors.HexColor('#e2e8f0'), strokeColor=None))
        
        # Filled progress color based on score
        fill_color = colors.HexColor('#3b82f6') # Blue
        if score < 55:
            fill_color = colors.HexColor('#ef4444') # Red
        elif score < 70:
            fill_color = colors.HexColor('#f59e0b') # Orange
        elif score >= 85:
            fill_color = colors.HexColor('#10b981') # Green
            
        filled_width = max(20, min(360, int(3.6 * score)))
        d.add(Rect(20, 40, filled_width, 20, rx=10, ry=10, fillColor=fill_color, strokeColor=None))
        
        # Labels and numbers
        d.add(String(20, 70, "0", fontName='Helvetica-Bold', fontSize=10, fillColor=colors.HexColor('#64748b')))
        d.add(String(370, 70, "100", fontName='Helvetica-Bold', fontSize=10, fillColor=colors.HexColor('#64748b')))
        
        # Current Value text
        d.add(String(160, 10, f"Business Health: {score}/100", fontName='Helvetica-Bold', fontSize=12, fillColor=colors.HexColor('#0f172a')))
        
        return d

    @staticmethod
    def generate_revenue_forecast_chart(historical, forecast):
        """
        Draws a beautiful vector trend line chart comparing historical to forecast.
        """
        d = Drawing(400, 150)
        
        # Draw background grid
        d.add(Rect(0, 0, 400, 150, fillColor=colors.HexColor('#f8fafc'), strokeColor=colors.HexColor('#cbd5e1'), strokeWidth=0.5))
        for y in range(30, 130, 30):
            d.add(Line(0, y, 400, y, strokeColor=colors.HexColor('#e2e8f0'), strokeWidth=0.5))
            
        # Draw lines and points
        hist_len = len(historical)
        fore_len = len(forecast)
        total_len = hist_len + fore_len
        
        # Combine points to scale
        all_vals = [h.get('sales', 100000) for h in historical] + [f.get('sales', 100000) for f in forecast]
        max_val = max(all_vals) if all_vals else 200000
        min_val = min(all_vals) if all_vals else 50000
        val_range = max_val - min_val if max_val != min_val else 100000
        
        def get_y(val):
            return 25 + int(((val - min_val) / val_range) * 100)
            
        # Draw Historical Line (Blue)
        hist_coords = []
        for i, h in enumerate(historical):
            x = 25 + int((i / (total_len - 1)) * 350)
            y = get_y(h.get('sales', 100000))
            hist_coords.append((x, y))
            # Circle marker
            d.add(Circle(x, y, 3, fillColor=colors.HexColor('#3b82f6'), strokeColor=None))
            
        for i in range(len(hist_coords) - 1):
            p1 = hist_coords[i]
            p2 = hist_coords[i+1]
            d.add(Line(p1[0], p1[1], p2[0], p2[1], strokeColor=colors.HexColor('#3b82f6'), strokeWidth=2))
            
        # Draw Forecast Line (Green dashed representation or offset)
        fore_coords = []
        # Connect last historical point to first forecast point
        if hist_coords:
            fore_coords.append(hist_coords[-1])
            
        for i, f in enumerate(forecast):
            idx = hist_len + i
            x = 25 + int((idx / (total_len - 1)) * 350)
            y = get_y(f.get('sales', 100000))
            fore_coords.append((x, y))
            # Square marker
            d.add(Rect(x-2.5, y-2.5, 5, 5, fillColor=colors.HexColor('#10b981'), strokeColor=None))
            
        for i in range(len(fore_coords) - 1):
            p1 = fore_coords[i]
            p2 = fore_coords[i+1]
            d.add(Line(p1[0], p1[1], p2[0], p2[1], strokeColor=colors.HexColor('#10b981'), strokeWidth=2))

        # Labels
        d.add(String(10, 135, "Revenue Trend (Historical vs Forecast)", fontName='Helvetica-Bold', fontSize=9, fillColor=colors.HexColor('#0f172a')))
        d.add(String(25, 10, "Jan", fontName='Helvetica', fontSize=8, fillColor=colors.HexColor('#64748b')))
        d.add(String(360, 10, "Dec", fontName='Helvetica', fontSize=8, fillColor=colors.HexColor('#64748b')))
        
        return d

    @staticmethod
    def generate_churn_factor_chart(sentiment_score, churn_rate):
        """
        Draws a bar chart showing churn variables vs baseline target.
        """
        d = Drawing(400, 120)
        
        # Background
        d.add(Rect(0, 0, 400, 120, fillColor=colors.HexColor('#ffffff'), strokeColor=colors.HexColor('#f1f5f9'), rx=8, ry=8))
        
        # Baseline Target (3%)
        d.add(Rect(40, 20, 320, 15, fillColor=colors.HexColor('#f1f5f9'), strokeColor=None))
        d.add(Rect(40, 20, min(320, int(churn_rate * 32)), 15, fillColor=colors.HexColor('#ef4444') if churn_rate > 5.0 else colors.HexColor('#f59e0b'), strokeColor=None))
        d.add(String(40, 40, f"Customer Churn: {churn_rate}% (Target < 3.0%)", fontName='Helvetica-Bold', fontSize=8, fillColor=colors.HexColor('#475569')))
        
        # Sentiment score (e.g. 68%)
        d.add(Rect(40, 65, 320, 15, fillColor=colors.HexColor('#f1f5f9'), strokeColor=None))
        d.add(Rect(40, 65, int(sentiment_score * 320), 15, fillColor=colors.HexColor('#10b981') if sentiment_score > 0.6 else colors.HexColor('#3b82f6'), strokeColor=None))
        d.add(String(40, 85, f"Customer Sentiment: {round(sentiment_score*100, 1)}% (Target >= 70%)", fontName='Helvetica-Bold', fontSize=8, fillColor=colors.HexColor('#475569')))
        
        return d
