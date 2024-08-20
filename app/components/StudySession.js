import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const StudySession = ({ onSave, theme }) => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [notes, setNotes] = useState('');
  const [topics, setTopics] = useState('');

  // Define styles for light and dark modes
  const styles = {
    light: {
      backgroundColor: '#fff',
      color: '#000',
      inputBackgroundColor: '#f5f5f5',
      buttonColor: 'primary',
    },
    dark: {
      backgroundColor: '#333',
      color: '#fff',
      inputBackgroundColor: '#444',
      buttonColor: 'secondary',
    }
  };

  const currentStyle = styles[theme];

  const handleSave = () => {
    if (timeSpent < 0) {
      alert("Time spent cannot be negative.");
      return;
    }

    const session = {
      date: new Date(),
      correctAnswers,
      totalAnswers,
      timeSpent: timeSpent * 60,
      notes,
      topics,
      answers: [
        { topic: 'Math', correct: true },
        { topic: 'Science', correct: false },
      ]
    };

    onSave(session);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setTimeSpent(0);
    setNotes('');
    setTopics('');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: currentStyle.backgroundColor, color: currentStyle.color }}>
      <Typography variant="h4" gutterBottom>Start a New Study Session</Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Correct Answers"
          type="number"
          value={correctAnswers}
          onChange={(e) => setCorrectAnswers(Number(e.target.value))}
          fullWidth
          margin="normal"
          style={{ backgroundColor: currentStyle.inputBackgroundColor }}
          InputLabelProps={{ style: { color: currentStyle.color } }}
          InputProps={{ style: { color: currentStyle.color } }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Total Answers"
          type="number"
          value={totalAnswers}
          onChange={(e) => setTotalAnswers(Number(e.target.value))}
          fullWidth
          margin="normal"
          style={{ backgroundColor: currentStyle.inputBackgroundColor }}
          InputLabelProps={{ style: { color: currentStyle.color } }}
          InputProps={{ style: { color: currentStyle.color } }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Time Spent (minutes)"
          type="number"
          value={timeSpent}
          onChange={(e) => setTimeSpent(Number(e.target.value))}
          fullWidth
          margin="normal"
          style={{ backgroundColor: currentStyle.inputBackgroundColor }}
          InputLabelProps={{ style: { color: currentStyle.color } }}
          InputProps={{ style: { color: currentStyle.color } }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Topics Covered"
          type="text"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          fullWidth
          margin="normal"
          style={{ backgroundColor: currentStyle.inputBackgroundColor }}
          InputLabelProps={{ style: { color: currentStyle.color } }}
          InputProps={{ style: { color: currentStyle.color } }}
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Additional Notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          style={{ backgroundColor: currentStyle.inputBackgroundColor }}
          InputLabelProps={{ style: { color: currentStyle.color } }}
          InputProps={{ style: { color: currentStyle.color } }}
        />
      </Box>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color={currentStyle.buttonColor}
          sx={{ mt: 2, mb: 2 }}
          onClick={handleSave}
        >
          Save Session
        </Button>
      </Box>
    </div>
  );
};

export default StudySession;
