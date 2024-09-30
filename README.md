# Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

- **npm**: npm is included with Node.js, but you can install it separately if needed.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/chatbot.git
   cd chatbot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Running the Application

To run the application locally, follow these steps:

1. **Set up your environment variables:**

   Create a `.env.local` file in the root directory of your project and add the following line:

   ```plaintext
   GROQ_API_KEY=your_groq_api_key_here
   ```

   Replace `your_groq_api_key_here` with your actual API key.

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Access the application:**

   Open your web browser and go to `http://localhost:3000` to see the chatbot in action.
