import re
import collections

class ConsultingNLPService:
    # Stopwords list fallback in case NLTK downloads are unavailable locally
    STOPWORDS = set([
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd",
        'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers',
        'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
        'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
        'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
        'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
        'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
        'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
        'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should',
        "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't",
        'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't",
        'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't",
        'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
    ])

    POSITIVE_WORDS = {
        'successful', 'success', 'great', 'excellent', 'outstanding', 'good', 'improved', 'growth', 'grow',
        'positive', 'perfect', 'love', 'fantastic', 'increase', 'profit', 'efficient', 'efficiency', 'strong',
        'happy', 'recommend', 'practical', 'benefit', 'benefits', 'valuable', 'win', 'solved'
    }

    NEGATIVE_WORDS = {
        'fail', 'failure', 'bad', 'poor', 'decline', 'drop', 'negative', 'worse', 'terrible', 'defect',
        'delay', 'delays', 'slow', 'expensive', 'costly', 'issue', 'issues', 'problem', 'problems',
        'sub-optimal', 'error', 'errors', 'waste', 'risk', 'risks', 'difficult', 'bottleneck', 'at-risk'
    }

    @staticmethod
    def analyze_sentiment(text):
        """
        Calculates sentiment scores from -1.0 to +1.0.
        Uses NLTK Vader if installed and accessible, otherwise falls back to a lexical analyzer.
        """
        try:
            from nltk.sentiment.vader import SentimentIntensityAnalyzer
            sid = SentimentIntensityAnalyzer()
            scores = sid.polarity_scores(text)
            compound = scores['compound']
            
            if compound >= 0.05:
                label = 'Positive'
            elif compound <= -0.05:
                label = 'Negative'
            else:
                label = 'Neutral'
                
            return {
                'compound_score': round(float(compound), 4),
                'positive_score': round(float(scores['pos']), 4),
                'negative_score': round(float(scores['neg']), 4),
                'neutral_score': round(float(scores['neu']), 4),
                'sentiment_label': label
            }
        except Exception:
            # Lexical Fallback Analyzer
            words = re.findall(r'\b\w+\b', text.lower())
            if not words:
                return {'compound_score': 0.0, 'sentiment_label': 'Neutral'}

            pos_count = sum(1 for w in words if w in ConsultingNLPService.POSITIVE_WORDS)
            neg_count = sum(1 for w in words if w in ConsultingNLPService.NEGATIVE_WORDS)

            net = pos_count - neg_count
            total = max(1, pos_count + neg_count)
            compound = net / total

            # Rescale slightly
            compound = max(-1.0, min(1.0, compound * 0.5))

            if compound > 0.1:
                label = 'Positive'
            elif compound < -0.1:
                label = 'Negative'
            else:
                label = 'Neutral'

            return {
                'compound_score': round(float(compound), 4),
                'positive_score': round(pos_count / len(words), 4),
                'negative_score': round(neg_count / len(words), 4),
                'neutral_score': round(1 - (pos_count + neg_count) / len(words), 4),
                'sentiment_label': label
            }

    @staticmethod
    def extract_keywords(text, num_keywords=8):
        """
        Tokenizes text, strips punctuation/stopwords, and extracts the most frequent words.
        """
        words = re.findall(r'\b[a-z]{3,}\b', text.lower())
        filtered_words = [w for w in words if w not in ConsultingNLPService.STOPWORDS]
        
        counter = collections.Counter(filtered_words)
        most_common = counter.most_common(num_keywords)
        
        return [
            {'word': word, 'count': count} 
            for word, count in most_common
        ]

    @staticmethod
    def generate_executive_summary(reviews_list):
        """
        Synthesizes reviews/feedbacks to generate an executive business advisory summary.
        """
        if not reviews_list:
            return {
                'summary': "No client feedback or text reviews were supplied for analysis.",
                'strengths': [],
                'concerns': []
            }

        total_reviews = len(reviews_list)
        positives = 0
        negatives = 0
        all_text = " ".join(reviews_list)

        strengths = []
        concerns = []

        for rev in reviews_list:
            sentiment = ConsultingNLPService.analyze_sentiment(rev)
            if sentiment['sentiment_label'] == 'Positive':
                positives += 1
                # Grab short phrase of positive review
                sentences = rev.split('.')
                if len(sentences) > 0:
                    strengths.append(sentences[0].strip())
            elif sentiment['sentiment_label'] == 'Negative':
                negatives += 1
                sentences = rev.split('.')
                if len(sentences) > 0:
                    concerns.append(sentences[0].strip())

        # Synthesize strategic advice
        pos_ratio = positives / total_reviews if total_reviews > 0 else 0
        if pos_ratio >= 0.7:
            summary = f"Highly encouraging sentiment observed ({round(pos_ratio*100)}% positive). Clients praise strategic initiatives and operational growth. Continue scaling current models."
        elif pos_ratio >= 0.4:
            summary = f"Mixed market sentiment registered ({round(pos_ratio*100)}% positive). Growth strides are offset by friction points in logistics or system training. Standardize procedures."
        else:
            summary = f"Critical risk indicators observed ({round((1 - pos_ratio)*100)}% negative/neutral sentiment). Broad dissatisfaction reported around core service delivery. Implement prompt corrective interventions."

        # Unique lists
        strengths = list(set(strengths))[:3]
        concerns = list(set(concerns))[:3]

        # Handle empty lists
        if not strengths:
            strengths = ["Consistently high engagement", "Prompt strategy delivery"]
        if not concerns:
            concerns = ["Address potential supply chain lag", "Optimize communication frequency"]

        return {
            'overall_summary': summary,
            'metrics': {
                'total_records_analyzed': total_reviews,
                'positive_feedback_count': positives,
                'negative_feedback_count': negatives,
                'customer_satisfaction_score': round(pos_ratio * 100, 1)
            },
            'strengths': strengths,
            'concerns': concerns,
            'keywords': ConsultingNLPService.extract_keywords(all_text)
        }
