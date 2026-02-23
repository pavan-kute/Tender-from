<#
PowerShell helper to ensure .env files are not pushed.
Usage: Right-click -> Run with PowerShell, or run from repo root:
  .\push-safe.ps1
#>
param()

function Test-Tracked($path){
    git ls-files --error-unmatch $path 2>$null
    return ($LASTEXITCODE -eq 0)
}

$candidates = @('.env','backend/.env','frontend/.env')
$tracked = @()
foreach($p in $candidates){
    if (Test-Path $p -PathType Leaf -ErrorAction SilentlyContinue){
        if (Test-Tracked $p){ $tracked += $p }
    }
}

if ($tracked.Count -gt 0){
    Write-Host "Found tracked env files:" -ForegroundColor Yellow
    $tracked | ForEach-Object { Write-Host "  $_" }
    $confirm = Read-Host "Remove these from git tracking (they will remain locally)? (y/N)"
    if ($confirm -match '^[Yy]'){
        foreach($f in $tracked){ git rm --cached $f }
        git add .gitignore
        git commit -m "Remove env files from tracking and add .gitignore"
    } else {
        Write-Host "Aborting: please remove tracked env files before pushing." -ForegroundColor Red
        exit 1
    }
} else {
    git add .gitignore 2>$null
    git commit -m "Add .gitignore to exclude env files" 2>$null
}

# Ask for remote if not set
$remote = $null
try { $remote = git remote get-url origin 2>$null } catch {}
if (![string]::IsNullOrEmpty($remote)){
    Write-Host "Using existing remote origin: $remote"
} else {
    $repo = Read-Host "Enter Git remote URL to push to (or press Enter to skip push)"
    if ([string]::IsNullOrEmpty($repo)){
        Write-Host "No remote provided — changes committed locally. Exiting." -ForegroundColor Green
        exit 0
    }
    git remote add origin $repo
}

$branch = git rev-parse --abbrev-ref HEAD
Write-Host "Pushing branch $branch to origin..."
git push -u origin $branch

Write-Host "Done. Verify on GitHub that no env files were uploaded." -ForegroundColor Green
