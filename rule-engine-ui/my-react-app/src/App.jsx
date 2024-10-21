// src/App.js
import React from 'react';
import RuleForm from './components/RuleForm';
import { SnackbarProvider } from 'notistack';


const App = () => {
  return (
    <div>
       <SnackbarProvider maxSnack={3}>
            <RuleForm />
        </SnackbarProvider>
      
    </div>
  );
};

export default App;
