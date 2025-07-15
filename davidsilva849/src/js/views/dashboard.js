import { logout, getUserSession } from '../auth.js';

export async function dashboardView() {
  const user = getUserSession();

  // Getting events from the database
  const res = await fetch('http://localhost:3000/events');
  const events = await res.json();

  let contentHTML = '';
  let createForm = '';
  let footer =` <footer><p>Todos los derechos reservados, David Silva  2025</p></footer>`;
  

  // If ADMIN, show editable form and list
  if (user.role === 'admin') {
    createForm = `
      <h3>Crear nuevo evento</h3>
      <form id="create-event-form">
        <input type="text" id="title" placeholder="Título del evento" required />
        <input type="text" id="lugar" placeholder="Lugar" required />
        <input type="date" id="date" required />
        <input type="number" id="capacity" placeholder="Capacidad" min="1" required />
        <button type="submit">Guardar evento</button>
      </form>
      <hr/>
    `;

    contentHTML = `
      <h3>Mis eventos</h3>
      <ul>
        ${events.map(event => `
          <li>
            <strong>${event.title}</strong> <br/>
            Lugar: <strong>${event.lugar}</strong> 
            Fecha: ${event.date}<br/>
            Capacidad: ${event.capacity}<br/>
            Inscritos: ${event.registeredUsers?.length || 0}<br/>
            Cupos Disponibles: ${event.capacity - event.registeredUsers?.length}
            <ul>
              ${event.registeredUsers?.map(u => `<li>${u}</li>`).join('') || '<li>Ninguno</li>'}
            </ul>
            <button class="edit-btn" data-id="${event.id}">Editar</button>
            <button class="delete-btn" data-id="${event.id}">Eliminar</button>
            <hr/>
          </li>
        `).join('')}
      </ul>
      
    `;
  } else {
    // If VISITOR, show events available for registration
    contentHTML = `
      <h3>Eventos disponibles</h3>
      <ul>
        ${events.map(event => {

          const cuposDispo = event.capacity- event.registeredUsers?.length;   //`${event.registeredUsers?.length - event.capacity}`
          const yaInscrito = event.registeredUsers?.includes(user.username);
          const lleno = (cuposDispo == 0) >= event.capacity;

          return `
            <li>
              <strong>${event.title}</strong> <br/>
              lugar: <strong>${event.lugar}</strong><br/>
              Fecha: ${event.date}<br/>
                
              Capacidad: ${event.capacity}<br/> 
              Inscritos: ${event.registeredUsers?.length || 0}<br/>
              Cupos Disponibles: ${cuposDispo}
              ${
                yaInscrito
                  ? `<em>Ya estás inscrito </em>  <button class="decliner-btn" data-id="${event.id}">Declinar</button>`
                  : lleno
                  ? '<em>Evento lleno </em>'
                  : `<button class="register-btn" data-id="${event.id}">Inscribirme</button>`
                  
                  
              }
              <hr/>
            </li>
          `;
        }).join('')}
      </ul>
      `;
  }


  // Render the view
  document.getElementById('content').innerHTML = `
    <h2>Bienvenido, ${user.username}</h2>
    <p>Rol: ${user.role}</p>
    <button id="logout-btn">Cerrar sesión</button>
    ${createForm}
    ${contentHTML}
    <div id="edit-section"></div>
  `;

  //Logout button
  document.getElementById('logout-btn').addEventListener('click', logout);

  // Create event (admin)
  const form = document.getElementById('create-event-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const newEvent = {
        title: form.title.value,
        date: form.date.value,
        capacity: parseInt(form.capacity.value),
        lugar: form.lugar.value,
        registeredUsers: []
      };

      const res = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });

      if (res.ok) {
        alert('Evento creado correctamente');
        dashboardView();
      } else {
        alert('Error al crear evento');
      }
    });
  }
  // Decline registration (visitor)
document.querySelectorAll('.decliner-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const confirmar = confirm('¿Desea declinar este evento?');
    if (!confirmar) return;

    const eventId = btn.getAttribute('data-id');

    // Get current event
    const res = await fetch(`http://localhost:3000/events/${eventId}`);
    const event = await res.json();

    // Filter the current user
    event.registeredUsers = event.registeredUsers.filter(u => u !== user.username);

    // Guardar cambios
    await fetch(`http://localhost:3000/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });

    alert('Te has retirado del evento.');
    dashboardView(); // reload view
  });
});
//--------------------------------------------------------------------------------------------
  //Register for event (visitor)
  document.querySelectorAll('.register-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const eventId = btn.getAttribute('data-id');
      const res = await fetch(`http://localhost:3000/events/${eventId}`);
      const event = await res.json();

      if (!event.registeredUsers) event.registeredUsers = [];

      if (event.registeredUsers.includes(user.username)) {
        alert('Ya estás inscrito');
        return;
      }

      if (event.registeredUsers.length >= event.capacity) {
        alert('Evento lleno');
        return;
      }

      event.registeredUsers.push(user.username);

      await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      alert('Inscripción exitosa');
      dashboardView();
    });
  });
//---------------------------------------------------------------------------------------------------
  // Delete event (admin)
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const confirmar = confirm('¿Eliminar este evento?');
      if (!confirmar) return;

      await fetch(`http://localhost:3000/events/${id}`, {
        method: 'DELETE'
      });

      alert('Evento eliminado');
      dashboardView();
    });
  });

  // Editar evento (admin)
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const eventId = btn.getAttribute('data-id');
      const res = await fetch(`http://localhost:3000/events/${eventId}`);
      const event = await res.json();

      document.getElementById('edit-section').innerHTML = `
        <h3>Editar evento: ${event.title}</h3>
        <form id="edit-event-form">
          <input type="text" id="edit-title" value="${event.title}" required />
          <input type="date" id="edit-date" value="${event.date}" required />
          <input type="text" id="edit-lugar" value="${event.lugar}" required />
          <input type="number" id="edit-capacity" value="${event.capacity}" min="1" required />
          <button type="submit">Guardar cambios</button>
          <button type="button" id="cancel-edit">Cancelar</button>
        </form>
      `;

      // Save changes
      document.getElementById('edit-event-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedEvent = {
          ...event,
          title: document.getElementById('edit-title').value,
          date: document.getElementById('edit-date').value,
          lugar: document.getElementById("edit-lugar").value,
          capacity: parseInt(document.getElementById('edit-capacity').value)
        };

        const res = await fetch(`http://localhost:3000/events/${eventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedEvent)
        });

        if (res.ok) {
          alert('Evento actualizado');
          dashboardView();
        } else {
          alert('Error al actualizar');
        }
      });

      // Cancel edit
      document.getElementById('cancel-edit').addEventListener('click', () => {
        document.getElementById('edit-section').innerHTML = '';
      });
    });
  });
}
