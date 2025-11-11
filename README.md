# ConcertHub (frontend/backend layout)

## Avvio
### Backend
```
cd backend
cp .env.example .env
# inserisci la tua TICKETMASTER_API_KEY
npm install
npm run dev
```
### Frontend
```
cd ../frontend
npm install
npm run dev
```
Apri http://localhost:5173 (il backend ascolta su http://localhost:4000).

## Struttura
- `backend/` → Express proxy per Ticketmaster v2
- `frontend/` → React + Vite + Bootstrap
