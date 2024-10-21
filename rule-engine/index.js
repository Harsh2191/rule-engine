const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ruleRoutes = require('./routes/ruleRoutes');
const cors = require('cors');
const dotenv = require('dotenv');  

const app = express();


dotenv.config();  

app.use(cors());

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.mongodb).then(()=> console.log('Database is connected'))
.catch((error)=>  console.log(error))
// Use routes
app.use('/api/rules', ruleRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
