# Rule Engine with AST (Abstract Syntax Tree)

## Objective
This project implements a 3-tier rule engine application to determine user eligibility based on attributes such as age, department, salary, and experience. The system utilizes an Abstract Syntax Tree (AST) to represent conditional rules, allowing for dynamic creation, combination, and modification of rules.

## Project deployed Link:
  -[Live link](https://rule-engine-frontend-fawn.vercel.app/)
## Features Implemented
- **AST Representation:** Dynamically creates an AST from rule strings, supporting complex logical conditions.
- **Rule Combination:** Supports combining multiple rules using logical operators (AND/OR).
- **Rule Evaluation:** Evaluates rules based on user data (age, department, salary, experience).
- **Rule Management:** Create, update, delete, and combine rules dynamically.
- **Dynamic Inputs:** Input user attributes and check eligibility based on the created rules.
- ** Implemented Bonus Features:**
  - Error handling for invalid rule strings and data formats.
  - Attribute validation against a catalog.
  - Modify existing rules (change operators, values, or expressions).
  

## Project Architecture

### 1. **Frontend**
- Developed using **ReactJS**.
- Deployed on **Vercel**.
- Key functionalities:
  - Rule creation, modification, deletion.
  - Input fields for user attributes (age, department, salary, experience).
  - user can select from multiple created rules for evaluation
  - Rule evaluation (both individual and combined with AND / OR).

### 2. **Backend**
- Developed using **Node.js** and **Express**.
- Deployed on **Render**.
- Provides REST APIs to:
  - Create, update, delete rules.
  - Combine multiple rules into a single AST.
  - Evaluate rules based on user input data.

## Data Structure

The AST is represented using the following Node structure:
```javascript
class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type;        // 'operator' (AND/OR) or 'operand' (conditions)
    this.left = left;        // Left child (another Node)
    this.right = right;      // Right child (another Node)
    this.value = value;      // Value for operand nodes (e.g., age, salary, etc.)
  }
}

