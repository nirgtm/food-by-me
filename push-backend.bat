@echo off
echo ========================================
echo Pushing Backend to GitHub
echo ========================================
echo.

cd C:\project\food-by-me-backend

echo Initializing Git repository...
git init
echo.

echo Configuring Git...
git config user.name "nirgtm"
git config user.email "nirgtm@users.noreply.github.com"
echo.

echo Adding files...
git add .
echo.

echo Committing changes...
git commit -m "Backend initial commit"
echo.

echo Adding remote repository...
git remote add origin https://github.com/nirgtm/food-by-me-backend.git
echo.

echo Setting branch to main...
git branch -M main
echo.

echo Pushing to GitHub...
git push -u origin main
echo.

echo ========================================
echo Done! Backend pushed to GitHub.
echo Now you can deploy on Vercel!
echo ========================================
pause
