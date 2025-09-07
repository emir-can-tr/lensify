# Deployment Guide

## Environment Setup

### Frontend (Vercel/Netlify)

1. **Build Configuration**
   ```bash
   cd frontend
   npm run build
   ```

2. **Environment Variables**
   - `VITE_API_URL`: Production API URL (e.g., `https://your-api.herokuapp.com`)

3. **Vercel Deployment**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

4. **Netlify Deployment**
   - Connect GitHub repository
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`

### Backend (Heroku/Railway/DigitalOcean)

1. **Heroku Deployment**
   
   Create `Procfile` in backend directory:
   ```
   web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}
   ```
   
   Deploy:
   ```bash
   # Install Heroku CLI and login
   heroku create your-app-name
   
   # Set Python runtime (create runtime.txt)
   echo "python-3.11.5" > backend/runtime.txt
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

2. **Environment Variables for Production**
   - `CORS_ORIGINS`: Frontend URL (e.g., `https://your-app.vercel.app`)
   - `DATABASE_URL`: If using database
   - `SECRET_KEY`: For JWT tokens (if implemented)

3. **Railway Deployment**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Deploy
   railway login
   railway init
   railway up
   ```

### Docker Deployment

1. **Backend Dockerfile**
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   
   COPY . .
   
   EXPOSE 8000
   
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Frontend Dockerfile**
   ```dockerfile
   FROM node:18-alpine as build
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - CORS_ORIGINS=http://localhost:3000
     
     frontend:
       build: ./frontend
       ports:
         - "3000:80"
       depends_on:
         - backend
   ```

## Performance Optimization

### Backend
- Use Redis for caching processed images
- Implement rate limiting
- Add image compression/optimization
- Use cloud storage (AWS S3) for temporary files

### Frontend
- Enable gzip compression
- Implement lazy loading for effects
- Add service worker for caching
- Use CDN for static assets

## Security Considerations

1. **CORS Configuration**
   - Update `allow_origins` to include only production domains
   - Remove localhost origins in production

2. **File Upload Security**
   - Implement file type validation
   - Add file size limits
   - Scan for malicious content

3. **Rate Limiting**
   ```python
   from slowapi import Limiter, _rate_limit_exceeded_handler
   from slowapi.util import get_remote_address
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
   
   @app.post("/apply-effect")
   @limiter.limit("10/minute")  # 10 requests per minute
   async def apply_effect(request: Request, ...):
   ```

4. **Environment Variables**
   - Never commit sensitive data to Git
   - Use environment variables for all configuration
   - Implement proper secrets management

## Monitoring

1. **Health Check Endpoint**
   ```python
   @app.get("/health")
   async def health_check():
       return {"status": "healthy", "timestamp": datetime.utcnow()}
   ```

2. **Logging**
   ```python
   import logging
   
   logging.basicConfig(level=logging.INFO)
   logger = logging.getLogger(__name__)
   ```

3. **Error Tracking**
   - Implement Sentry for error tracking
   - Add request/response logging
   - Monitor API performance metrics

## SSL/HTTPS

- Enable HTTPS in production
- Use Let's Encrypt for free SSL certificates
- Update CORS origins to use HTTPS URLs
- Implement HTTP to HTTPS redirects
