@echo off
echo ========================================
echo Creating Separate Repos for Deployment
echo ========================================
echo.

REM Create a temporary directory for backend
echo Creating backend repository...
mkdir ..\food-by-me-backend-temp
xcopy backend ..\food-by-me-backend-temp /E /I /H /Y
copy .gitignore ..\food-by-me-backend-temp\
cd ..\food-by-me-backend-temp

REM Initialize backend repo
git init
git add .
git commit -m "Backend deployment setup"
echo.
echo Backend repo created at: ..\food-by-me-backend-temp
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Create a new GitHub repo: food-by-me-backend
echo 2. Run these commands in food-by-me-backend-temp folder:
echo    git remote add origin https://github.com/nirgtm/food-by-me-backend.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. For frontend, use the existing repo: food-by-me
echo.
pause
