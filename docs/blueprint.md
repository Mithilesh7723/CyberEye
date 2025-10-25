# **App Name**: CyberEye

## Core Features:

- Log Ingestion: Accept logs from various sources via web interface.
- Rule-Based Detection: Identify suspicious activities based on predefined rules and thresholds.
- Anomaly Detection (Optional): Use unsupervised learning to detect unusual patterns in numeric log features.
- AI Explanation Engine: Employ a local LLM to generate natural-language summaries and recommended actions for flagged events. The tool will analyze what happened and determine immediate actions for investigators, suggesting evidence to preserve.
- Visualization & Reporting: Provide a web-based dashboard showing flagged incidents, suspicious IPs/users, and exportable reports.
- Deployment on Firebase: Deploy the application using Firebase Hosting and Functions for a free, offline solution.

## Style Guidelines:

- Primary color: Deep blue (#2E3192) to convey trust and security.
- Background color: Light gray (#E5E7E9) for a clean, neutral interface.
- Accent color: Bright orange (#FF7F50) for alerts and critical actions.
- Headline font: 'Space Grotesk', sans-serif, for headlines and short amounts of body text. Body text: 'Inter', sans-serif.
- Use clear, consistent icons to represent different log sources and event types.
- Dashboard should have a clear hierarchy with incident summaries at the top, followed by detailed views.
- Subtle animations to highlight new incidents or important updates on the dashboard.