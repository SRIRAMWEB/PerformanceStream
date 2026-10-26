Add-Type -AssemblyName System.Speech

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Zira Desktop")
$synth.Rate = 0
$synth.Volume = 100

$outputPath = "public\audio\demo_video_voiceover.wav"

$prompt = New-Object System.Speech.Synthesis.PromptBuilder

# Intro (0:00 - 0:14)
$prompt.AppendText("Welcome to PerformanceStream, a zero-trust security pipeline for real-time sports analytics.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(500))
$prompt.AppendText("In elite athletics, sideline coaches rely heavily on wearable sensors for critical pacing and substitutions. But stadium networks are vulnerable to spoofed hardware, altered telemetry, replay attacks, and volumetric floods.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(600))

# Architecture (0:14 - 0:32)
$prompt.AppendText("PerformanceStream places a cryptographic gate between athlete wearables and coach dashboards. Every incoming reading must survive five sequential checks: source identity verification, HMAC-SHA-256 integrity, timestamp and nonce freshness, sequence continuity, and statistical physiological anomaly scoring.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(700))

# Simulator Intro & Attacks (0:32 - 0:50)
$prompt.AppendText("Here in our Live Simulator, watch the defense in action. An unauthorized sensor is instantly rejected at Check 1. Altered telemetry fails Check 2 with a cryptographic signature mismatch. And an impossible heart-rate spike is safely quarantined by rolling statistical z-scores.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(700))

# Ledger & Lineage (0:50 - 1:06)
$prompt.AppendText("Every verified reading is anchored into an immutable SHA-256 hash ledger. Coaches can click any data point to trace its full cryptographic lineage, while our tamper detection algorithm pinpoints any compromised historical blocks.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(600))

# Outro (1:06 - 1:12)
$prompt.AppendText("PerformanceStream: Every reading verified. Every number traceable.")

$synth.SetOutputToWaveFile($outputPath, (New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(22050, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)))
$synth.Speak($prompt)
$synth.Dispose()

Write-Output "Generated demo video voiceover at $outputPath"
