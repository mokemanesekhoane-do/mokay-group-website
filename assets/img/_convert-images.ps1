# Crop-to-fill + resize + JPEG encode, using built-in System.Drawing.
# Source paths are relative to -SrcDir, so one run handles the whole library.
#
#   powershell -File assets/img/_convert-images.ps1 `
#       -SrcDir "C:\Users\hp\Downloads\Mokay Group Web Images" -OutDir assets\img
#
# Add -Only to convert a subset, e.g.  -Only "sector-*,banner-*"

param(
  [Parameter(Mandatory=$true)][string]$SrcDir,
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$Quality = 82,
  [string]$Only = ""
)

Add-Type -AssemblyName System.Drawing

# GDI+ resolves relative paths against the .NET working directory, not the
# PowerShell location, and fails with a bare "generic error" if it misses.
$SrcDir = (Resolve-Path -LiteralPath $SrcDir).Path
if (-not (Test-Path -LiteralPath $OutDir)) { New-Item -ItemType Directory -Force -Path $OutDir | Out-Null }
$OutDir = (Resolve-Path -LiteralPath $OutDir).Path

$jobs = @(
  # --- original set ---
  @{ src='Hero 1.png';    out='hero-1.jpg';     w=1920; h=900  },
  @{ src='Hero 2.png';    out='hero-2.jpg';     w=1920; h=900  },
  @{ src='Hero 3.png';    out='hero-3.jpg';     w=1920; h=900  },
  @{ src='About 1.png';   out='about-1.jpg';    w=840;  h=600  },
  @{ src='About 2.png';   out='about-2.jpg';    w=840;  h=1000 },
  @{ src='System 1.png';  out='system-1.jpg';   w=840;  h=1000 },
  @{ src='System 2.png';  out='system-2.jpg';   w=840;  h=1000 },
  @{ src='System 3.png';  out='system-3.jpg';   w=840;  h=1000 },

  # --- page banners (32:15) ---
  @{ src='Additional\banner-about.png';        out='banner-about.jpg';      w=1920; h=900 },
  @{ src='Additional\Banner system.png';       out='banner-systems.jpg';    w=1920; h=900 },
  @{ src='Additional\banner-industries.jpg.png'; out='banner-industries.jpg'; w=1920; h=900 },
  @{ src='Additional\banner-contact.jp.png';   out='banner-contact.jpg';    w=1920; h=900 },

  # --- sector panels (6:5) ---
  @{ src='Additional\Sector Minning.png';        out='sector-mining.jpg';         w=1200; h=1000 },
  @{ src='Additional\sector-industrial.jpg';     out='sector-industrial.jpg';     w=1200; h=1000 },
  @{ src='Additional\Sector Energy.png';         out='sector-energy.jpg';         w=1200; h=1000 },
  @{ src='Additional\Sector Infrastructure.png'; out='sector-infrastructure.jpg'; w=1200; h=1000 },
  @{ src='Additional\Sector Agric.png';          out='sector-agriculture.jpg';    w=1200; h=1000 },
  @{ src='Additional\Sector Health.png';         out='sector-health.jpg';         w=1200; h=1000 },

  # --- capability images (21:25) ---
  @{ src='Additional\capability-analytics.jpg.png';   out='capability-analytics.jpg';   w=840; h=1000 },
  @{ src='Additional\capability-field.jpg.png';       out='capability-field.jpg';       w=840; h=1000 },
  @{ src='Additional\capability-integration.jpg.png'; out='capability-integration.jpg'; w=840; h=1000 },

  # --- full-width band textures ---
  @{ src='Additional\cta-bg.png';     out='cta-bg.jpg';     w=1920; h=1200 },
  @{ src='Additional\counter-bg.png'; out='counter-bg.jpg'; w=1920; h=600  }
)

if ($Only) {
  $patterns = $Only -split ',' | ForEach-Object { $_.Trim() }
  $jobs = $jobs | Where-Object { $o = $_.out; $patterns | Where-Object { $o -like $_ } }
}

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

$done = 0; $skipped = 0
foreach ($j in $jobs) {
  $srcPath = Join-Path $SrcDir $j.src
  if (-not (Test-Path $srcPath)) { Write-Output ("SKIP     " + $j.out + "  (no source)"); $skipped++; continue }

  $img = [System.Drawing.Image]::FromFile($srcPath)
  try {
    $tw = $j.w; $th = $j.h
    $srcRatio = $img.Width / $img.Height
    $dstRatio = $tw / $th

    # largest centred rectangle of the source matching the target ratio
    if ($srcRatio -gt $dstRatio) {
      $cropH = $img.Height
      $cropW = [int][Math]::Round($img.Height * $dstRatio)
    } else {
      $cropW = $img.Width
      $cropH = [int][Math]::Round($img.Width / $dstRatio)
    }
    $cropX = [int](($img.Width  - $cropW) / 2)
    $cropY = [int](($img.Height - $cropH) / 2)

    $bmp = New-Object System.Drawing.Bitmap($tw, $th)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.CompositingQuality = 'HighQuality'
    $g.InterpolationMode  = 'HighQualityBicubic'
    $g.SmoothingMode      = 'HighQuality'
    $g.PixelOffsetMode    = 'HighQuality'

    $dstRect = New-Object System.Drawing.Rectangle(0, 0, $tw, $th)
    $g.DrawImage($img, $dstRect, $cropX, $cropY, $cropW, $cropH,
                 [System.Drawing.GraphicsUnit]::Pixel)

    $outPath = Join-Path $OutDir $j.out
    $bmp.Save($outPath, $codec, $params)

    $kb = [int]((Get-Item $outPath).Length / 1KB)
    Write-Output ("{0,-28} {1,5}x{2,-5} from {3}x{4}  {5} KB" -f `
      $j.out, $tw, $th, $img.Width, $img.Height, $kb)
    $done++

    $g.Dispose(); $bmp.Dispose()
  } finally {
    $img.Dispose()
  }
}
Write-Output ""
Write-Output "converted $done, skipped $skipped"
