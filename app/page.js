'use client';

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', details: '' });
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPi = async () => {
      try {
        const Pi = (await import('@pi-network/sdk')).default;
        Pi.init({ version: "2.0", sandbox: false });
        Pi.authenticate(['username'], function() {}).catch(function(error) {
          console.error(error);
        });
      } catch (e) {
        console.error("Pi SDK Error", e);
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
      if (!apiKey) {
        throw new Error("Gemini API Key missing in environment variables.");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Act as Form Saathi, an intelligent assistant. User Name: ${formData.name}. Details: ${formData.details}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>Form Saathi - AI Assistant</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label>Your Name:</label><br />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            required
          />
        </div>
        <div>
          <label>Form Details / Query:</label><br />
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', height: '100px' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.75rem', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Processing...' : 'Generate with AI'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#F3F4F6', borderRadius: '4px' }}>
          <h3>AI Response:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}
    </main>
  )
              

