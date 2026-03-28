# open-md.ps1 — Open a Markdown file in MD Viewer web app
# Usage: powershell -ExecutionPolicy Bypass -File open-md.ps1 "path\to\file.md"

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$FilePath
)

$AppUrl = "https://mdviewer-9zi.pages.dev/"

# Debug log
$logFile = Join-Path $PSScriptRoot "debug.log"
"[$(Get-Date)] FilePath = [$FilePath]" | Out-File $logFile -Append

if (-not (Test-Path $FilePath)) {
    Write-Error "File not found: $FilePath"
    exit 1
}

$content = [System.IO.File]::ReadAllText($FilePath, [System.Text.Encoding]::UTF8)
$bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
$base64 = [Convert]::ToBase64String($bytes)
$name = [System.IO.Path]::GetFileName($FilePath)
$encodedName = [Uri]::EscapeDataString($name)

# Browser URL length limit ~2MB; base64 adds ~33% overhead
# For files over ~1MB raw, open the app without content and let user drag-drop
$maxBytes = 1048576  # 1MB

if ($bytes.Length -gt $maxBytes) {
    Write-Warning "File too large for URL hash ($($bytes.Length) bytes). Opening MD Viewer for manual drag-drop."
    Start-Process $AppUrl
    exit 0
}

# Add timestamp to force browser to open a new tab instead of reusing existing one
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$url = "${AppUrl}?t=${ts}#base64=${base64}&name=${encodedName}"
Start-Process $url
