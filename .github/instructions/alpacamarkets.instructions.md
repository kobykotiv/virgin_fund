---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

# Alpaca Markets Trading Bot Dashboard PaaS

This project is a platform-as-a-service (PaaS) for building and deploying trading bots on the Alpaca Markets API. It provides a user-friendly interface for managing bot strategies, monitoring performance, and executing trades.

## Project Structure

- `app/`: Contains the main application code, including API routes and frontend components.
- `lib/`: Contains reusable utility functions and types.
- `hooks/`: Contains custom React hooks for managing state and side effects.
- `types/`: Contains TypeScript type definitions for the project.

## Coding Guidelines

1. **Type Safety**: Use TypeScript for all new code. Define types for all function parameters and return values.
2. **Error Handling**: Implement robust error handling in all API routes and data fetching functions. Return meaningful error messages to the client.
3. **Code Organization**: Organize code into modules based on functionality. Keep related functions and types together.
4. **Testing**: Write unit tests for all new features and bug fixes. Use a testing framework like Jest or React Testing Library.
5. **Documentation**: Document all public functions and components using JSDoc comments. Include examples where applicable.