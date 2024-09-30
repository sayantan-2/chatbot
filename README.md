# Prerequisites

Before you begin, ensure you have met the following requirements:

1. **Node.js**
   - Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.
   - To check if you have Node.js installed, run the following command in your terminal:

     ```bash
     node -v
     ```

   - If Node.js is not installed, you can download it from [nodejs.org](https://nodejs.org/) and follow the installation instructions for your operating system.

2. **npm**
   - npm (Node Package Manager) is included with Node.js and is used to manage project dependencies.
   - To check if you have npm installed, run:

     ```bash
     npm -v
     ```

   - If npm is not installed, it will be installed automatically when you install Node.js.

## Installation

To set up the project on your local machine, follow these steps:

1. **Clone the repository:**
   - Use Git to clone the project repository to your local machine. Open your terminal and run:

     ```bash
     git clone https://github.com/sayantan-2/chatbot.git
     ```

   - Navigate to the project directory:

     ```bash
     cd chatbot
     ```

2. **Install dependencies:**
   - Once you are in the project directory, install all necessary dependencies by running:

     ```bash
     npm install
     ```

   - This command reads the `package.json` file and installs all the required packages for the project.

## Running the Application

To run the application locally, follow these steps:

1. **Set up your environment variables:**
   - Create a file named `.env.local` in the root directory of your project. This file will store your environment variables.
   - Add the following line to the `.env.local` file:

     ```plaintext
     GROQ_API_KEY=your_groq_api_key_here
     ```

   - Make sure to replace `your_groq_api_key_here` with your actual Groq API key, which you should have obtained from your Groq account.

2. **Start the development server:**
   - Run the following command in your terminal to start the development server:

     ```bash
     npm run dev
     ```

   - This command will start the server, and you should see output indicating that the server is running.

3. **Access the application:**
   - Open your web browser and navigate to `http://localhost:3000`.
   - You should now see the chatbot application running locally on your machine.
