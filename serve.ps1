$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
} catch {
    Write-Host "Error starting listener: $_"
    exit 1
}
Write-Host "Server started at http://localhost:$port/"
$workspace = "c:\Users\YunColdiz\Desktop\Hop"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Decode URL just like server.js did
        $decodedUrl = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
        
        if ($decodedUrl -eq "/api/servers") {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }

            $placeId = $request.QueryString["placeId"]
            if (-not $placeId) {
                $response.StatusCode = 400
                $response.ContentType = "application/json; charset=utf-8"
                [byte[]]$bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error": "placeId is required"}')
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                try {
                    $userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    $allServers = @()
                    $nextCursor = ""
                    
                    for ($i = 0; $i -lt 3; $i++) {
                        $cursorParam = if ($nextCursor) { "&cursor=$nextCursor" } else { "" }
                        $robloxUrl = "https://games.roblox.com/v1/games/$placeId/servers/Public?limit=100$cursorParam"
                        $robloxResponse = & "C:\Windows\System32\curl.exe" -s -H "User-Agent: $userAgent" $robloxUrl
                        $jsonString = [string]::Join("`r`n", $robloxResponse)
                        
                        if ($jsonString) {
                            $parsed = ConvertFrom-Json $jsonString
                            if ($parsed -and $parsed.data) {
                                $allServers += $parsed.data
                                $nextCursor = $parsed.nextPageCursor
                                if (-not $nextCursor) { break }
                            } else {
                                break
                            }
                        } else {
                            break
                        }
                    }
                    
                    $resultJson = @{ data = $allServers } | ConvertTo-Json -Depth 5
                    
                    $response.StatusCode = 200
                    $response.ContentType = "application/json; charset=utf-8"
                    [byte[]]$bytes = [System.Text.Encoding]::UTF8.GetBytes($resultJson)
                    $response.ContentLength64 = $bytes.Length
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } catch {
                    $response.StatusCode = 500
                    $errStr = $_.Exception.Message
                    $response.ContentType = "application/json; charset=utf-8"
                    [byte[]]$bytes = [System.Text.Encoding]::UTF8.GetBytes('{"error": "Failed to fetch from Roblox", "details": "' + $errStr + '"}')
                    $response.ContentLength64 = $bytes.Length
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            }
            $response.Close()
            continue
        }
        
        if ($decodedUrl -eq "/") { $decodedUrl = "/index.html" }
        $file = Join-Path $workspace $decodedUrl
        if (Test-Path $file -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($file).ToLower()
            $mime = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "text/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found: $decodedUrl</h1>")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Server encountered an error: $_"
} finally {
    $listener.Stop()
    Write-Host "Server stopped."
}
