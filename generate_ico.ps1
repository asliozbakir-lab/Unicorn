Add-Type -AssemblyName System.Drawing

$size = 256
$bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Clear transparent
$g.Clear([System.Drawing.Color]::Transparent)

# Outer circle shadow
$shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, 0, 0, 0))
$g.FillEllipse($shadowBrush, 12, 16, 232, 232)

# Main circle background gradient
$rect = New-Object System.Drawing.Rectangle(12, 12, 232, 232)
$c1 = [System.Drawing.Color]::FromArgb(255, 23, 108, 85)   # #176C55 Osmangazi Dark Green
$c2 = [System.Drawing.Color]::FromArgb(255, 11, 65, 50)    # Deeper Forest Green
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
$g.FillEllipse($brush, $rect)

# Gold/Olive ring border (#839B24)
$ringColor = [System.Drawing.Color]::FromArgb(255, 131, 155, 36)
$pen = New-Object System.Drawing.Pen($ringColor, 8)
$g.DrawEllipse($pen, 20, 20, 216, 216)

# Inner decorative subtle ring
$innerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(80, 255, 255, 255), 2)
$g.DrawEllipse($innerPen, 32, 32, 192, 192)

# Globe latitude/longitude subtle arcs
$globePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 255, 255, 255), 2)
$g.DrawEllipse($globePen, 64, 40, 128, 176)
$g.DrawLine($globePen, 32, 128, 224, 128)
$g.DrawLine($globePen, 128, 32, 128, 224)

# "OSMANGAZİ" Top Label
$smallFont = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$goldBrush = New-Object System.Drawing.SolidBrush($ringColor)
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

$g.DrawString("OSMANGAZİ", $smallFont, $goldBrush, 128, 62, $sf)

# "AR-GE" Middle Label
$argeFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$g.DrawString("AR-GE", $argeFont, $whiteBrush, 128, 92, $sf)

# "360" Big Bold Main Number
$bigFont = New-Object System.Drawing.Font("Impact", 56, [System.Drawing.FontStyle]::Regular)
# Subtle text shadow for 360
$txtShadow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 0, 0, 0))
$g.DrawString("360", $bigFont, $txtShadow, 130, 152, $sf)
$g.DrawString("360", $bigFont, $whiteBrush, 128, 150, $sf)

# Bottom Badge "PORTAL"
$portalFont = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$g.DrawString("DİJİTAL YÖNETİM", $portalFont, $goldBrush, 128, 198, $sf)

# Save PNG
$outPng = "C:\Users\asliokten\Desktop\Unicorn\public\app-icon.png"
$bmp.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)

# Convert to ICO using Icon.FromHandle
$hIcon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$outIco = "C:\Users\asliokten\Desktop\Unicorn\public\app-icon.ico"
$stream = New-Object System.IO.FileStream($outIco, [System.IO.FileMode]::Create)
$icon.Save($stream)
$stream.Close()
$icon.Dispose()

Write-Output "Icon generated successfully at $outIco"
