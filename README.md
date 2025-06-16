# Even - AI Powered Chat Application

**Even** is a modern, responsive chat application that leverages the power of AI to assist users in various text-based tasks. It features a clean interface, multiple AI modes, and persistent chat history.

<!-- Optional: Add a screenshot or GIF of your application here -->
<!-- ![Even App Screenshot](https://placehold.co/800x450.png?text=Even+App+Screenshot) -->
<!-- To add a real screenshot:
1. Take a screenshot of your app.
2. Upload it to this repository (e.g., in an `assets` folder or directly in the root).
3. Replace the placeholder URL above with the path to your image, e.g., `./screenshot.png`.
-->

## ✨ Key Features

*   **Multiple AI Modes**:
    *   **General Chat**: Engage in freeform conversations.
    *   **Fix Grammar**: Improve grammar and clarity of your text.
    *   **Summarize**: Condense long text into concise summaries.
    *   **Formalize**: Make your text sound more professional.
*   **Persistent Chat History**: Sessions are saved to LocalStorage, allowing users to continue conversations later.
*   **Session Management**: Create new chats, rename existing chats, and delete chats.
*   **Responsive Design**: Adapts seamlessly to various screen sizes, from mobile to desktop.
*   **Collapsible Sidebar**: Easily manage and navigate through chat history.
*   **Theme Toggle**: Switch between Light and Dark modes.
*   **Real-time AI Interaction**: Uses Next.js Server Actions for smooth communication with the AI backend.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)
*   **UI Library**: [React](https://reactjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **AI Integration**: [Genkit (by Firebase)](https://firebase.google.com/docs/genkit) with Google's Gemini Models
*   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <your-repository-url>
    cd even-chat-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables** (Optional but good practice):
    Create a `.env` file in the root of your project. If your Genkit configuration (e.g., for Google AI) requires API keys or specific project IDs not hardcoded, you would add them here. For the current setup with `@genkit-ai/googleai`, ensure your environment is authenticated with Google Cloud if you are using models that require it.
    Example `.env` content (if needed by your specific Google AI setup):
    ```env
    GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
    ```
    *Note: The current `src/ai/genkit.ts` initializes `googleAI()` without explicit API key parameters, relying on Application Default Credentials or other environment-based authentication methods supported by Google Cloud client libraries.*

### Running the Application

1.  **Start the Next.js development server**:
    This will run the main application.
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:9002`.

2.  **Start the Genkit Inspector (in a separate terminal)**:
    This tool allows you to inspect and test your Genkit flows.
    ```bash
    npm run genkit:dev
    ```
    Or, to watch for changes and automatically restart:
    ```bash
    npm run genkit:watch
    ```
    The Genkit Inspector will typically be available at `http://localhost:4000`.

## 📁 Project Structure Overview

*   `src/app/`: Core Next.js pages, layouts, and server actions.
*   `src/components/`: Reusable React components (including UI components from ShadCN).
*   `src/ai/`: Genkit flows, schemas, and AI model configurations.
*   `src/lib/`: Utility functions, type definitions, and library configurations.
*   `src/hooks/`: Custom React hooks.
*   `public/`: Static assets like images (e.g., `icon.png`).

---

This README provides a good starting point. Feel free to add more sections like "Contributing," "Deployment," or "Troubleshooting" as your project evolves!
