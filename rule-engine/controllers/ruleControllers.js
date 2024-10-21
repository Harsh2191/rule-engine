const { evaluateAST, parse, tokenize } = require('../utils/ast');
const Rule = require('../models/rule');

// Create Rule API Handler
exports.createRule = async (req, res) => {
    const { ruleString } = req.body;

    if (!ruleString) {
        return res.status(400).json({ error: 'Rule string is required' });
    }

    try {
        // Tokenize and parse the rule string
        let tokens = tokenize(ruleString);

        if (tokens.length === 0) {
            return res.status(400).json({ error: 'Invalid rule string: Missing or incorrect syntax' });
        }

        let aststr = parse(tokens);
        let ast = JSON.stringify(aststr, null, 2);

        // Save the rule to the database
        const newRule = new Rule({ ruleString, ast });
        const savedRule = await newRule.save();

        res.json(savedRule);
    } catch (err) {
        console.error('Error in createRule:', err.message);
        res.status(500).json({ error: 'Error creating rule' });
    }
};

// Evaluate Rule API Handler
exports.evaluateRule = async (req, res) => {
    const { ruleIds, userData, combineOperator } = req.body;

    // Validate user data
    if (!userData || !userData.age || !userData.salary || !userData.department || !userData.experience) {
        return res.status(400).json({ error: 'Incomplete user data. Please provide age, salary, department, and experience.' });
    }

    if (!Array.isArray(ruleIds) || ruleIds.length === 0) {
        return res.status(400).json({ error: 'Please select at least one rule to evaluate.' });
    }

    try {
        // Fetch the selected rules from the database
        const rules = await Rule.find({ _id: { $in: ruleIds } });

        if (rules.length === 0) {
            return res.status(404).json({ error: 'No rules found for the selected IDs.' });
        }

        // Combine rule strings
        const combinedRuleString = rules.map(rule => rule.ruleString).join(` ${combineOperator} `);
      

        // Tokenize and parse the combined rule string
        let tokens = tokenize(combinedRuleString);

        console.log(tokens);
        if (tokens.length === 0) {
            return res.status(400).json({ error: 'Invalid combined rule string: Missing or incorrect syntax' });
        }

        let ast = parse(tokens);
        console.log(ast);

        console.log(JSON.stringify(ast));


        // Evaluate the combined AST against user data
        const result = evaluateAST(ast, userData);

        res.json({ eligible: result });
    } catch (err) {
        console.error('Error evaluating rules:', err.message);
        res.status(500).json({ error: 'Error evaluating rules' });
    }
};
exports.getRule = async (req, res) => {
  try {
      const rules = await Rule.find({});
      res.json(rules);
  } catch (error) {
      console.error('Error fetching rules:', error.message);
      res.status(500).json({ error: 'Failed to fetch rules. Please try again later.' });
  }
};

    exports.updateRule =( async (req, res) => {
    const { ruleString } = req.body;
    const { id } = req.params;

    try {
        const updatedRule = await Rule.findByIdAndUpdate(id, { ruleString }, { new: true });
        res.json(updatedRule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update rule' });
    }
});

exports.deleteRule=( async (req, res) => {
    const { id } = req.params;

    try {
        await Rule.findByIdAndDelete(id);
        res.sendStatus(204); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete rule' });
    }
});



