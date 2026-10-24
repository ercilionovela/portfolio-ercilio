# ============================================================
#  SERVIDOR LOCAL (apenas para testes)
#
#  O seletor de folha dos templates le o ficheiro .qpt com
#  fetch, e os browsers bloqueiam isso quando a pagina e
#  aberta directamente do disco (file://). Este servidor
#  resolve o problema.
#
#  Como usar:  powershell -ExecutionPolicy Bypass -File server.ps1
#  Depois abrir: http://127.0.0.1:8735/
# ============================================================

$porta = 8735
$raiz  = (Get-Location).Path

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $porta)
$listener.Start()
Write-Host "Servidor a correr em http://127.0.0.1:$porta/  (Ctrl+C para parar)"

while ($true) {

    $cliente = $listener.AcceptTcpClient()

    try {
        $stream = $cliente.GetStream()
        $leitor = New-Object System.IO.StreamReader($stream)

        $linha = $leitor.ReadLine()
        while ($true) {
            $h = $leitor.ReadLine()
            if ($null -eq $h -or $h -eq "") { break }
        }

        if (-not $linha) { continue }

        $pedido  = $linha.Split(" ")
        $caminho = [Uri]::UnescapeDataString($pedido[1])

        # Remove a query string (?...) do caminho
        $caminho = ($caminho -split "\?")[0]

        if ($caminho -eq "/") { $caminho = "/index.html" }

        $ficheiro = Join-Path $raiz ($caminho.TrimStart("/") -replace "/", "\")
        $ficheiro = [System.IO.Path]::GetFullPath($ficheiro)

        $mime = switch ([System.IO.Path]::GetExtension($ficheiro).ToLower()) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "text/javascript; charset=utf-8" }
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".png"  { "image/png" }
            ".svg"  { "image/svg+xml" }
            ".qpt"  { "application/xml" }
            ".mxd"  { "application/octet-stream" }
            default { "application/octet-stream" }
        }

        # Seguranca: nunca servir nada fora da pasta do projeto
        if (-not $ficheiro.StartsWith($raiz, [System.StringComparison]::OrdinalIgnoreCase)) {
            $corpo   = [System.Text.Encoding]::UTF8.GetBytes("403")
            $cabecalho = "HTTP/1.1 403 Forbidden`r`nContent-Length: $($corpo.Length)`r`nConnection: close`r`n`r`n"
        }
        elseif (Test-Path $ficheiro -PathType Leaf) {
            $corpo   = [System.IO.File]::ReadAllBytes($ficheiro)
            $cabecalho = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($corpo.Length)`r`nConnection: close`r`n`r`n"
        }
        else {
            $corpo   = [System.Text.Encoding]::UTF8.GetBytes("404")
            $cabecalho = "HTTP/1.1 404 Not Found`r`nContent-Length: $($corpo.Length)`r`nConnection: close`r`n`r`n"
        }

        $cab = [System.Text.Encoding]::ASCII.GetBytes($cabecalho)
        $stream.Write($cab, 0, $cab.Length)
        $stream.Write($corpo, 0, $corpo.Length)
        $stream.Flush()
    }
    catch {
        # ligacao cancelada pelo browser: ignorar
    }
    finally {
        $cliente.Close()
    }
}
