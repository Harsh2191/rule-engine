# Rule Engine with AST (Abstract Syntax Tree)

## Objective
This project implements a 3-tier rule engine application to determine user eligibility based on attributes such as age, department, salary, and experience. The system utilizes an Abstract Syntax Tree (AST) to represent conditional rules, allowing for dynamic creation, combination, and modification of rules.

## Project Deployed Link:
- running application click here->[Live link](https://rule-engine-frontend-fawn.vercel.app/)
(wait a bit for the system to get load and become functional some time it takes time)

## Features Implemented
- **AST Representation:** Dynamically creates an AST from rule strings, supporting complex logical conditions.
- **Rule Combination:** Supports combining multiple rules using logical operators (AND/OR).
- **Rule Evaluation:** Evaluates rules based on user data (age, department, salary, experience).
- **Rule Management:** Create, update, delete, and combine rules dynamically.
- **Dynamic Inputs:** Input user attributes and check eligibility based on the created rules.
- **Implemented Bonus Features:**
  - Error handling for invalid rule strings and data formats.
  - Attribute validation against a catalog.
  - Modify existing rules (change operators, values, or expressions).

## Project Architecture

### 1. **Frontend**
Located in the `rule-engine-ui` folder.
- Developed using **ReactJS**.
- Deployed on **Vercel**.
- Key functionalities:
  - Rule creation, modification, and deletion.
  - Input fields for user attributes (age, department, salary, experience).
  - Users can select from multiple created rules for evaluation.
  - Rule evaluation (both individually and combined with AND/OR logic).
- Main frontend file: `ruleForm.jsx` (located in `rule-engine-ui/my-react-app/src/component/ruleForm.jsx`).

### 2. **Backend**
Located in the `rule-engine` folder.
- Developed using **Node.js** and **Express**.
- Deployed on **Render**.
- Provides REST APIs to:
  - Create, update, and delete rules.
  -  Rest Apis to Evaluate rules based on user input data.
  -  function to Parse rule strings into an AST (tokenization, parsing).
  -  evaluateAst function to Evaluate user attributes against the parsed AST.
  -  logic to Combine list of  rule strings into a single AST for evaluation.

### 3. **Database**
- **MongoDB** is used for storing rule strings and metadata.

---

## How to Run Locally

Follow these steps to run the Rule Engine project locally on your machine.

### Prerequisites

- Node.js (v14+)
- MongoDB (For storing the rules)
- Git (For cloning the repository)
- A package manager (npm or yarn)

### Backend Setup

1. **Clone the Repository**

   Clone the project repository to your local machine:

   ```bash
   git clone https://github.com/Harsh2191/rule-engine.git
2 .Navigate to the Backend Directory

    cd rule-engine
3. Install Dependencies
   **npm install express nodemon mongoose dotenv cors**
4. Set Up Environment Variables
   **mongodb=url of your database**
    **,  PORT=3000**
5. Start the Backend Server
   **npm start**
6. The backend server will be running on **http://localhost:3000**
### Frontend setup
1. Navigate to the Frontend Directory
   **cd rule-engine-ui/my-react-app**

2. Install Dependencies
   **npm install axios notistack**
3. TailwindCSS Setup
   **npm install -D tailwindcss postcss autoprefixer**
   **,  npx tailwindcss init -p**
4. Start the Frontend Application
    **npm run dev**
5.  The frontend server will be running on **http://localhost:5173**

