import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Data from the provided JSON
data = {
  "reviews": [
    {"reviewNumber": 1, "day": 1, "quality": 4, "interval": 1, "easinessFactor": 2.5},
    {"reviewNumber": 2, "day": 2, "quality": 5, "interval": 6, "easinessFactor": 2.6},
    {"reviewNumber": 3, "day": 8, "quality": 3, "interval": 15, "easinessFactor": 2.46},
    {"reviewNumber": 4, "day": 23, "quality": 4, "interval": 37, "easinessFactor": 2.56},
    {"reviewNumber": 5, "day": 60, "quality": 2, "interval": 1, "easinessFactor": 2.36},
    {"reviewNumber": 6, "day": 61, "quality": 4, "interval": 6, "easinessFactor": 2.46}
  ]
}

# Extract data
reviews = data["reviews"]
days = [r["day"] for r in reviews]
quality = [r["quality"] for r in reviews]
intervals = [r["interval"] for r in reviews]
easiness = [r["easinessFactor"] for r in reviews]

# Create subplots with secondary y-axis
fig = make_subplots(specs=[[{"secondary_y": True}]])

# Add interval line (primary y-axis)
fig.add_trace(
    go.Scatter(
        x=days,
        y=intervals,
        mode='lines+markers',
        name='Interval (days)',
        line=dict(color='#1FB8CD', width=3),
        marker=dict(size=10),
        hovertemplate='Day %{x}<br>Interval: %{y} days<br>Quality: %{customdata[0]}<br>EF: %{customdata[1]:.2f}<extra></extra>',
        customdata=list(zip(quality, easiness))
    ),
    secondary_y=False,
)

# Add easiness factor line (secondary y-axis)
fig.add_trace(
    go.Scatter(
        x=days,
        y=easiness,
        mode='lines+markers',
        name='Easiness Factor',
        line=dict(color='#FFC185', width=3),
        marker=dict(size=10),
        hovertemplate='Day %{x}<br>EF: %{y:.2f}<br>Quality: %{customdata[0]}<br>Interval: %{customdata[1]} days<extra></extra>',
        customdata=list(zip(quality, intervals))
    ),
    secondary_y=True,
)

# Add quality ratings as colored markers
# Green for successful (≥3), red for failed (<3)
for i, (day, qual, interval, ef) in enumerate(zip(days, quality, intervals, easiness)):
    color = '#5D878F' if qual >= 3 else '#B4413C'
    symbol = 'circle' if qual >= 3 else 'x'
    name = 'Success (Q≥3)' if qual >= 3 else 'Failed (Q<3)'
    
    # Only add to legend for first occurrence of each type
    showlegend = False
    if qual >= 3 and i == 0:  # First successful review
        showlegend = True
    elif qual < 3 and not any(q < 3 for q in quality[:i]):  # First failed review
        showlegend = True
    
    fig.add_trace(
        go.Scatter(
            x=[day],
            y=[interval],
            mode='markers',
            name=name,
            marker=dict(
                color=color,
                size=15,
                symbol=symbol,
                line=dict(width=2, color='white')
            ),
            hovertemplate=f'Day {day}<br>Quality: {qual}<br>Interval: {interval} days<br>EF: {ef:.2f}<extra></extra>',
            showlegend=showlegend
        ),
        secondary_y=False,
    )

# Set x-axis title
fig.update_xaxes(title_text="Days")

# Set y-axes titles
fig.update_yaxes(title_text="Interval (days)", secondary_y=False)
fig.update_yaxes(title_text="Easiness Factor", secondary_y=True)

# Update layout
fig.update_layout(
    title="SM-2 Algorithm Progression",
    hovermode='closest',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('sm2_algorithm_chart.png')