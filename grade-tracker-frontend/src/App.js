import React, { useState, useEffect } from 'react';
import './App.css';
import SetupWizard from './SetupWizard';
import GradeEntry from './GradeEntry';
import Settings from './Settings';

function App() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('grades'); // 'grades' or 'settings'
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/course/current`);
      if (response.ok) {
        const data = await response.json();
        setCourseData(data);
      } else {
        setCourseData(null);
      }
    } catch (error) {
      console.error("Error loading course:", error);
      setCourseData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = () => {
    loadCourse();
  };

  const handleGradeUpdate = () => {
    loadCourse();
  };

  const handleCourseUpdate = () => {
    loadCourse();
  };

  const handleCourseArchived = () => {
    setCourseData(null);
    setCurrentView('grades');
  };

  if (loading) {
    return (
      <div className="App loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  // If no course exists, show setup wizard
  if (!courseData) {
    return (
      <div className="App">
        <SetupWizard onComplete={handleSetupComplete} />
      </div>
    );
  }

  // Course exists - show main app with navigation
  return (
    <div className="App">
      <nav className="app-nav">
        <div className="nav-left">
          <h1 className="nav-title">Grade Tracker</h1>
        </div>
        <div className="nav-right">
          <button
            className={`nav-btn ${currentView === 'grades' ? 'active' : ''}`}
            onClick={() => setCurrentView('grades')}
          >
            📊 Grades
          </button>
          <button
            className={`nav-btn ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
          >
            ⚙️ Settings
          </button>
        </div>
      </nav>

      <div className="app-content">
        {currentView === 'grades' && (
          <GradeEntry courseData={courseData} onGradeUpdate={handleGradeUpdate} />
        )}
        {currentView === 'settings' && (
          <Settings
            courseData={courseData}
            onCourseUpdate={handleCourseUpdate}
            onCourseArchived={handleCourseArchived}
          />
        )}
      </div>
    </div>
  );
}

export default App;