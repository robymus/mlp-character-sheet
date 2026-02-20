# MLP Character Sheet

A digital character sheet for the My Little Pony Roleplaying Game built with standard HTML, CSS, and Vanilla JavaScript, powered by a modern Vite build toolchain.

## Project Structure

This project follows a standard Vite configuration:

*   **`public/`**: Contains static assets that are served directly without processing (e.g., the root `favicon.svg` and `logo.png`).
*   **`src/`**: Contains all source code including HTML structure, styling, logic, and processed assets inside `/assets/`.
*   **`index.html`**: The main entry point file residing in the root, which references the `src/main.js` execution script.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) and `npm` installed. You can check this by running:

```bash
node -v
npm -v
```

### Installation

Clone the repository and install the development dependencies (primarily Vite):

```bash
npm install
```

### Local Development

To spin up a local development server with Hot Module Replacement (HMR), run:

```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`. Any changes you make to the source files will be instantly reflected in the browser.

### Building for Production

When you are ready to deploy the application, you must bundle it. Vite will package the Vanilla JS, minify your CSS, resolve asset paths, and generate a highly optimized `dist/` folder.

```bash
npm run build
```

The resulting `dist/` directory can then be uploaded to **any static host** (like GitHub Pages, Netlify, Apache, or Nginx). It is 100% vanilla and requires no server-side processing.

To preview your production build locally before uploading:

```bash
npm run preview
```
