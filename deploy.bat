@echo off
echo Building the app...
call npm run build
echo Deploying to Surge...
call npx surge ./dist al-bushira-scores.surge.sh
echo Done!
pause
