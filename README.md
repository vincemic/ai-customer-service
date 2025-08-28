# Health Insurance Call Center Application

An Angular 18+ application designed for health insurance call center operations, enabling service representatives to efficiently lookup member information, track calls, and manage customer interactions.

## Features

- **Modern Angular 18+** with standalone components
- **Call Session Management** - Track calls from start to finish
- **Member Lookup** - Search by Member ID, name, and date of birth
- **Comprehensive Member Information**:
  - Demographics and contact information
  - Claims history with status tracking
  - Benefits information
  - Deductible tracking
  - Prior authorizations
- **Keyboard & Mouse Navigation** - Full accessibility support
- **Responsive Design** - Works on desktop and mobile devices
- **Mock Data Service** - Ready for integration with real APIs

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
│   │   └── call-session.component.*
│   ├── services/            # Service layer for data access
│   │   ├── member.service.ts
│   │   └── call-session.service.ts
│   ├── models/              # TypeScript interfaces and types
│   │   └── member.model.ts
│   └── environments/        # Environment configurations
├── e2e/                     # Playwright tests
└── .github/
    └── workflows/           # GitHub Actions CI/CD
```

## Component Architecture

### Call Session Management
- **CallSessionComponent**: Manages active call sessions
- Tracks call duration, agent information, and call notes
- Provides modal for ending calls with final notes

### Member Lookup
- **MemberLookupComponent**: Search interface for member identification
- Supports search by Member ID, name, and date of birth
- Form validation and error handling

### Member Details
- **MemberDetailsComponent**: Tabbed interface for member information
- Demographics, claims, benefits, deductibles, and prior authorizations
- Responsive design with keyboard navigation

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