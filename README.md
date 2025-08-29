# Health Insurance Call Center Application

An Angular 18+ application designed for health insurance call center operations, enabling service representatives to efficiently lookup member information, track calls, and manage customer interactions with a modern VS Code-inspired dark theme interface.

## Features

- **Modern Angular 18+** with standalone components and signal-based state management
- **VS Code Dark Theme UI** - Consistent dark theme styling throughout the application
- **Central Loading Service** - Unified loading states with contextual messages and realistic delays
- **Call Session Management** - Track calls from start to finish with professional interface
- **Member Lookup** - Search by Member ID, name, and date of birth with instant feedback
- **Comprehensive Member Information**:
  - Demographics and contact information
  - Claims history with status tracking
  - Benefits information and accumulators
  - Prior authorizations and history
  - Call history tracking
- **Async/Await Architecture** - Modern Promise-based data operations with loading integration
- **Keyboard & Mouse Navigation** - Full accessibility support
- **Responsive Design** - Works on desktop and mobile devices
- **Mock Data Service** - Ready for integration with real APIs with realistic network simulation

## Technology Stack

- **Frontend**: Angular 18+ with TypeScript
- **Styling**: CSS3 with responsive design
- **Testing**: Jasmine, Karma, and Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages ready

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-customer-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:4200`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:github-pages` - Build for GitHub Pages deployment
- `npm test` - Run unit tests
- `npm run test:ci` - Run tests in CI mode
- `npm run e2e` - Run Playwright end-to-end tests
- `npm run e2e:ui` - Run Playwright tests with UI
- `npm run lint` - Run linting

## Environments

The application supports multiple environments:

- **Development** (`environment.ts`) - Local development
- **Production** (`environment.prod.ts`) - Production deployment
- **GitHub Pages** (`environment.github-pages.ts`) - GitHub Pages deployment

## Project Structure

```
src/
├── app/
│   ├── components/           # Angular standalone components
│   │   ├── member-lookup.component.*
│   │   ├── member-details.component.*
│   │   ├── member-data-view/
│   │   │   └── member-data-view.component.*
│   │   ├── member-demographics/
│   │   │   └── member-demographics.component.*
│   │   ├── call-session.component.*
│   │   └── loading-spinner.component.*
│   ├── services/            # Service layer for data access
│   │   ├── member.service.ts
│   │   ├── call-session.service.ts
│   │   └── loading.service.ts
│   ├── models/              # TypeScript interfaces and types
│   │   └── member.model.ts
│   ├── styles/              # Global theme styles
│   │   └── pointc-theme.css
│   └── environments/        # Environment configurations
├── e2e/                     # Playwright tests
└── .github/
    └── workflows/           # GitHub Actions CI/CD
```

## Component Architecture

### Call Session Management

- **CallSessionComponent**: Manages active call sessions with VS Code-styled interface
- Tracks call duration, agent information, and call notes
- Provides modal for ending calls with final notes

### Member Lookup

- **MemberLookupComponent**: Search interface for member identification with loading integration
- Supports search by Member ID, name, and date of birth
- Form validation, error handling, and real-time loading feedback

### Member Details

- **MemberDetailsComponent**: Clean two-tab interface for member information
- Demographics & Family tab for personal information
- Claims, Benefits & History tab for comprehensive data view
- Responsive design with keyboard navigation (legacy view removed)

### Member Data View

- **MemberDataViewComponent**: Comprehensive tabbed interface for member data
- Claims, benefits, accumulators, prior authorizations, and history
- Async data loading with contextual loading messages

### Loading System

- **LoadingSpinnerComponent**: VS Code-themed loading overlay with spinner animation
- **LoadingService**: Signal-based centralized loading state management
- Contextual loading messages and realistic network delay simulation

## Service Layer

### MemberService
- Mock data service for member information
- Simulates API calls with realistic delays
- Provides methods for searching and retrieving member data

### CallSessionService
- Manages call session state using Angular signals
- Tracks call lifecycle from start to completion
- Integrates with member identification workflow

## Testing

### Unit Tests
Run with Jest and Angular Testing Utilities:
```bash
npm test
```

### End-to-End Tests
Run with Playwright:
```bash
npm run e2e
```

## Deployment

### GitHub Pages
The application is configured for automatic deployment to GitHub Pages:

1. Push to the `main` branch
2. GitHub Actions will build and test the application
3. If tests pass, deploys to GitHub Pages
4. Failed tests do not prevent deployment (as requested)

### Manual Deployment
Build for production:
```bash
npm run build:github-pages
```

## Accessibility

The application follows WCAG guidelines:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus indicators

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please contact the development team.