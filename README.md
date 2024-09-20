

# Mental Health Companion

**Mental Health Companion** is a Next.js project that uses Google Generative AI to provide support and resources for mental health. This guide will walk you through the steps of setting up the project on your local machine.

## Prerequisites

Before starting, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [Git](https://git-scm.com/)

## Steps to Set Up the Project

### 1. Clone the Repository

1. Open your terminal in VS code (or Git Bash on Windows).
2. Navigate to the directory where you want to store the project.
3. Run the following command to clone the repository:

   ```bash
   git clone https://github.com/Kap04/Mental_health_companian.git
   ```

4. Navigate to the project folder:

   ```bash
   cd mental_health_companion
   ```

### 2. Pull Latest Changes (Good Practice)

Before making any changes, always pull the latest updates from the repository to ensure you have the most recent version of the project.

```bash
git pull origin main
```

This will sync your local repository with any changes that other team members have pushed.

### 3. Install Dependencies

After cloning the repository, you'll need to install the project dependencies. Run the following command:

```bash
npm install
```

This command will install all the necessary libraries and packages, such as React, Next.js, Tailwind CSS, and Google Generative AI SDK.

### 4. Set Up Environment Variables

The project requires environment variables (such as API keys) to work properly.

1. Create a `.env.local` file in the root of the project.
2. Add the following environment variables to the file:

   ```bash
   NEXT_PUBLIC_GEMINI_API_KEY=(API key is in whatsapp group description)
   ```

   GEMINI_API_KEY is the key to accessing the gemini AI

### 5. Run the Project in Development Mode

You can now start the project in development mode. This allows you to see changes in real-time as you code.

```bash
npm run dev
```

After running this command, the project will start, and you can open it in your browser by visiting:

```
http://localhost:3000
```


## Common Git Commands

- **Commit your changes**: After making changes, stage your files and commit them:
  ```bash
  git add .
  git commit -m "Your message"
  ```

- **Push your changes**: Once committed, push the changes to GitHub:
  ```bash
  git push origin main
  ```

- **Pull latest changes**: Always pull the latest changes before starting new work:
  ```bash
  git pull origin main
  ```

## Troubleshooting

- **If you encounter errors when installing dependencies**: Make sure you have the correct version of Node.js installed.
- **If the project doesn’t start properly**: Ensure the `.env.local` file is properly configured with the correct API keys.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Generative AI Documentation](https://developers.generativeai.google/)

---

### Contributions

Feel free to open issues or submit pull requests if you have any improvements or bug fixes.

