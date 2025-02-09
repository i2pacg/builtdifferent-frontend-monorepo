# Main Frontend Overview 🌟

## Overview
The main frontend is a Vue.js application that serves as the primary interface for users. It provides the main functionalities and interacts with the Laravel backend.

## Environment Configuration 🌍
- Shared `.env` variables with the backend.
- Specific configurations for the main frontend are defined in the `.env` file.

## Dependencies and Shared Components 📦
- Uses shared components from the `shared` package.
- Dependencies include Vue.js, Vue Router, and various plugins for functionality.
- Interacts with the backend API for data and business logic.

## Installation and Setup 🛠️
### Prerequisites
- Node.js 14.x or higher
- PNPM

### Setup
1. Navigate to the `frontend` package:
```sh
cd packages/frontend
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

## Contributing 🤝
We welcome contributions from the community. Please read our contributing guidelines to get started.

## License 📄
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact 📧
For any inquiries or support, please contact us at support@example.com.