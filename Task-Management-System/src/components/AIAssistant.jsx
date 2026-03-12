import React, { useState } from 'react';
import { generateDailyTips, generateTaskPriority, generateTaskSubtasks, getUsageStatus } from '../services/geminiService';
import { useTask } from '../contexts/TaskContext';

export default function AIAssistant({ tasks, columns }) {
  const { data, setData } = useTask();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tips'); // 'tips' or 'analyze'
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const loadTips = async () => {
    setLoading(true);
    setError('');
    try {
      const tipsText = await generateDailyTips(tasks);
      setTips(tipsText);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải lời khuyên');
    } finally {
      setLoading(false);
    }
  };

  const analyzeTask = async () => {
    if (!taskInput.trim()) return;
    
    setAnalyzing(true);
    setError('');
    setResult(null);
    
    try {
      // Sequential requests (not parallel) to respect rate limiting
      const priority = await generateTaskPriority(taskInput);
      const subtasks = await generateTaskSubtasks(taskInput);
      
      setResult({ priority, subtasks });
    } catch (err) {
      setError(err.message || 'Lỗi khi phân tích task');
    } finally {
      setAnalyzing(false);
    }
  };

  const createTaskFromAnalysis = () => {
    if (!result || !taskInput.trim()) return;

    try {
      // Generate unique ID
      const newTaskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create task object with AI analysis
      const newTask = {
        id: newTaskId,
        content: taskInput,
        description: `Priority: ${result.priority}`,
        priority: result.priority,
        dateAdded: new Date().toISOString(),
        dueDate: null,
        subtasks: result.subtasks.map((subtask, idx) => ({
          id: `subtask-${newTaskId}-${idx}`,
          text: subtask,
          done: false,
        })),
      };

      // Update task context
      const updatedData = {
        ...data,
        tasks: {
          ...data.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...data.columns,
          'col-1': {
            ...data.columns['col-1'],
            taskIds: [newTaskId, ...data.columns['col-1'].taskIds],
          },
        },
      };

      setData(updatedData);
      
      // Show success message
      setError('');
      setResult(null);
      setShowForm(false);
      setTaskInput('');
      alert('✅ Task created successfully!');
    } catch (err) {
      // setError('Lỗi khi tạo task: ' + err.message);
    }
  };

  const handleReset = () => {
    setTaskInput('');
    setResult(null);
    setError('');
  };

  const usage = getUsageStatus();

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'inherit' }}>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            color: 'white',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
          }}
        >
          ✨
        </button>
      )}

      {/* Widget panel */}
      {isOpen && (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          width: '350px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderBottom: 'none',
          }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>🤖 AI Assistant</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '500' }}>
                {usage.remaining === 0 ? '❌' : usage.remaining <= 5 ? '⚠️' : '✓'}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quota info */}
          <div style={{ padding: '8px 12px', background: 'var(--bg-primary)', fontSize: '11px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {usage.remaining === 0 ? '❌ Hết quota hôm nay' : `✓ Còn: ${usage.remaining}/${usage.limit}`}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, padding: '0', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
            <button
              onClick={() => { setActiveTab('tips'); handleReset(); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === 'tips' ? 'var(--bg-secondary)' : 'transparent',
                color: activeTab === 'tips' ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === 'tips' ? '600' : '500',
                borderBottom: activeTab === 'tips' ? '2px solid #667eea' : 'none',
              }}
            >
              📋 Tips
            </button>
            <button
              onClick={() => { setActiveTab('analyze'); handleReset(); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === 'analyze' ? 'var(--bg-secondary)' : 'transparent',
                color: activeTab === 'analyze' ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === 'analyze' ? '600' : '500',
                borderBottom: activeTab === 'analyze' ? '2px solid #764ba2' : 'none',
              }}
            >
              ➕ Analyze
            </button>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {/* Tips tab */}
            {activeTab === 'tips' && (
              <div>
                {!tips ? (
                  <button
                    onClick={loadTips}
                    disabled={loading || usage.remaining === 0}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: usage.remaining === 0 ? '#d1d5db' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: (loading || usage.remaining === 0) ? 'not-allowed' : 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      opacity: (loading || usage.remaining === 0) ? 0.7 : 1,
                    }}
                  >
                    {loading ? '⟳ Loading...' : 'Get Daily Tips'}
                  </button>
                ) : (
                  <>
                    <div style={{
                      padding: '10px',
                      background: 'var(--bg-primary)',
                      borderRadius: '6px',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      marginBottom: '10px',
                      borderLeft: '3px solid #667eea',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                    }}>
                      {tips}
                    </div>
                    <button
                      onClick={() => setTips('')}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Analyze tab */}
            {activeTab === 'analyze' && (
              <div>
                {!result ? (
                  <>
                    <textarea
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Describe your task..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '8px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontFamily: 'inherit',
                        fontSize: '12px',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        marginBottom: '8px',
                      }}
                    />
                    <button
                      onClick={analyzeTask}
                      disabled={analyzing || !taskInput.trim() || usage.remaining === 0}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: usage.remaining === 0 ? '#d1d5db' : '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (analyzing || !taskInput.trim() || usage.remaining === 0) ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        opacity: (analyzing || !taskInput.trim() || usage.remaining === 0) ? 0.7 : 1,
                      }}
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze'}
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ fontSize: '12px' }}>Priority:</strong>{' '}
                      <span style={{
                        marginLeft: '6px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: result.priority === 'high' ? '#fee2e2' : result.priority === 'medium' ? '#fef3c7' : '#dbeafe',
                        color: result.priority === 'high' ? '#991b1b' : result.priority === 'medium' ? '#92400e' : '#1e40af',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}>
                        {result.priority === 'high' ? '🔴 High' : result.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                      </span>
                    </div>

                    {result.subtasks.length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        <strong style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Subtasks:</strong>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: '1.4' }}>
                          {result.subtasks.slice(0, 3).map((subtask, idx) => (
                            <li key={idx} style={{ marginBottom: '4px', color: 'var(--text-secondary)' }}>{subtask}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={createTaskFromAnalysis}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                        }}
                      >
                        ✅ Create
                      </button>
                      <button
                        onClick={() => { setResult(null); setTaskInput(''); }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Back
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {error && (
              <div style={{
                marginTop: '8px',
                padding: '8px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '4px',
                color: '#991b1b',
                fontSize: '11px',
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
