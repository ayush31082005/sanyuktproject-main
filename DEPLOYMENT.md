# Deployment Guide: Sanyukt Project

This guide provides instructions for deploying the Sanyukt Project with the **Frontend on Hostinger** and the **Backend on Render**.

---

## 🏗️ Step 1: Backend Deployment (Render)

1.  **Repository**: Push your code to a GitHub/GitLab repository.
2.  **Create Web Service**: In Render dashboard, click **New +** > **Web Service**.
3.  **Root Directory**: Set this to `server`.
4.  **Environment**: Node.js.
5.  **Build Command**: `npm install`
    This now also builds the Vite frontend automatically and creates `client/dist`.
6.  **Start Command**: `node server.js` (Ensure `PORT` is dynamic: `process.env.PORT || 5000`)
7.  **Environment Variables**: Click "Advanced" and add:
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A long random string.
    *   `RAZORPAY_KEY_ID`: Your Razorpay Key.
    *   `RAZORPAY_KEY_SECRET`: Your Razorpay Secret.
    *   `FRONTEND_URL`: `https://your-hostinger-domain.com` (Add this later once you have the Hostinger domain).
    *   `NODE_ENV`: `production`

---

## 🎨 Step 2: Frontend Deployment (Hostinger)

1.  **Preparation**:
    *   Go to the `client` folder.
    *   Create a `.env` file (copy from `.env.example`).
    *   Set `VITE_API_URL` to your **Render Backend URL** (e.g., `https://your-app.onrender.com/api/`).
2.  **Build**:
    *   Run `npm install` and `npm run build` in the `client` folder.
    *   This generates a `dist` folder.
3.  **Upload**:
    *   Log in to **Hostinger hPanel**.
    *   Open **File Manager** for your domain.
    *   Upload the **contents** of the `client/dist` folder to the `public_html` directory.
4.  **Config**:
    *   If you're using React Router, create/edit the `.htaccess` file in `public_html`:
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteCond %{REQUEST_FILENAME} !-y
          RewriteRule . /index.html [L]
        </IfModule>
        ```

---

## 🔗 Step 3: Connect Frontend & Backend

1.  **Finalize CORS**: Once your Hostinger site is live, copy the URL.
2.  **Update Render**: Go to your Render Web Service settings and update the `FRONTEND_URL` environment variable with your live Hostinger URL (including `https://`).
3.  **Restart**: Render will automatically restart with the new CORS policy.

---

## 🛡️ Security Tips
*   Never commit your `.env` files with real keys.
*   Ensure `NODE_ENV=production` is set in both environments where applicable.
*   If using Razorpay, ensure your **Webhook URL** is updated in the Razorpay dashboard if necessary.
