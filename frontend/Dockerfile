# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Kopiuj package files
COPY package*.json ./

# Instaluj zależności
RUN npm install

# Kopiuj resztę plików
COPY . .

# Expose port Vite
EXPOSE 5173

# Uruchom Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
