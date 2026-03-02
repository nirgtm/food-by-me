# Git Setup for PowerShell
# Add Git to PATH for this session

$env:Path += ";C:\Program Files\Git\bin"

Write-Host "✅ Git is now available in this terminal session" -ForegroundColor Green
Write-Host "You can now use: git status, git add, git commit, git push" -ForegroundColor Cyan
