@echo off
chcp 65001 > nul
title OSMANGAZİ AR-GE 360
cd /d "C:\Users\asliokten\Desktop\Unicorn"
set "Path=C:\Program Files\nodejs;%Path%"

:: Check if server is already responding on port 3000
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" > nul 2>&1
if %errorlevel% equ 0 (
    start http://localhost:3000
    exit
)

:: Otherwise start the server in background and open browser
start http://localhost:3000
npm run start
