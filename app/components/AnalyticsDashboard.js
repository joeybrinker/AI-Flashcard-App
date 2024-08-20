// components/AnalyticsDashboard.js
import React, { useEffect, useState } from 'react';

const AnalyticsDashboard = () => {
  const [studyData, setStudyData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('studyData')) || [];
    setStudyData(data);
    calculateStreak(data);
    generateRecommendations(data);
  }, []);

  const calculateStreak = (data) => {
    const today = new Date().toDateString();
    const lastStudyDate = data.length ? new Date(data[data.length - 1].date).toDateString() : '';
    
    if (today === lastStudyDate) {
      setStreak(streak + 1);
    } else if (new Date() - new Date(lastStudyDate) <= 86400000 * 2) {
      setStreak(streak + 1);
    } else {
      setStreak(1);
    }
  };

  const generateRecommendations = (data) => {
    const performance = {}; // Track performance by topic
    data.forEach(session => {
      session.answers.forEach(answer => {
        if (!performance[answer.topic]) performance[answer.topic] = { correct: 0, total: 0 };
        if (answer.correct) performance[answer.topic].correct++;
        performance[answer.topic].total++;
      });
    });

    const lowPerforming = Object.keys(performance).filter(topic => 
      performance[topic].correct / performance[topic].total < 0.75
    );
    
    setRecommendations(lowPerforming);
  };

  const totalCards = studyData.reduce((acc, session) => acc + session.totalAnswers, 0);
  const correctAnswers = studyData.reduce((acc, session) => acc + session.correctAnswers, 0);
  const accuracyRate = totalCards ? (correctAnswers / totalCards) * 100 : 0;
  const totalTime = studyData.reduce((acc, session) => acc + session.timeSpent, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Study Progress</h2>
      <p>Total Cards Reviewed: {totalCards}</p>
      <p>Accuracy Rate: {accuracyRate.toFixed(2)}%</p>
      <p>Total Time Studied: {(totalTime / 60).toFixed(2)} minutes</p>
      <p>Current Streak: {streak} days</p>

      {recommendations.length > 0 ? (
        <div>
          <h3>Recommendations</h3>
          <ul>
            {recommendations.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You are performing well in all areas!</p>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
