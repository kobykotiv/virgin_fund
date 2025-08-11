# CRUD Objects for GenEric TraDer AI

## Overview
This document outlines all CRUD objects in the application, their attributes, and associated operations. These objects are central to the functionality of the GenEric TraDer AI platform.

---

## 1. **User**
### Attributes:
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed)
- `created_at`: Timestamp
- `plan_level`: String (e.g., "free", "premium")

### Operations:
- Create: Register a new user.
- Read: Fetch user profile.
- Update: Modify user details (e.g., plan level).
- Delete: Remove user account.

---

## 2. **Portfolio**
### Attributes:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to User)
- `name`: String
- `balance`: Numeric
- `positions`: JSONB (Array of holdings)
- `created_at`: Timestamp

### Operations:
- Create: Add a new portfolio.
- Read: Fetch portfolios for a user.
- Update: Modify portfolio details (e.g., balance, name).
- Delete: Remove a portfolio.

---

## 3. **Position**
### Attributes:
- `id`: UUID (Primary Key)
- `portfolio_id`: UUID (Foreign Key to Portfolio)
- `symbol`: String (e.g., "AAPL")
- `qty`: Numeric
- `price`: Numeric
- `created_at`: Timestamp

### Operations:
- Create: Add a new position to a portfolio.
- Read: Fetch positions for a portfolio.
- Update: Modify position details (e.g., qty, price).
- Delete: Remove a position.

---

## 4. **Trade**
### Attributes:
- `id`: UUID (Primary Key)
- `portfolio_id`: UUID (Foreign Key to Portfolio)
- `symbol`: String
- `side`: String ("buy" or "sell")
- `qty`: Numeric
- `price`: Numeric
- `executed_at`: Timestamp

### Operations:
- Create: Record a new trade.
- Read: Fetch trades for a portfolio.
- Update: Modify trade details (e.g., qty, price).
- Delete: Remove a trade.

---

## 5. **Bot**
### Attributes:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to User)
- `name`: String
- `strategy`: String
- `status`: String ("active", "paused")
- `settings`: JSONB

### Operations:
- Create: Add a new bot.
- Read: Fetch bots for a user.
- Update: Modify bot details (e.g., strategy, status).
- Delete: Remove a bot.

---

## 6. **Signal**
### Attributes:
- `id`: UUID (Primary Key)
- `bot_id`: UUID (Foreign Key to Bot)
- `name`: String
- `symbol`: String
- `indicator`: String (e.g., "EMA", "RSI")
- `threshold`: Numeric
- `timeframe`: String

### Operations:
- Create: Add a new signal.
- Read: Fetch signals for a bot.
- Update: Modify signal details (e.g., threshold, indicator).
- Delete: Remove a signal.

---

## 7. **Backtest**
### Attributes:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to User)
- `portfolio_id`: UUID (Foreign Key to Portfolio)
- `strategy`: String
- `parameters`: JSONB
- `results`: JSONB
- `created_at`: Timestamp

### Operations:
- Create: Run a new backtest.
- Read: Fetch backtest results for a user.
- Update: Modify backtest parameters.
- Delete: Remove a backtest.

---

## 8. **Strategy**
### Attributes:
- `id`: UUID (Primary Key)
- `portfolio_id`: UUID (Foreign Key to Portfolio)
- `name`: String
- `description`: String
- `settings`: JSONB

### Operations:
- Create: Add a new strategy.
- Read: Fetch strategies for a portfolio.
- Update: Modify strategy details (e.g., settings, description).
- Delete: Remove a strategy.

---

## 9. **Settings**
### Attributes:
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to User)
- `key`: String
- `value`: String

### Operations:
- Create: Add a new setting.
- Read: Fetch settings for a user.
- Update: Modify setting value.
- Delete: Remove a setting.

---

## Notes
- All objects are stored in PostgreSQL.
- Relationships are enforced via foreign keys.
- JSONB fields allow flexible storage for complex data structures.
- CRUD operations are exposed via RESTful API endpoints.
