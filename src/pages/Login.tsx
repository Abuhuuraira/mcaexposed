import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);

    if (await login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
      setPassword('');
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`${styles.loginShell} ${isSubmitting ? styles.shellSubmitting : ''}`}>
        <div className={styles.loginBox}>
          <span className={styles.badge}>Admin Access</span>
          <h1 className={styles.title}>MCA Expose Admin</h1>
          <p className={styles.subtitle}>Sign in to manage your dashboard posts.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles.input}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              type="submit"
              className={`${styles.button} ${isSubmitting ? styles.buttonSubmitting : ''}`}
              disabled={isSubmitting}
              aria-live="polite"
            >
              <span className={styles.buttonLabel}>
                {isSubmitting ? 'Checking...' : 'Login to Dashboard'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
