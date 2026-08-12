# Crop-to-fill + resize + JPEG encode, using built-in System.Drawing.
param(
  [Parameter(Mandatory=$true)][string]$SrcDir,
  [Parameter(Mandatory=$true)][string]$OutDir,
  [int]$Quality = 82
)

Add-Type -AssemblyName System.Drawing

$jobs = @(
  @{ src='Hero 1.png';    out='hero-1.jpg';     w=1920; h=900  },
  @{ src='Hero 2.png';    out='hero-2.jpg';     w=1920; h=900  },
  @{ src='Hero 3.png';    out='hero-3.jpg';     w=1920; h=900  },
  @{ src='About 1.png';   out='about-1.jpg';    w=840;  h=600  },
  @{ src='About 2.png';   out='about-2.jpg';    w=840;  h=1000 },
  @{ src='System 1.png';  out='system-1.jpg';   w=840;  h=1000 },
  @{ src='System 2.png';  out='system-2.jpg';   w=840;  h=1000 },
  @{ src='System 3.png';  out='system-3.jpg';   w=840;  h=1000 },
  @{ src='CTA bg.png';    out='cta-bg.jpg';     w=1920; h=1200 },
  @{ src='Couter bg.png'; out='counter-bg.jpg'; w=1920; h=600  }
)

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
         Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality, [int64]$Quality)

foreach ($j in $jobs) {
  $srcPath = Join-Path $SrcDir $j.src
  if (-not (Test-Path $srcPath)) { Write-Output ("MISSING  " + $j.src); continue }

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
    Write-Output ("{0,-16} {1,5}x{2,-5} from {3}x{4}  crop {5}x{6}  {7} KB" -f `
      $j.out, $tw, $th, $img.Width, $img.Height, $cropW, $cropH, $kb)

    $g.Dispose(); $bmp.Dispose()
  } finally {
    $img.Dispose()
  }
}
