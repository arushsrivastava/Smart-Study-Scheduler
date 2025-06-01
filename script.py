import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json

# Create comprehensive study analytics data for the dashboard
analytics_data = {
    "overview_stats": {
        "total_topics": 28,
        "active_topics": 23,
        "completed_topics": 5,
        "total_study_hours": 156.5,
        "current_streak": 12,
        "average_session_length": 28.5,
        "success_rate": 76.8,
        "this_week_hours": 18.5,
        "last_week_hours": 22.3
    },
    
    "daily_sessions_7_days": [
        {"date": "2025-05-25", "sessions": 3, "study_time": 75, "topics_reviewed": 2},
        {"date": "2025-05-26", "sessions": 2, "study_time": 60, "topics_reviewed": 2},
        {"date": "2025-05-27", "sessions": 4, "study_time": 90, "topics_reviewed": 3},
        {"date": "2025-05-28", "sessions": 1, "study_time": 30, "topics_reviewed": 1},
        {"date": "2025-05-29", "sessions": 3, "study_time": 70, "topics_reviewed": 2},
        {"date": "2025-05-30", "sessions": 5, "study_time": 110, "topics_reviewed": 4},
        {"date": "2025-05-31", "sessions": 2, "study_time": 50, "topics_reviewed": 2}
    ],
    
    "weekly_progress_12_weeks": [
        {"week": "Week 16", "total_hours": 28.5, "avg_quality": 3.2, "topics_completed": 2},
        {"week": "Week 17", "total_hours": 32.1, "avg_quality": 3.8, "topics_completed": 3},
        {"week": "Week 18", "total_hours": 25.7, "avg_quality": 3.1, "topics_completed": 1},
        {"week": "Week 19", "total_hours": 31.8, "avg_quality": 3.6, "topics_completed": 2},
        {"week": "Week 20", "total_hours": 29.3, "avg_quality": 3.4, "topics_completed": 2},
        {"week": "Week 21", "total_hours": 32.4, "avg_quality": 3.7, "topics_completed": 3},
        {"week": "Week 22", "total_hours": 39.6, "avg_quality": 4.1, "topics_completed": 4},
        {"week": "Week 23", "total_hours": 36.0, "avg_quality": 3.9, "topics_completed": 3}
    ],
    
    "monthly_stats": [
        {"month": "March 2025", "total_sessions": 95, "total_hours": 142.5, "topics_completed": 8, "avg_quality": 3.4},
        {"month": "April 2025", "total_sessions": 110, "total_hours": 167.8, "topics_completed": 12, "avg_quality": 3.7},
        {"month": "May 2025", "total_sessions": 125, "total_hours": 189.3, "topics_completed": 15, "avg_quality": 3.8}
    ],
    
    "topic_difficulty_distribution": [
        {"difficulty": "Easy", "count": 8, "percentage": 28.6, "avg_success_rate": 89.2},
        {"difficulty": "Medium", "count": 15, "percentage": 53.6, "avg_success_rate": 76.4},
        {"difficulty": "Hard", "count": 5, "percentage": 17.8, "avg_success_rate": 62.1}
    ],
    
    "category_performance": [
        {"category": "Mathematics", "topics": 8, "success_rate": 75.3, "total_hours": 45.2, "avg_quality": 3.6},
        {"category": "Programming", "topics": 6, "success_rate": 84.7, "total_hours": 38.1, "avg_quality": 4.1},
        {"category": "Science", "topics": 5, "success_rate": 70.2, "total_hours": 32.8, "avg_quality": 3.4},
        {"category": "Language", "topics": 4, "success_rate": 89.5, "total_hours": 25.7, "avg_quality": 4.3},
        {"category": "Business", "topics": 3, "success_rate": 78.9, "total_hours": 18.4, "avg_quality": 3.8},
        {"category": "Other", "topics": 2, "success_rate": 82.1, "total_hours": 12.3, "avg_quality": 3.9}
    ],
    
    "spaced_repetition_intervals": [
        {"interval_days": "1", "topics_count": 5, "description": "New topics"},
        {"interval_days": "1-3", "topics_count": 8, "description": "Learning phase"},
        {"interval_days": "4-10", "topics_count": 7, "description": "Short-term review"},
        {"interval_days": "11-30", "topics_count": 6, "description": "Medium-term review"},
        {"interval_days": "31+", "topics_count": 2, "description": "Long-term review"}
    ],
    
    "study_goals": {
        "daily_target_minutes": 120,
        "weekly_target_hours": 14,
        "monthly_target_topics": 20,
        "current_progress": {
            "daily_completion": 87.5,
            "weekly_completion": 92.3,
            "monthly_completion": 75.0
        }
    }
}

# Save as CSV files for easy import
import pandas as pd

# Daily sessions data
daily_df = pd.DataFrame(analytics_data["daily_sessions_7_days"])
daily_df.to_csv("daily_study_sessions.csv", index=False)

# Weekly progress data
weekly_df = pd.DataFrame(analytics_data["weekly_progress_12_weeks"])
weekly_df.to_csv("weekly_study_progress.csv", index=False)

# Category performance data
category_df = pd.DataFrame(analytics_data["category_performance"])
category_df.to_csv("category_performance.csv", index=False)

# Complete analytics data as JSON
with open("complete_analytics_data.json", "w") as f:
    json.dump(analytics_data, f, indent=2)

print("Study Analytics Data Generated Successfully!")
print("\nFiles created:")
print("- daily_study_sessions.csv")
print("- weekly_study_progress.csv") 
print("- category_performance.csv")
print("- complete_analytics_data.json")

print("\n=== ANALYTICS OVERVIEW ===")
print(f"Total Topics: {analytics_data['overview_stats']['total_topics']}")
print(f"Study Hours This Week: {analytics_data['overview_stats']['this_week_hours']}")
print(f"Current Streak: {analytics_data['overview_stats']['current_streak']} days")
print(f"Overall Success Rate: {analytics_data['overview_stats']['success_rate']}%")

print("\n=== TOP PERFORMING CATEGORIES ===")
for cat in sorted(analytics_data["category_performance"], key=lambda x: x["success_rate"], reverse=True)[:3]:
    print(f"- {cat['category']}: {cat['success_rate']}% success rate")