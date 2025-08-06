// Simple API service with localStorage fallback
const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  constructor() {
    this.useBackend = false; // Will check if backend is available
    this.checkBackend();
  }

  async checkBackend() {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      this.useBackend = response.ok;
      console.log('Backend available:', this.useBackend);
    } catch (error) {
      this.useBackend = false;
      console.log('Backend not available, using localStorage');
    }
  }

  // Tasks API
  async getTasks() {
    if (this.useBackend) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        return await response.json();
      } catch (error) {
        console.error('Backend error, falling back to localStorage:', error);
        this.useBackend = false;
      }
    }
    
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
  }

  async createTask(task) {
    if (this.useBackend) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });
        return await response.json();
      } catch (error) {
        console.error('Backend error, falling back to localStorage:', error);
        this.useBackend = false;
      }
    }

    // Fallback to localStorage
    const tasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
    tasks.unshift(task);
    localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
    return task;
  }

  async updateTask(id, updates) {
    if (this.useBackend) {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });
        return await response.json();
      } catch (error) {
        console.error('Backend error, falling back to localStorage:', error);
        this.useBackend = false;
      }
    }

    // Fallback to localStorage
    const tasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
      localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
      return tasks[taskIndex];
    }
    return null;
  }

  async deleteTask(id) {
    if (this.useBackend) {
      try {
        await fetch(`${API_BASE_URL}/tasks/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        console.error('Backend error, falling back to localStorage:', error);
        this.useBackend = false;
      }
    }

    // Fallback to localStorage
    const tasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('taskManager_tasks', JSON.stringify(filteredTasks));
    return true;
  }

  // Users API
  async getUsers() {
    if (this.useBackend) {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        return await response.json();
      } catch (error) {
        console.error('Backend error, falling back to localStorage:', error);
        this.useBackend = false;
      }
    }
    
    return JSON.parse(localStorage.getItem('taskManager_users') || '[]');
  }

  async createUser(user) {
    if (this.useBackend) {
      try {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        return await response.json();
      } catch (error) {
        console.error('Backend error, falling back to localStorage:', error);
        this.useBackend = false;
      }
    }

    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
    users.push(user);
    localStorage.setItem('taskManager_users', JSON.stringify(users));
    return user;
  }

  async updateUser(id, updates) {
    if (this.useBackend) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });
        return await response.json();
      } catch (error) {
        console.error('Backend error, falling back to localStorage:', error);
        this.useBackend = false;
      }
    }

    // Fallback to localStorage
    const users = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('taskManager_users', JSON.stringify(users));
      return users[userIndex];
    }
    return null;
  }
}

export const apiService = new ApiService(); 