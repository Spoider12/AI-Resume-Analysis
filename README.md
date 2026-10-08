# AI Resume Analysis

AI Resume Analysis helps job seekers prepare for interviews by comparing their resume or self-description with a job description. It generates a personalized interview preparation report, highlights possible skill gaps, and suggests learning resources.

## Features

- User registration, login, and logout
- Upload a PDF resume or provide a self-description
- Analyze the candidate’s information against a job description
- Generate interview questions and a preparation roadmap
- Identify skills required by the role that may be missing from the resume
- Provide learning resources and reference links for skill gaps
- Save and view interview reports

## Tech Stack

**Frontend**
- React
- Vite
- Sass
- Axios

**Backend**
- Node.js
- Express
- MongoDB and Mongoose
- Groq AI API
- JWT authentication using HTTP-only cookies
- PDF text extraction with `pdf-parse`

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- MongoDB database
- Groq API key

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install dependencies

```bash
npm install
npm install --prefix Frontend
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GROQ_API_KEY=your_groq_api_key
```

Do not commit `.env` or share its contents publicly.

### 4. Run the application locally

Start the backend in one terminal:

```bash
npm run dev
```

Start the frontend in a second terminal:

```bash
npm run dev --prefix Frontend
```

Open the frontend URL printed by Vite, usually `http://localhost:5173`.

The frontend proxies `/api` requests to the backend running at `http://localhost:3000`.

## Resume Upload

The resume upload currently accepts PDF files up to 3 MB. Alternatively, provide a self-description. A job description is required to generate a report.

## API Routes

| Method | Route | Description | Authentication |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create an account | No |
| `POST` | `/api/auth/login` | Log in | No |
| `GET` | `/api/auth/logout` | Log out | No |
| `GET` | `/api/auth/get-me` | Get the logged-in user | Yes |
| `POST` | `/api/interview/` | Generate an interview report | Yes |
| `GET` | `/api/interview/` | List the user's reports | Yes |
| `GET` | `/api/interview/report/:interviewId` | Get a report by ID | Yes |

The report-generation endpoint expects `multipart/form-data` with:

- `jobDescription` — required
- `resume` — optional PDF file
- `selfDescription` — optional text; provide this or a resume

Authentication uses an HTTP-only cookie set by the login or registration endpoint.

## Project Structure

```text
.
├── Backend/
│   ├── server.js
│   └── src/
│       ├── config/
│       ├── controller/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
├── Frontend/
│   └── src/
├── .env                 # Create locally; do not commit
└── package.json
```

## Available Scripts

From the project root:

```bash
npm run dev    # Run the backend with nodemon
npm start      # Start the backend
npm run build  # Install dependencies and build the frontend
```

From the `Frontend` directory, or using `--prefix Frontend`:

```bash
npm run dev --prefix Frontend      # Start the Vite development server
npm run build --prefix Frontend    # Build the frontend
npm run lint --prefix Frontend     # Run ESLint
```

## Security and Privacy

- Keep API keys and database credentials in environment variables.
- Never commit `.env` files, access tokens, or other secrets.
- Interview reports contain personal resume information. Only access or share reports where authorized.

## License

No license has been specified for this project yet.
