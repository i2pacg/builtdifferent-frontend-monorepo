# Dashboard Frontend Overview 📊

## Overview
The dashboard frontend is a Vue.js application that serves as the interface for the dashboard subdomain. It provides administrative functionalities and interacts with the Laravel backend.

## Subdomain Setup 🌐
- This frontend serves the dashboard subdomain, secured with Sanctum.

## Environment Configuration 🌍
- `.env.dashboard`: Environment configuration specific to the dashboard subdomain.
- Specific variables required by this package are defined in the `.env` file.

## Installation and Setup 🛠️
### Prerequisites
- Node.js 14.x or higher
- PNPM

### Setup
1. Navigate to the `dashboard` package:
```sh
cd packages/dashboard
```
2. Install Node.js dependencies:
```sh
pnpm install
```

### Running the Development Server
1. Start the development server:
```sh
pnpm dev
```

## Development and Build Scripts 🛠️
- `dev`: Starts the development server.
- `build`: Builds the project for production.
- `lint`: Lints the project files.

## Dependencies and Shared Components 📦
- Uses shared components from the `shared` package.
- Dependencies include Vue.js, Vuetify, and various plugins for functionality.

## Contributing 🤝
We welcome contributions from the community. Please read our contributing guidelines to get started.

## License 📄
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact 📧
For any inquiries or support, please contact us at support@example.com.