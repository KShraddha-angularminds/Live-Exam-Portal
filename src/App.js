import './App.css';
import React from 'react';
import Main from './components/Main';
import Questions from './components/Questions';
import Subjects from './components/Subjects';
import Topics from './components/Topics';
import './components/Style.css';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import AddQuestions from './components/AddQuestions';
import EditQuestion from './components/EditQuestion';

function App() {

  return (
    <div className="App">
      <Router>
      <Main />
      <div className='main-nav-bar'>
      <Routes>
          < Route path='/questions' element={<Questions/>} />
          < Route path='/subjects' element={<Subjects />} />
          < Route path='/topics' element={<Topics />} />
          < Route path='/add_question' element={<AddQuestions />} />
          < Route path='/edit/:Qid' element={<EditQuestion />} />
        </Routes>
      </div>
      </Router>
    </div>
  );
}

export default App;
