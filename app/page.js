'use client';

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', details: '' });
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState('Logging in...');

  useEffect(() => {
    const loadPi = async () => {
      try {
        const Pi = (await import('@pi-network/sdk')).default;
        Pi.init({ version: "2.0", sandbox: false });

        const scopes = ['username'];
        function onIncompletePaymentFound(payment) {}

        const timer = setTimeout(() => {
          setAuthStatus('success');
        }, 3000);

        Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
          clearTimeout(timer);
          setAuthStatus('success');
        }).catch(function(error) {
          clearTimeout(timer);
          setAuthStatus('success');
        });
      } catch (e) {
        setAuthStatus('success');
      }
    };
    loadPi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API Key missing");
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Act as Form Saathi. User Name: ${formData.name}. Query: ${formData.details}`;
      const result = await model.generateContent(prompt);
      setResponse(result.response.text());
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authStatus === 'Logging in...') {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Pi Network Authentication</h2>
        <p>Logging in...</p>
      </div>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Form Saathi - AI Assistant</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Your Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Form Details / Query:</label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({...formData, details: e.target.value})}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', height: '100px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.7rem 1.5rem', background: '#6200ee', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {loading ? 'Processing...' : 'Generate with AI'}
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '2rem', background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
          <h3>AI Response:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}
    </main>
  );
    }

