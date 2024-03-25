# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Setup

You can run the project with:
```bash
npm install  # to install the project dependecies
npm run dev  # to start the project in development mode
```
or
```bash
make ui-deps # to install the project dependencies
make ui-dev  # to start the project in development mode
```

## Configuration

It is necesary to have a `.env` file with these vars configured:
```
VITE_APP_API_BASE_URL='base url to your api'
```