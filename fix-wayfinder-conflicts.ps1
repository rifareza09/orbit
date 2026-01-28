# Fix naming conflicts in wayfinder generated files
$conflictFiles = @(
    @{path="resources\js\routes\data\index.ts"; old="import ormawa from"; new="import ormawaPage from"},
    @{path="resources\js\routes\data\ormawa\index.ts"; old="import detail from"; new="import detailPage from"},
    @{path="resources\js\routes\password\index.ts"; old="import confirm from"; new="import confirmPage from"},
    @{path="resources\js\routes\profile\index.ts"; old="import ormawa from"; new="import ormawaPage from"},
    @{path="resources\js\routes\two-factor\index.ts"; old="import login from"; new="import loginPage from"}
)

foreach ($file in $conflictFiles) {
    if (Test-Path $file.path) {
        (Get-Content $file.path -Raw) -replace [regex]::Escape($file.old), $file.new | Set-Content $file.path -NoNewline
        Write-Host "Fixed: $($file.path)" -ForegroundColor Green
    }
}

Write-Host "`nAll naming conflicts fixed!" -ForegroundColor Cyan
