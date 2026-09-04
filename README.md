# IMY220Project
Repo for my 220 project 

This is the beginning of my IMY220 Project README

This project is called ZINE, a photo sharing app between creatives to show off their photography and different arts. 


Build backend, from the zine project root:
docker build -f backend/Dockerfile -t zine-backend .

Run backend:
docker run --name zine-backend-container  -p 3001:3001 zine-backend

Build frontend, from the zine project root:
docker build -f frontend/src/Dockerfile -t zine-frontend .

Run frontend:
docker run --name zine-frontend-container -p 5173:5173 zine-frontend

Open:
http://localhost:5173

Stop both containers:
docker stop zine-frontend-container zine-backend-container