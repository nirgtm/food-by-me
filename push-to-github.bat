@echo off
echo ========================================
echo Pushing FoodByMe to GitHub
echo ========================================
echo.

REM Initialize git if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Configure git
echo Configuring Git...
git config user.name "nirgtm"
git config user.email "nirgtm@users.noreply.github.com"
echo.

REM Add all files
echo Adding files...
git add .
echo.

REM Commit changes
echo Committing changes...
git commit -m "Setup complete with Supabase integration and environment configuration"
echo.

REM Add remote origin
echo Adding remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/nirgtm/food-by-me.git
echo.

REM Set branch to main
echo Setting branch to main...
git branch -M main
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main --force
echo.

echo ========================================
echo Done! Check your GitHub repository at:
echo https://github.com/nirgtm/food-by-me
echo ========================================
pause
