---
applyTo: '**/portfolio.tsx'
---

# Portfolios Dashboard - Portfolio Creation Section

## Overview
The Portfolio Creation section provides a modal dialog for users to create new portfolios with initial capital allocation, including validation against available Alpaca account balance.

## Key Components

### Creation Dialog
- **Portfolio Name**: User-defined identifier
- **Initial Capital**: Starting investment amount
- **Capital Validation**: Against buying power
- **Confirmation**: Create/cancel actions

### Form Validation
- Required field validation
- Numeric input validation
- Capital limit validation
- Duplicate name prevention (future)

## Implementation Guidelines

### Dialog Structure
```typescript
<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
  <DialogTrigger asChild>
    <Button>Create Portfolio</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Portfolio</DialogTitle>
    </DialogHeader>
    <PortfolioCreationForm />
  </DialogContent>
</Dialog>
```

### Form Components
```typescript
const PortfolioCreationForm = () => {
  const [name, setName] = useState('');
  const [capital, setCapital] = useState('');

  const handleSubmit = () => {
    // Validation and creation logic
  };

  return (
    <div className="space-y-4">
      <InputField label="Portfolio Name" value={name} onChange={setName} />
      <InputField label="Initial Capital" value={capital} onChange={setCapital} />
      <Button onClick={handleSubmit}>Create Portfolio</Button>
    </div>
  );
};
```

### Validation Logic
```typescript
const createPortfolio = () => {
  if (!newPortfolioName || !newPortfolioCapital) return;

  const capital = parseFloat(newPortfolioCapital);
  if (isNaN(capital) || capital <= 0) return;

  if (account && capital > parseFloat(account.buying_power)) {
    alert('Capital exceeds available buying power');
    return;
  }

  // Create portfolio logic
};
```

### Capital Validation
- Compare against Alpaca buying power
- Real-time validation feedback
- Prevent over-allocation
- Dynamic max value display

## UI Requirements
- Modal dialog with proper backdrop
- Form fields with labels and placeholders
- Validation error messages
- Loading states during creation
- Success/error notifications

## Data Persistence
- Add to portfolios array
- Update localStorage
- Generate unique IDs
- Timestamp creation

## User Experience
- Intuitive form layout
- Real-time validation feedback
- Clear error messaging
- Success confirmation
- Keyboard navigation support

## Security Considerations
- Input sanitization
- XSS prevention
- Rate limiting for creation
- Audit logging (future)

## Performance Optimization
- Efficient state updates
- Debounced validation
- Optimized re-rendering
- Memory leak prevention

## Future Enhancements
- Portfolio templates
- Bulk creation
- Import from CSV
- Advanced allocation strategies
- Risk profile selection
