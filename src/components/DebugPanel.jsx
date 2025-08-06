import { useState } from 'react';

export default function DebugPanel({ tasks, users, currentUser, onCreateTestTask }) {
  const [showDebug, setShowDebug] = useState(false);

  const createTestTask = () => {
    const testTask = {
      title: `Test Task ${Date.now()}`,
      description: 'This is a test task created from debug panel',
      priority: 'medium',
      complexity: 'normal',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'general',
      tags: []
    };
    
    console.log('Creating test task:', testTask);
    onCreateTestTask(testTask);
  };

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="btn btn-sm btn-accent"
        >
          🐛 Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-96 overflow-y-auto bg-base-200 rounded-lg shadow-xl p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Debug Panel</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="btn btn-sm btn-ghost"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm">Current State:</h4>
          <div className="text-xs space-y-1">
            <div>Tasks: {tasks.length}</div>
            <div>Users: {users.length}</div>
            <div>Current User: {currentUser ? currentUser.name : 'None'}</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm">Actions:</h4>
          <div className="space-y-2">
            <button
              onClick={createTestTask}
              className="btn btn-xs btn-primary btn-block"
            >
              Create Test Task
            </button>
            
            <button
              onClick={() => {
                console.log('Current tasks:', tasks);
                console.log('Current users:', users);
                console.log('Current user:', currentUser);
                console.log('localStorage tasks:', JSON.parse(localStorage.getItem('taskManager_tasks') || '[]'));
              }}
              className="btn btn-xs btn-secondary btn-block"
            >
              Log Current State
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="btn btn-xs btn-warning btn-block"
            >
              Clear & Reload
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm">Recent Tasks:</h4>
          <div className="text-xs max-h-32 overflow-y-auto">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="border-b py-1">
                <div className="font-medium">{task.title}</div>
                <div className="text-gray-500">ID: {task.id}</div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-gray-500 italic">No tasks found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 