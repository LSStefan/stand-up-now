import React, { useState } from 'react';

// URL-ul backend-ului tau Python (de exemplu, o aplicație Flask)
const API_URL = 'http://localhost:8000/api/login'; 

function Login() {
  // 1. Starea componentelor: gestioneaza datele introduse de utilizator si mesajele
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Functia de gestionare a trimiterii formularului (Login)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Opreste reincarcarea paginii
    setMessage('');
    setIsLoading(true);

    try {
      // Trimite cererea POST catre API-ul Python
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Trimite datele sub forma de JSON
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Autentificare reusita
        setMessage(`Autentificare reușită! Bine ai venit, ${data.username}!`);
        // Aici ar trebui sa salvezi token-ul de autentificare in localStorage/cookies si sa redirectionezi
        console.log("Token:", data.token); 
      } else {
        // Autentificare esuata (ex: 401 Unauthorized)
        setMessage(`Eroare la login: ${data.message || 'Credențiale invalide.'}`);
      }
    } catch (error) {
      // Eroare de retea sau server indisponibil
      setMessage('Eroare de rețea. Serverul nu răspunde.');
      console.error('Eroare rețea:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Randarea formularului
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nume utilizator:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div>
          <label>Parolă:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px 15px', marginTop: '10px', backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none' }}
        >
          {isLoading ? 'Se autentifică...' : 'Login'}
        </button>
      </form>
      {/* Mesajul de eroare sau succes */}
      {message && <p style={{ marginTop: '10px', color: message.startsWith('Eroare') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}

export default Login;