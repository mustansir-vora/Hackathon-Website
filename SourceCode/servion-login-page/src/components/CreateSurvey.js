import React, { useState } from 'react';
import BackgroundAnimation from './BackgroundAnimation';
import '../styles/global.css';

const CreateSurvey = () => {
  const allLanguages = ["English", "German", "French", "Spanish", "Portuguese", "Italian", "Arabic", "Chinese", "Hindi", "Russian", "Dutch"];
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [defaultLanguage, setDefaultLanguage] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionTypeTouched, setQuestionTypeTouched] = useState(false);
  const fileInputRef = React.useRef(null);
  const [promptFileName, setPromptFileName] = useState('');
  const [ttsInput, setTtsInput] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionName: '',
      questionType: '',
      questionTypeTouched: false,
      promptFileName: '',
      ttsInput: '',
      fileInputRef: React.createRef(),
    }
  ]);
  const [deletingIndex, setDeletingIndex] = useState(null);

  // Modified deleteQuestion to trigger fade-out animation
  const deleteQuestion = (index) => {
    setDeletingIndex(index);
  };

  // Remove question after fade-out animation ends
  const handleAnimationEnd = (index) => {
    if (deletingIndex === index) {
      setQuestions(prevQuestions => prevQuestions.filter((_, i) => i !== index));
      setDeletingIndex(null);
    }
  };

  // Add new question with fade-in animation
  const addNewQuestion = () => {
    setQuestions(prevQuestions => [
      ...prevQuestions,
      {
        questionName: '',
        questionType: '',
        questionTypeTouched: false,
        promptFileName: '',
        ttsInput: '',
        fileInputRef: React.createRef(),
        isNew: true,
      }
    ]);
  };

  const toggleLanguage = (lang) => {
    if (selectedLanguages.includes(lang)) {
      const newSelected = selectedLanguages.filter(l => l !== lang);
      setSelectedLanguages(newSelected);
      if (defaultLanguage === lang) {
        setDefaultLanguage(newSelected.length > 0 ? newSelected[0] : '');
      }
    } else {
      const newSelected = [...selectedLanguages, lang];
      setSelectedLanguages(newSelected);
      if (!defaultLanguage) {
        setDefaultLanguage(lang);
      }
    }
  };

  const handleDefaultLanguageChange = (e) => {
    setDefaultLanguage(e.target.value);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    setQuestionTypeTouched(true);
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions(prevQuestions => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return updatedQuestions;
    });
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(10px);
          }
        }
      `}</style>
      <header id="create-survey-header" style={styles.header}>
        <div style={styles.backgroundAnimationWrapper}>
          <BackgroundAnimation containerId="create-survey-header" />
        </div>
        <span style={styles.headerTitle}>Manage Survey</span>
      </header>
      
      <div style={styles.content}>
        <div style={styles.mainContent}>
          <div style={styles.leftContainer}>
            <h2 style={styles.sectionTitle}>Survey Info</h2>
            <label style={styles.label}>Name</label>
            <input style={styles.input} type="text" placeholder="Survey Name" />
            
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} placeholder="Description" />

            <h2 style={styles.sectionTitle}>Survey Flow Builder</h2>
            <div style={{ marginTop: '20px' }}>
              {questions.map((question, index) => {
                const isDeleting = deletingIndex === index;
                const isNew = question.isNew;
                return (
                  <div
                    key={index}
                    id={`question-${index + 1}-container`}
                    style={{
                      ...styles.questionContainer,
                      animation: isDeleting
                        ? 'fadeOut 0.5s forwards'
                        : isNew
                        ? 'fadeIn 0.5s'
                        : 'none',
                    }}
                    onAnimationEnd={() => isDeleting && handleAnimationEnd(index)}
                  >
                    {/* <BackgroundAnimation containerId={`question-${index + 1}-container`} /> */}
                    <div style={styles.questionCard}>
                      <h3 style={styles.cardTitle}>Question #{index + 1}</h3>
                      <button
                        type="button"
                        style={styles.deleteQuestionButton}
                        onClick={() => deleteQuestion(index)}
                        title="Delete question"
                        aria-label="Delete question"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      <div style={styles.questionNameTypeContainer}>
                        <div style={styles.questionNameContainer}>
                          <label style={styles.label}>Question Name</label>
                          <input
                            style={styles.input}
                            type="text"
                            placeholder="Question Name"
                            value={question.questionName}
                            onChange={(e) => handleQuestionChange(index, 'questionName', e.target.value)}
                          />
                        </div>
                        <div style={styles.questionTypeContainer}>
                          <label style={styles.label}>Question Type</label>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <select
                              style={styles.select}
                              value={question.questionType}
                              onChange={(e) => {
                                handleQuestionChange(index, 'questionType', e.target.value);
                                handleQuestionChange(index, 'questionTypeTouched', true);
                              }}
                              onBlur={() => handleQuestionChange(index, 'questionTypeTouched', true)}
                            >
                              <option value="">Select Type</option>
                              <option value="CSAT">CSAT</option>
                              <option value="Yes or No">Yes or No</option>
                              <option value="Multiple Choice">Multiple Choice</option>
                              <option value="Numeric Range">Numeric Range</option>
                            </select>
                            {(question.questionTypeTouched && (!question.questionType || question.questionType === '')) && (
                              <span style={styles.errorIcon} title="Question Type is required">❗</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <label style={styles.label}>Prompt</label>
                      <div style={styles.fileUploadContainer}>
                        <input
                          type="file"
                          accept=".wav"
                          id={`promptFileInput-${index}`}
                          ref={question.fileInputRef}
                          style={styles.hiddenFileInput}
                          onChange={(e) => {
                            if (e.target.files.length > 0) {
                              handleQuestionChange(index, 'promptFileName', e.target.files[0].name);
                            } else {
                              handleQuestionChange(index, 'promptFileName', '');
                            }
                          }}
                        />
                        <button
                          type="button"
                          style={styles.uploadButton}
                          onClick={() => question.fileInputRef.current && question.fileInputRef.current.click()}
                        >
                          Upload .wav File
                        </button>
                        <span style={styles.fileName}>{question.promptFileName || 'No file chosen'}</span>
                        {question.promptFileName && (
                          <button
                            type="button"
                            style={styles.deleteButton}
                            onClick={() => {
                              handleQuestionChange(index, 'promptFileName', '');
                              if (question.fileInputRef.current) {
                                question.fileInputRef.current.value = null;
                              }
                            }}
                            title="Delete uploaded file"
                          >
                            ✖
                          </button>
                        )}
                      </div>

                      <label style={styles.label}>TTS Input</label>
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="Enter TTS text for the prompt"
                        value={question.ttsInput}
                        onChange={(e) => handleQuestionChange(index, 'ttsInput', e.target.value)}
                      />

                    </div>
                  </div>
                );
              })}
              <div style={styles.emptySurveyFlowBuilder}>
                <button
                  style={styles.addQuestionIconButton}
                  onClick={addNewQuestion}
                  aria-label="Add question"
                  title="Add question"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div style={styles.rightContainer}>
            <label style={styles.label}>Language</label>
            <select style={styles.select} value={defaultLanguage} onChange={handleDefaultLanguageChange}>
              {allLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={styles.actionButtons}>
          <button style={styles.cancelButton}>Cancel</button>
          <button style={styles.saveButton}>Save</button>
          <button style={styles.publishButton}>Publish</button>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    margin: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: '#f7f7f7',
  },
  backgroundAnimationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '80px',
    width: '100%',
    overflow: 'hidden',
    zIndex: 0,
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '80px',
    width: '100%',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    overflow: 'hidden',
    zIndex: 10,
    backgroundColor: '#222222cc', /* slightly darker semi-transparent background */
  },
  content: {
    marginTop: '0px', /* removed offset for fixed header height */
    backgroundColor: '#f7f7f7',
    padding: '0px',
    borderRadius: '0px',
    position: 'relative',
    zIndex: 5,
    minHeight: '400px',
  },
  mainContent: {
    display: 'flex',
    gap: '50px',
    position: 'relative',
    zIndex: 5,
  },
  emptySurveyFlowBuilder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70px',
    border: '2px dashed #007bff',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  addQuestionIconButton: {
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  header: {
    position: 'relative',
    height: '80px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    overflow: 'hidden',
    zIndex: 10,
  },
  content: {
    marginTop: '20px',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    zIndex: 5,
    minHeight: '400px',
  },
  mainContent: {
    display: 'flex',
    gap: '50px',
    position: 'relative',
    zIndex: 5,
  },
  headerTitle: {
    position: 'relative',
    zIndex: 1,
    fontSize: '32px'
  },
  content: {
    marginTop: '20px',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    borderRadius: '8px',
  },
  surveyInfo: {
    marginBottom: '20px',
  },
  mainContent: {
    display: 'flex',
    gap: '50px',
  },
  leftContainer: {
    width: '65%',
    boxSizing: 'border-box',
    backgroundColor: '#f7f7f7',
  },
  rightContainer: {
    width: '35%',
    boxSizing: 'border-box',
    marginTop: '40px',
    backgroundColor: '#f7f7f7',
  },
  sectionTitle: {
    fontSize: '24px',
    margin: '10px 0',
  },
  subSectionTitle: {
    fontSize: '20px',
    margin: '10px 0',
  },
  label: {
    display: 'block',
    margin: '10px 0 5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    minHeight: '100px'
  },
  languages: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '10px',
  },
  languageOption: {
    backgroundColor: '#e0e0e0',
    borderRadius: '20px',
    padding: '5px 10px',
    margin: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  languageSelected: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  questionCard: {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    position: 'relative',
    width: '99%',
  },
  deleteQuestionButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    color: 'red',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    padding: '0',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  },
  publishButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  hiddenFileInput: {
    display: 'none',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'red',
    fontSize: '18px',
    cursor: 'pointer',
    marginLeft: '8px',
    userSelect: 'none',
  },
};

export default CreateSurvey;
