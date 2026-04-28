# MongoDB Atlas Setup Guide

## Quick Setup for Render Deployment

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**

2. **Create Account & Cluster:**
   - Sign up for free account
   - Choose "M0 Cluster" (free tier)
   - Select AWS/Google Cloud/Azure provider
   - Choose a region close to your users
   - Cluster name: `k12-tutor-cluster`

3. **Create Database User:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `k12user`
   - Password: `<create-secure-password>`
   - Built-in Role: `Read and write to any database`

4. **Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (`0.0.0.0/0`)
   - **⚠️ For production, restrict this to your Render service IP**

5. **Get Connection String:**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database>` with `k12-tutor`

**Your connection string should look like:**
```
mongodb+srv://k12user:<password>@k12-tutor-cluster.xxxxx.mongodb.net/k12-tutor?retryWrites=true&w=majority
```

6. **Add to Render Environment Variables:**
   - In your Render service dashboard
   - Go to Environment
   - Add: `DB_URI=<your-connection-string>`

## Security Notes

- **For production:** Restrict MongoDB network access to only your Render service IP
- **Change passwords:** Use strong, unique passwords
- **Environment variables:** Never commit secrets to code

## Testing Connection

After setup, your backend should connect automatically when deployed to Render!