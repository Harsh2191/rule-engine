import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import '../index.css';
import { baseUrl } from '../urls';

const RuleForm = () => {
    const [ruleString, setRuleString] = useState('');
    const [userData, setUserData] = useState({
        age: '',
        department: '',
        salary: '',
        experience: ''
    });
    const [result, setResult] = useState(null);
    const [rules, setRules] = useState([]);
    const [selectedRuleIds, setSelectedRuleIds] = useState([]);
    const [combineOperator, setCombineOperator] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [editMode, setEditMode] = useState(false);
    const [currentRuleId, setCurrentRuleId] = useState(null);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/rules/get_rule`);
                setRules(response.data);
            } catch (error) {
                enqueueSnackbar('Error fetching rules', { variant: 'error' });
            }
        };
        fetchRules();
    }, [enqueueSnackbar]);



    const validateRuleString = (rule) => {
        // Check if parentheses are balanced
        const parentheses = rule.split('').reduce((acc, char) => {
            if (char === '(') return acc + 1;
            if (char === ')') return acc - 1;
            return acc;
        }, 0);
    
        if (parentheses !== 0) {
            return 'Unbalanced parentheses';
        }
    
        // Ensure the rule has at least one comparison operator
        const comparisonRegex = /[><=]/;
        if (!comparisonRegex.test(rule)) {
            return 'No valid comparison operators found (>, <, =)';
        }
    
        // // Check for logical operators (AND, OR)
        // const logicalOperatorRegex = /\b(AND|OR)\b/;
        // if (!logicalOperatorRegex.test(rule)) {
        //     return 'No valid logical operators found (AND, OR)';
        // }
    
        // Optionally, check for known fields like 'age', 'department', etc.
        const validFields = ['age', 'department', 'salary', 'experience'];
        const fieldRegex = new RegExp(`\\b(${validFields.join('|')})\\b`, 'g');
        const usedFields = rule.match(fieldRegex);
        if (!usedFields || usedFields.length === 0) {
            return `No valid fields found. Valid fields are: ${validFields.join(', ')}`;
        }
    
        // Check for invalid operators or incomplete expressions
        const incompleteExpressionRegex = /\b(AND|OR)\s*$/;
        if (incompleteExpressionRegex.test(rule.trim())) {
            return 'Rule ends with an incomplete logical operator (AND, OR)';
        }
    
        // All validations passed
        return null;
    };


    const handleCreateOrUpdateRule = async () => {
        if (!ruleString.trim()) {
            enqueueSnackbar('Rule string cannot be empty', { variant: 'warning' });
            return;
        }

        // Validate the rule string
    const validationError = validateRuleString(ruleString);
    if (validationError) {
        enqueueSnackbar(`Invalid rule: ${validationError}`, { variant: 'error' });
        return;
    }

        try {
            if (editMode) {
                // Update existing rule
                const response = await axios.put(`${baseUrl}/api/rules/update_rule/${currentRuleId}`, { ruleString });
                enqueueSnackbar('Rule updated successfully', { variant: 'success' });
                setRules(rules.map(rule => (rule._id === currentRuleId ? response.data : rule)));
            } else {
                // Create new rule
                const response = await axios.post(`${baseUrl}/api/rules/create_rule`, { ruleString });
                enqueueSnackbar('Rule created successfully', { variant: 'success' });
                setRules(prevRules => [...prevRules, response.data]);
            }

            setRuleString('');
            setEditMode(false);
            setCurrentRuleId(null);
        } catch (error) {
            enqueueSnackbar('Error processing rule: ' + (error.response?.data?.error || error.message), { variant: 'error' });
        }
    };
//deleterule
    const handleDeleteRule = async (ruleId) => {
        try {
            await axios.delete(`${baseUrl}/api/rules/delete_rule/${ruleId}`);
            setRules(rules.filter(rule => rule._id !== ruleId));
            enqueueSnackbar('Rule deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Error deleting rule: ' + (error.response?.data?.error || error.message), { variant: 'error' });
        }
    };
//evaluaterule
    const handleEvaluateRule = async () => {
        if (selectedRuleIds.length === 0) {
            enqueueSnackbar('Please select rules to evaluate', { variant: 'warning' });
            return;
        }

        if (!userData.age || !userData.salary || !userData.experience || !userData.department) {
            enqueueSnackbar('Please fill all user details', { variant: 'warning' });
            return;
        }
        if (selectedRuleIds.length > 1 && !combineOperator) {
            enqueueSnackbar('Please select a combine operator (AND/OR) for multiple rules', { variant: 'warning' });
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/api/rules/evaluate_rule`, {
                ruleIds: selectedRuleIds,
                combineOperator,
                userData
            });

            setResult(response.data.eligible);
            enqueueSnackbar(`Rule evaluated: ${response.data.eligible ? 'Eligible' : 'Not Eligible'}`, { variant: 'info' });

            // setUserData({
            //     age: '',
            //     department: '',
            //     salary: '',
            //     experience: ''
            // });

        } catch (error) {
            enqueueSnackbar('Error evaluating rule: ' + (error.response?.data?.error || error.message), { variant: 'error' });
        }
    };

    const toggleRuleSelection = (ruleId) => {
        setSelectedRuleIds((prev) => {
            if (prev.includes(ruleId)) {
                return prev.filter(id => id !== ruleId); 
            } else {
                return [...prev, ruleId]; 
            }
        });
    };

    //handle  edit rule

    const handleEditRule = (rule) => {
        setRuleString(rule.ruleString);
        setEditMode(true);
        setCurrentRuleId(rule._id);
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-black rounded-xl text-center mb-6 bg-red-400  p-2">Rule Engine</h1>

            {/* Create or Edit Rule */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{editMode ? 'Edit Rule' : 'Create Rule'}</h2>
                <input
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    placeholder="Enter rule string"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleCreateOrUpdateRule}
                    className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                    {editMode ? 'Update Rule' : 'Create Rule'}
                </button>
            </div>

            {/* Select Rule to Evaluate */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Select Rules to Evaluate</h2>
                <div className="flex flex-col">
                    {rules.map(rule => (
                        <div key={rule._id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={selectedRuleIds.includes(rule._id)}
                                onChange={() => toggleRuleSelection(rule._id)}
                                className="mr-2"
                            />
                            <label
                                className={`cursor-pointer p-2 rounded-md ${selectedRuleIds.includes(rule._id) ? 'bg-green-200' : 'bg-white'} hover:bg-green-100`}
                                onClick={() => toggleRuleSelection(rule._id)}
                            >
                                {rule.ruleString}
                            </label>
                            <button
                                onClick={() => handleEditRule(rule)}
                                className="ml-2 text-blue-600 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteRule(rule._id)}
                                className="ml-2 text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Combine Rules With */}
                <h2 className="text-2xl font-semibold mb-2">Combine Rules With</h2>
                <div className="flex items-center mb-4">
                    <label className="mr-4">
                        <input
                            type="radio"
                            value="AND"
                            checked={combineOperator === 'AND'}
                            onChange={() => setCombineOperator('AND')}
                        />
                        AND
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="OR"
                            checked={combineOperator === 'OR'}
                            onChange={() => setCombineOperator('OR')}
                        />
                        OR
                    </label>
                </div>

                <button
                    onClick={handleEvaluateRule}
                    className="mt-3 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                >
                    Evaluate Rule
                </button>
            </div>

            {/* User Input for Evaluation */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">User Input for Evaluation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="age"
                        value={userData.age}
                        
                        onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                        placeholder="Age"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="department"
                        value={userData.department}
                        onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                        placeholder="Department"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="salary"
                        value={userData.salary}
                        onChange={(e) => setUserData({ ...userData, salary: e.target.value })}
                        placeholder="Salary"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        name="experience"
                        value={userData.experience}
                        onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
                        placeholder="Experience"
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Result Display */}
            {result !== null && (
                <div className={`mt-6 p-4 rounded-md ${result ? 'bg-green-100' : 'bg-red-100'}`}>
                    <h2 className="text-xl font-semibold">
                        Evaluation Result: {result ? 'Eligible' : 'Not Eligible'}
                    </h2>
                </div>
            )}
        </div>
    );
};

export default RuleForm;
