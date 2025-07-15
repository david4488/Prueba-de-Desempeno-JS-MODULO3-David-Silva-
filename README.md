# Prueba-de-Desempeno-JS-MODULO3-David-Silva-

# SPA - Event Management

Single Page Application (SPA) developed with JavaScript, HTML, and CSS for event management. It includes user authentication, session persistence, roles (administrator and visitor), protected routes, and a simulated database with `json-server`.



-- Developed by :

- **Name:** David Silva
- **Clan:** [Ciénaga]
- **Email:** [orpi4488@gmail.com]
- **Document:** [1002155849]

---

-- Main Features

-- Authentication and Roles

- Registration and login with roles: `admin` and `visitor`
- Session persistence with `localStorage`
- Automatic redirection based on session or unauthorized access

-- Administrator

- Create, edit, and delete events
- View list of users registered for each event

-- Visitor

- View available events
- Register for events with available seats
- See if you are already registered

---

-- Project structure

/
├── index.html
├── public 
├── database.json
├── README.md
├── src
│ └── js
│ ├── main.js
│ ├── router.js
│ ├── auth.js
│ ├── events.js
│ └── views
│ ├── login.js
│ ├── register.js
│ └── dashboard.js 
├── css 
├── stryles.css

yaml
Copy
Edit

-----
-- Requirements

- Node.js
- json-server

---

- Installation and execution

1. Clone the repository

```bash
git clone https://github.com/david4488/Prueba-de-Desempeno-JS-MODULO3-David-Silva-.git
