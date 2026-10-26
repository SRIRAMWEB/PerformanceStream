Add-Type -AssemblyName System.Speech

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Zira Desktop")
$synth.Rate = 0  # Normal speed (-10 to 10)
$synth.Volume = 100

$outputDir = "public\audio"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$outputPath = Join-Path $outputDir "walkthrough.wav"

$prompt = New-Object System.Speech.Synthesis.PromptBuilder

$prompt.AppendText("Welcome to Performance Stream, a secure, real-time sports analytics pipeline built for Team Among Us, Breach-X, problem BRCX-SPT-03.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(700))

$prompt.AppendText("In elite athletics, sideline coaches and sports scientists rely heavily on wearable sensors for pacing, cardiac load management, and critical substitution decisions. But in modern stadiums, wireless telemetry is vulnerable. Attackers can spoof hardware, alter biometrics in transit, replay old sessions, or flood network perimeters.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(700))

$prompt.AppendText("Performance Stream solves this by placing a zero-trust cryptographic verification gate directly between the athletes wearables and the coaches dashboard.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(900))

$prompt.AppendText("First, let us examine the pipeline architecture. Every reading must survive five sequential defensive checks. Check one verifies device identity against an authorized registry. Check two uses keyed HMAC SHA-256 signatures to prove the data was not altered in transit. Check three enforces freshness using synchronized Unix timestamps and cryptographic nonces, completely neutralizing replay attacks. Check four monitors sequence numbers to catch packet drops or re-ordering. And check five uses physiological boundaries and rolling statistical z-scores to catch impossible biometric spikes.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(900))

$prompt.AppendText("Now, let us enter the Live Simulator. With protection enabled, watch how the pipeline reacts under attack.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(600))

$prompt.AppendText("When an attacker injects a fake sensor reading, check one rejects it immediately. The dashboard drops the packet and logs an unauthorized device incident.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(600))

$prompt.AppendText("When an adversary modifies a heart rate value mid-flight, check two detects the cryptographic signature mismatch and denies access.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(600))

$prompt.AppendText("When someone attempts to replay a valid packet from earlier in the match, check three flags the expired nonce and blocks it.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(600))

$prompt.AppendText("Even if an attacker gains physical possession of a device key and injects an impossible 240 beats-per-minute spike, check five flags it via statistical anomaly scoring and safely quarantines the outlier without disrupting team analytics.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(600))

$prompt.AppendText("Under volumetric flooding, token-bucket perimeter rate limiters shed excess burst packets, ensuring clean athlete streams remain uninterrupted.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(800))

$prompt.AppendText("Every verified reading is then anchored into an immutable SHA-256 hash ledger. If an attacker breaches the database and tampers with historical records, our ledger verification algorithm immediately detects the broken link and pinpoints the exact compromised index.")
$prompt.AppendBreak([TimeSpan]::FromMilliseconds(800))

$prompt.AppendText("Coaches can click on any data point on their biometric charts to trace its full cryptographic lineage back to the originating wearable. Performance Stream delivers absolute trust from athlete to sideline. Thank you for watching.")

$synth.SetOutputToWaveFile($outputPath, (New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(22050, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)))
$synth.Speak($prompt)
$synth.Dispose()

Write-Output "Generated voiceover at $outputPath"
