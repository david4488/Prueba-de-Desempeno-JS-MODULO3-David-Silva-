export function registerView() { // function de registro 
    document.getElementById('content').innerHTML = ` 
      <h2>Registro de usuario</h2>            
      <form id="register-form">
        <input type="text" id="username" placeholder="Usuario" required />
        <input type="password" id="password" placeholder="Contraseña" required />
        <input type="email" id="email" placeholder="Correo Electronico" required />

        
        <button type="submit">Registrarse</button>
      </form>
      <p>¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a></p>
       
    `;
  
    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const newUser = {
        username: e.target.username.value,
        password: e.target.password.value,
        useremail: e.target.email.value,
        role: "user"  // passes the value of the input
      };
                                                                   
      const res = await fetch('http://localhost:3000/users', { //we send to the database
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
  
      if (res.ok) {
        alert('Usuario registrado correctamente');
        window.location.hash = '/login';
      } else {
        alert('Error al registrar');
      }
    });
  }
  