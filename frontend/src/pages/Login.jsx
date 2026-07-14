import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import apiClient from '../api/client'

function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await apiClient.post('/login', { username_or_email: usernameOrEmail, password })
      localStorage.setItem('token', response.data.access_token)
      navigate('/tasks')
    } catch (err) {
      setError(err.response.data.detail)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-neutral-500 text-sm mb-6">Log in to see your tasks</p>

          {error && (
            <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username or email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg text-sm font-medium transition"
          >
            Log in
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login