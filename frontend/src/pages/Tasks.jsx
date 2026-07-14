import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import { useNavigate } from 'react-router-dom'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const fetchTasks = async () => {
    const response = await apiClient.get('/tasks')
    setTasks(response.data)
  }

  const handleToggle = async (taskId) => {
    await apiClient.patch(`/tasks/${taskId}/complete`)
    fetchTasks()
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleDelete = async (taskId) => {
    await apiClient.delete(`/tasks/${taskId}`)
    fetchTasks()
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    await apiClient.post('/tasks', { title: newTitle })
    setNewTitle('')
    fetchTasks()
  }

  const priorityColor = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <button onClick={handleLogout} className="text-sm text-neutral-400 hover:text-red-400">
            Log out
          </button>
        </div>

        <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="What needs to get done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-3 rounded-lg text-sm font-medium transition"
          >
            Add
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-10">
              No tasks yet — add one above to get started.
            </p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className={`group bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-center justify-between transition ${
                task.is_completed ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition ${
                    task.is_completed
                      ? 'bg-violet-500 border-violet-500'
                      : 'border-neutral-600 hover:border-violet-500'
                  }`}
                />
                <div>
                  <h2 className={`font-medium ${task.is_completed ? 'line-through text-neutral-500' : ''}`}>
                    {task.title}
                  </h2>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border ${priorityColor[task.priority] || priorityColor.medium}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="text-neutral-600 hover:text-red-400 text-sm opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tasks