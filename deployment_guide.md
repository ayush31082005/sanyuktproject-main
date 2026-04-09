# Deployment Guide

Follow these steps to deploy your application.

## 1. Backend Deployment (Render)

1.  **Repository**: Push your code to a GitHub repository.
2.  **Create Web Service**: In Render, create a new Web Service and connect your repository.
3.  **Root Directory**: Set this to `server`.
4.  **Runtime**: Node.
5.  **Build Command**: `npm install`
6.  **Start Command**: `node server.js`
7.  **Environment Variables**: Add the following in the Render dashboard:
    - `MONGO_URI`: (Your MongoDB connection string)
    - `JWT_SECRET`: (Your secret key)
    - `EMAIL_USER`: `sanyuktparivar3@gmail.com`
    - `EMAIL_PASS`: `ocuvbwkkdpftlbzc`
    - `RAZORPAY_KEY_ID`: (Your Razorpay Key ID)
    - `RAZORPAY_KEY_SECRET`: (Your Razorpay Secret)
    - `NODE_ENV`: `production`

## 2. Frontend Deployment (Hostinger)

1.  **Configure API URL**:
    - Open `client/.env.production`.
    - Replace `https://your-render-app-url.onrender.com/api/` with your actual Render URL (ensure it ends with `/api/`).
2.  **Build**:
    - Run `cd client && npm run build`.
3.  **Upload**:
    - Open Hostinger File Manager for your domain.
    - Go to `public_html`.
    - Upload all files from the `client/dist` folder into `public_html`.
    - Ensure `.htaccess` (located in `client/public/` and then moved to `dist/` by the build) is also uploaded.

## 3. Post-Deployment

1.  **Update CORS**:
    - Once you have your Hostinger domain, update the `allowedOrigins` array in `server/app.js` and redeploy the backend.

### Verification & Troubleshooting

After deploying, follow these steps to verify the connection:

1. **Verify Backend Health**: Open `https://your-backend-url.onrender.com/api/health` in your browser. It should return `{"status": "alive", ...}`.
2. **Check Frontend Config**: If the website shows "No response from server", look at the error message. it will now show the exact URL it is trying to reach.
3. **CORS Check**: Ensure the Hostinger domain (`https://sanyuktparivarrichlifefamily.com`) is correctly listed in `server/app.js` under `allowedOrigins`.
4. **Build & Upload**: If you change `.env.production`, you **must** run `npm run build` again and re-upload the `client/dist` folder to Hostinger.
