# Deploying Laravel + React App to Render

This guide will walk you through deploying your Laravel and React application on Render's free tier.

## Prerequisites

- GitHub account
- Render account
- Your Laravel + React application

## Step 1: Prepare Your Application

Make sure your application is ready for deployment:

1. Ensure all changes are committed to your Git repository
2. Make sure your Laravel app is properly configured for production use

## Step 2: Create a Render Account

1. Go to [render.com](https://render.com)
2. Sign up or log in to your account

## Step 3: Connect Your GitHub Repository

1. In the Render dashboard, click on "Blueprint" in the sidebar
2. Click "New Blueprint Instance"
3. Connect your GitHub account if not already connected
4. Select the repository containing your Laravel + React application
5. Render will detect the `render.yaml` file and propose the deployment plan
6. Review the deployment plan and click "Create Blueprint Instance"

## Step 4: Configure Environment Variables

Render will automatically create services based on your `render.yaml` file. You may need to configure some environment variables manually:

1. Go to your web service in the Render dashboard
2. Navigate to the "Environment" tab
3. Add the following environment variables if they're not already set:
    - `APP_KEY`: Generated automatically
    - `APP_ENV`: production
    - `APP_DEBUG`: false
    - `APP_URL`: Your Render URL (e.g., https://your-app-name.onrender.com)
    - `LOG_CHANNEL`: stderr
    - `DB_CONNECTION`: pgsql
    - Any other required variables for your specific application

## Step 5: Deploy Your Application

1. Once all configurations are set, click "Manual Deploy" and select "Deploy latest commit"
2. Render will start building and deploying your application
3. The build and deployment process may take a few minutes
4. Once complete, your application will be available at the URL provided by Render

## Step 6: Verify Deployment

1. Visit your application's URL to verify that it's working correctly
2. Check for any errors in the Render logs if the deployment fails

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs in the Render dashboard
2. Ensure all required environment variables are set correctly
3. Verify that your application runs locally without errors
4. Make sure your application's dependencies are correctly defined in `composer.json` and `package.json`

## Production Tips

- Enable HTTPS for your application
- Configure database backups
- Set up a custom domain
- Monitor application performance

## Maintaining Your Deployment

- Each push to your Git repository's main branch will trigger an automatic deployment
- You can manually deploy from the Render dashboard
- Monitor your usage to ensure you stay within the free tier limits

---

For more information, refer to the [Render documentation](https://render.com/docs).
