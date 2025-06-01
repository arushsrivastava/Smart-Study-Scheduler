import plotly.graph_objects as go
import plotly.io as pio

# Data for daily sessions
dates = ["May 25", "May 26", "May 27", "May 28", "May 29", "May 30", "May 31"]
sessions = [3, 2, 4, 1, 3, 5, 2]

# Create line chart
fig = go.Figure()

fig.add_trace(go.Scatter(
    x=dates,
    y=sessions,
    mode='lines+markers',
    name='Sessions',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8, color='#1FB8CD'),
    hovertemplate='<b>%{x}</b><br>Sessions: %{y}<extra></extra>',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Daily Study Sessions',
    xaxis_title='Date',
    yaxis_title='Sessions',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image("study_sessions_chart.png")