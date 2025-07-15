    import { setUserSession } from '../auth.js';  
// login function
export function loginView() {
  document.getElementById('content').innerHTML = `
    <h2>Iniciar sesión</h2>
    <form id="login-form">
      <input type="text" id="username" placeholder="Usuario" required />
      <input type="password" id="password" placeholder="Contraseña" required />
      <button type="submit">Ingresar</button>
    </form>
    <p>¿No tienes cuenta? <a href="#/register">Regístrate aquí</a></p>
    
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const res = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
    const data = await res.json();

    if (data.length > 0) {
      setUserSession(data[0]);
      window.location.hash = '/dashboard';
    } else {
      alert('Credenciales incorrectas');
    }
  });
}
