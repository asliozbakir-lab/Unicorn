Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Check if port 3000 is open
bIsRunning = False
On Error Resume Next
Set objHTTP = CreateObject("MSXML2.ServerXMLHTTP.6.0")
objHTTP.open "GET", "http://localhost:3000", False
objHTTP.setTimeouts 1000, 1000, 1000, 1000
objHTTP.send ""
If Err.Number = 0 Then
    If objHTTP.status = 200 Or objHTTP.status = 302 Or objHTTP.status = 307 Then
        bIsRunning = True
    End If
End If
Err.Clear
On Error GoTo 0

' If server is not running, start it silently
If Not bIsRunning Then
    strBat = "cmd.exe /c ""cd /d C:\Users\asliokten\Desktop\Unicorn && set Path=C:\Program Files\nodejs;%Path% && npm run start"""
    objShell.Run strBat, 0, False
    WScript.Sleep 2500
End If

' Launch Chrome in dedicated App Mode (native window without browser bar)
strChrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
If objFSO.FileExists(strChrome) Then
    objShell.Run """" & strChrome & """ --app=http://localhost:3000", 1, False
Else
    ' Fallback to default browser
    objShell.Run "http://localhost:3000", 1, False
End If