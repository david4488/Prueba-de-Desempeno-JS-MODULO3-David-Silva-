const urlEventos = "http://localhost:3000/eventos";

// Show all events
export async function mostrarEventosAdmin() {
  const zona = document.getElementById("zona-eventos");
  const res = await fetch(urlEventos);
  const eventos = await res.json();

  zona.innerHTML = `
    <h3>Eventos creados</h3>
    <ul id="lista-eventos"></ul>
    <h3>Crear nuevo evento</h3>
    <form id="form-crear">
      <input type="text" id="nombre" placeholder="Nombre del evento" required />
      <input type="text" id="lugar" placeholder="Lugar" required />
      <input type="number" id="capacidad" placeholder="Capacidad" required />
      <button type="submit">Crear</button>
    </form>
  `;

  const lista = document.getElementById("lista-eventos");
  eventos.forEach(evento => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${evento.nombre} - ${evento.lugar} (Capacidad: ${evento.capacidad})
      <button onclick="editarEvento(${evento.id})">Editar</button>
      <button onclick="eliminarEvento(${evento.id})">Eliminar</button>
    `;
    lista.appendChild(li);
  });

  // Create event
  document.getElementById("form-crear").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nuevoEvento = {
      nombre: document.getElementById("nombre").value,
      lugar: document.getElementById("lugar").value,
      capacidad: document.getElementById("capacidad").value,
      registrados: []
    };
    await fetch(urlEventos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoEvento)
    });
    mostrarEventosAdmin(); // recharge
  });
}

// Delete event
window.eliminarEvento = async function (id) {
  await fetch(`${urlEventos}/${id}`, { method: "DELETE" });
  mostrarEventosAdmin(); // recharge
};

// Edit event
window.editarEvento = async function (id) {
  const evento = await (await fetch(`${urlEventos}/${id}`)).json();

  const zona = document.getElementById("zona-eventos");
  zona.innerHTML = `
    <h3>Editar Evento</h3>
    <form id="form-editar">
      <input type="text" id="nombre" value="${evento.nombre}" />
      <input type="text" id="lugar" value="${evento.lugar}" />
      <input type="number" id="capacidad" value="${evento.capacidad}" />
      <button type="submit">Guardar</button>
    </form>
  `;

  document.getElementById("form-editar").addEventListener("submit", async e => {
    e.preventDefault();
    const actualizado = {
      nombre: document.getElementById("nombre").value,
      lugar: document.getElementById("lugar").value,
      capacidad: document.getElementById("capacidad").value
    };
    await fetch(`${urlEventos}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizado)
    });
    mostrarEventosAdmin(); // recharge
  }); 
};
