// utils/ast.js

// Tokenize function
function tokenize(expr) {
  const regex = /\s*(>=|<=|!=|>|<|=|\(|\)|AND|OR|[\w\.]+|'[^']*')\s*/g;
  return expr.match(regex).map(token => token.trim()); // Trim each token to remove spaces
}

// Parse function: Parses the tokens into an Abstract Syntax Tree (AST)
function parse(tokens) {
  let i = 0;

  function parseExpression() {
    let left = parseTerm();
    while (tokens[i] === 'OR') {
      i++;
      let right = parseTerm();
      left = { type: 'LogicalOperation', operator: 'OR', left, right };
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (tokens[i] === 'AND') {
      i++;
      let right = parseFactor();
      left = { type: 'LogicalOperation', operator: 'AND', left, right };
    }
    return left;
  }

  function parseFactor() {
    if (tokens[i] === '(') {
      i++;
      let expr = parseExpression();
      i++; // consume ')'
      return expr;
    }
    return parseComparison();
  }

  function parseComparison() {
    let left = { type: 'Identifier', name: tokens[i++] };
    let operator = tokens[i++];
    let right;

    if (tokens[i].startsWith("'")) {
      right = { type: 'Literal', value: tokens[i++].replace(/'/g, '') }; // Handle strings
    } else if (!isNaN(tokens[i])) {
      right = { type: 'Literal', value: parseFloat(tokens[i++]) }; // Handle numbers
    }

    return { type: 'Comparison', operator, left, right };
  }

  return parseExpression();
}

// Evaluate AST
function evaluateAST(ast, input) {
  switch (ast.type) {
    case 'Comparison':
      return evaluateComparison(ast, input);
    case 'LogicalOperation':
      return evaluateLogicalOperation(ast, input);
    default:
      throw new Error(`Unknown AST node type: ${ast.type}`);
  }
}

function evaluateComparison(node, input) {
  const leftValue = input[node.left.name.trim()];
  const rightValue = node.right.value;

  switch (node.operator) {
    case '>':
      return leftValue > rightValue;
    case '<':
      return leftValue < rightValue;
    case '>=':
      return leftValue >= rightValue;
    case '<=':
      return leftValue <= rightValue;
    case '=':
     
      return leftValue == rightValue; 
    case '!=':
      return leftValue !== rightValue;
    default:
      throw new Error(`Unknown operator: ${node.operator}`);
  }
}


function evaluateLogicalOperation(node, input) {
  const leftResult = evaluateAST(node.left, input);
  const rightResult = evaluateAST(node.right, input);

  switch (node.operator) {
    case 'AND':
      return leftResult && rightResult;
    case 'OR':
      return leftResult || rightResult;
    default:
      throw new Error(`Unknown logical operator: ${node.operator}`);
  }
}

module.exports = {
  tokenize,
  parse,
  evaluateAST,
};
