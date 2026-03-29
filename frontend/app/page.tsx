'use client';

import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export default function Home() {
  const [name, setName] = useState('');
  const [jobId, setJobId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // 🔥 CREATE JOB
  const createUser = async () => {
    console.log("CLICKED");

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      console.log("RESPONSE DATA:", data);

      setJobId(data.jobId);
      setStatus('pending');
    } catch (err) {
      console.error("API ERROR:", err);
    }
  };

  // 🔥 AUTO POLLING
  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/users/job/${jobId}`);
        const data = await res.json();

        setStatus(data.status);

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("STATUS ERROR:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  // 🎨 STATUS COLOR
  const getStatusColor = () => {
    if (status === 'pending') return 'orange';
    if (status === 'completed') return 'green';
    if (status === 'failed') return 'red';
    return 'gray';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚀 Async Job Dashboard</h1>

      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button style={styles.button} onClick={createUser}>
          Create Job
        </button>

        {jobId && (
          <div style={styles.statusBox}>
            <p>Job ID: {jobId}</p>
            <p style={{ color: getStatusColor(), fontWeight: 'bold' }}>
              Status: {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles: any = {
  container: {
    height: '100vh',
    background: '#0f172a',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 40,
  },
  card: {
    background: '#1e293b',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    textAlign: 'center',
  },
  input: {
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 6,
    border: 'none',
  },
  button: {
    padding: 10,
    width: '100%',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  statusBox: {
    marginTop: 20,
  },
};