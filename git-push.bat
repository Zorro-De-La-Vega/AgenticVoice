@echo off
echo Running Git Push Script for AgenticVoice.net
echo ==========================================

echo Setting remote repository to https://github.com/fenago/AgenticVoice...
git remote remove origin 2>nul
git remote add origin https://github.com/fenago/AgenticVoice.git

echo.
echo Checking current status...
git status

echo.
echo Adding all files except those in .gitignore...
git add .

echo.
echo Committing changes...
set /p commit_msg="Enter commit message (or press Enter for default message): "
if "%commit_msg%"=="" (
  git commit -m "Fixed TypeScript errors and added Google Analytics integration"
) else (
  git commit -m "%commit_msg%"
)

echo.
echo Pushing to GitHub repository: https://github.com/fenago/AgenticVoice
git push -u origin main

echo.
echo Done!
echo ==========================================
