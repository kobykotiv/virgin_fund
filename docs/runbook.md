# Runbook - Alpaca Integration

Emergency steps
- If a user reports suspicious trades or token compromise: revoke the user's Alpaca token in DB and call Alpaca revoke endpoint if available.
- Disable live trading for that user immediately in your admin console.
- Notify stakeholders and open an incident ticket.

Common recovery
- Revoke and re-connect the user's Alpaca account via the OAuth flow.
- If orders need to be reversed, consult the audit log and communicate with the user.

Maintenance
- Rotate credential encryption keys on schedule.
- Monitor API error rates and alert on sudden spikes.
