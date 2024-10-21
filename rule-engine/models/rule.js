const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
//   name: {
//     type: String,
//     required: true, // Name of the rule (e.g., "Eligibility Rule 1")
//   },
  ruleString: {
    type: String,
    required: true, // The raw rulestring (e.g., "(age > 30 AND department = 'Sales') OR ...")
  },
  ast: {
    type: Schema.Types.Mixed, // Store AST as a nested JSON object
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically store creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically store update date
  },
});


const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
