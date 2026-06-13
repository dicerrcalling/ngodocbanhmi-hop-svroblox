$jsonString = $null
try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
    Write-Host "Bytes Type: $($bytes.GetType().FullName)"
    Write-Host "Bytes Length: $($bytes.Length)"
} catch {
    Write-Host "Error: $_"
}
