---
applyTo: '**/portfolio.tsx'
---

# Portfolios Dashboard - Portfolio List Section

## Overview
The Portfolio List section allows users to view, select, and manage their created portfolios. This section serves as the main navigation hub for portfolio-specific operations.

## Key Components

### Portfolio Items
- **Portfolio Name**: User-defined identifier
- **Capital Amount**: Initial investment amount
- **Creation Date**: When portfolio was created
- **Selection State**: Visual indication of active portfolio

### Portfolio Storage
- Currently uses localStorage for persistence
- Future: Migrate to database/file-based storage
- JSON format with structured data

## Implementation Guidelines

### Data Structure
```typescript
interface Portfolio {
  id: string;
  name: string;
  capital: number;
  createdAt: string;
}
```

### List Rendering
```typescript
{portfolios.length === 0 ? (
  <p className="text-muted-foreground">No portfolios created yet.</p>
) : (
  <div className="space-y-2">
    {portfolios.map((portfolio) => (
      <PortfolioItem key={portfolio.id} portfolio={portfolio} />
    ))}
  </div>
)}
```

### Selection Logic
- Single portfolio selection at a time
- Visual feedback with border highlighting
- State management with useState
- Callback to parent component

### CRUD Operations
- Create: Add new portfolio to list
- Read: Display existing portfolios
- Update: Modify portfolio details (future)
- Delete: Remove portfolio (future)

## UI Requirements
- Card-based layout with hover effects
- Consistent spacing (space-y-2)
- Clickable items with cursor pointer
- Empty state messaging
- Loading states during operations

## Data Persistence
- localStorage for client-side storage
- JSON serialization/deserialization
- Error handling for corrupted data
- Migration path for future storage solutions

## Performance Considerations
- Efficient re-rendering with React keys
- Memoization of expensive operations
- Virtual scrolling for large lists (future)
- Optimized state updates

## User Experience
- Intuitive selection mechanism
- Clear visual hierarchy
- Responsive design for all screen sizes
- Smooth transitions and animations
- Contextual actions and menus

## Future Enhancements
- Drag-and-drop reordering
- Bulk operations
- Advanced filtering and search
- Portfolio templates
- Performance metrics per portfolio
