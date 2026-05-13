# Launch Content — Production Checklist

Self-contained shooting and editing checklist for the 5-deliverable launch kit. Work from this document during the shoot — it includes every screen capture, every verbatim line, every Descript step.

**Order of work:**

1. **Part 0** — Equipment & sanity check (~30 min, one-time)
2. **Part 1** — Capture the 6 Cowork screenshots (~20 min)
3. **Part 2** — Pre-record the canned claim-check fallback (~10 min)
4. **Part 3** — Record the walkthrough (~60 min, longest first)
5. **Part 4** — Record the 2-min setup (~20 min)
6. **Part 5** — Record the 45s hook (~30 min, most retakes)
7. **Part 6** — Edit each video in Descript (~3-4 hours total)
8. **Part 7** — Publish

Source scripts live in [`docs/launch/scripts/`](scripts/) — this checklist consolidates them with the production steps.

---

## Part 0: Equipment & Sanity Check

### Hardware

- [ ] Insta360 Link mounted at eye level
- [ ] Webcam framed so face occupies upper third
- [ ] Background neutral or branded (no busy clutter)
- [ ] Lighting: key light in front, no backlit windows
- [ ] Phone silenced (or in another room)
- [ ] Hydration nearby
- [ ] Door closed / "do not disturb" sign

### Software

- [ ] Descript open with a fresh project
- [ ] Camera + screen capture configured at 1080p / 30fps
- [ ] Audio source selected (Link built-in, or USB mic if upgraded)
- [ ] Claude Code installed and working in a test folder
- [ ] Cowork installed, no Job Hunt Skills plugin loaded yet (uninstall if present)

### Sanity Recording (skip if you've already verified)

- [ ] Record 60s test: 30s reading the hook opener line + 30s of any Claude Code screen activity
- [ ] Playback check:
  - Audio peaks around **-12 dB**, no clipping
  - Video framing stable, no lens distortion at edges
  - Screen text legible at 800px wide
  - No camera lag
- [ ] If anything fails, fix before proceeding:
  - Audio too quiet → move closer, raise gain in Descript
  - Audio too noisy → quieter room, add USB mic
  - Screen blurry → record at native display resolution
  - Camera lag → close other apps

---

## Part 1: Capture the 6 Cowork Screenshots

These feed the Cowork setup animation (rendered in Remotion). All six must exist before `npm run render:cowork` will work. Drop them in `assets/animations/public/screenshots/` AND `assets/animations/src/assets/screenshots/` (canonical source).

Target dimensions: **1920 × 1080** for all six.

### Pre-flight

- [ ] Open Cowork, confirm Job Hunt Skills plugin is NOT installed (uninstall if it is)
- [ ] Resize Cowork window to as close to 1920×1080 as your display allows
- [ ] Open a browser to `https://github.com/Remotivated/job-hunt-skills/releases/latest`

### Screenshot 1 — `01-github-releases.png`

- [ ] Browser at GitHub releases page, full window
- [ ] `job-hunt-skills.zip` asset visible
- [ ] Capture full window
- [ ] Crop/letterbox to 1920×1080
- [ ] Save as `01-github-releases.png`

### Screenshot 2 — `02-cowork-main.png`

- [ ] Cowork open, no chat in progress
- [ ] Main interface visible
- [ ] **Customize menu item visible in the chrome**
- [ ] Capture full window
- [ ] Save as `02-cowork-main.png`

### Screenshot 3 — `03-customize-panel.png`

- [ ] Click **Customize**
- [ ] Panel open showing both:
  - "Browse plugins" option
  - Custom upload option
- [ ] Capture full window
- [ ] Save as `03-customize-panel.png`

### Screenshot 4 — `04-file-picker.png`

- [ ] Click the custom upload option
- [ ] System file picker dialog appears (any folder context is fine)
- [ ] Capture full window including the dialog
- [ ] Save as `04-file-picker.png`

### Screenshot 5 — `05-folder-prompt.png`

- [ ] Complete the upload by selecting `job-hunt-skills.zip`
- [ ] Wait for install to finish
- [ ] **Cowork's folder-selection prompt appears**
- [ ] Capture full window with prompt visible
- [ ] Save as `05-folder-prompt.png`

### Screenshot 6 — `06-chat-input.png`

- [ ] Select or create a local folder for job-search files (this becomes the binding)
- [ ] Cowork returns to the main view with chat input ready
- [ ] Capture full window with the chat input prominent
- [ ] Save as `06-chat-input.png`

### Verification

- [ ] Copy/move all 6 PNGs to `assets/animations/src/assets/screenshots/`
- [ ] Also copy to `assets/animations/public/screenshots/` (Remotion reads from here)
- [ ] Verify all dimensions consistent: run `Get-ChildItem assets/animations/src/assets/screenshots/*.png | %{ Add-Type -AssemblyName System.Drawing; $img = [System.Drawing.Image]::FromFile($_.FullName); "{0}: {1}x{2}" -f $_.Name,$img.Width,$img.Height; $img.Dispose() }` in PowerShell

---

## Part 2: Pre-record Canned Claim-Check Fallback

Insurance for the walkthrough's keystone beat. If the live `claim-check` invocation doesn't behave during the walkthrough recording, splice this in.

- [ ] Open Claude Code in a folder containing Avery's files (or copy `examples/avery-castillo/my-documents/` into a temp `my-documents/` for this)
- [ ] Start screen recording in Descript (no camera needed)
- [ ] Type a prompt that explicitly asks claim-check to evaluate the inflated claim. Suggested wording:
  > "Run claim-check on this bullet from my resume: 'Influenced $4.2M in pipeline during 2024 by pairing with AEs on technical-buyer conversations and proof-of-concept scoping.' What evidence is in my source documents to support this dollar figure?"
- [ ] Capture the full claim-check response, including the "I have no evidence for this" / "I'd recommend rewording" language
- [ ] **Hold the final state on screen for ~3 seconds** before stopping the recording (gives editing room)
- [ ] Save as `docs/launch/b-roll/claim-check-rejection-canned.mp4` (this path is gitignored)

If the response doesn't flag the claim cleanly, retry with a sharper prompt. The goal is a clear, citable rejection.

---

## Part 3: Recording — Walkthrough (~60 min)

Record this FIRST because it's the longest. Beats are independent clips — retake any single beat without restarting.

### Pre-flight

- [ ] Cold open + wrap will be **full-frame Jim** — re-frame webcam accordingly
- [ ] Other beats use **PiP Jim in lower-right** — you can record full-frame and crop in Descript, or set PiP at capture time
- [ ] Avery's files staged in a **separate test folder** so the demo doesn't pollute `examples/avery-castillo/`. Suggested: `~/dev/launch-shoot/avery/`. Copy `examples/avery-castillo/my-documents/` into there.
- [ ] Claude Code (or Cowork) working directory set to that test folder
- [ ] All three scripts open in a second window or printed:
  - [ ] `docs/launch/scripts/walkthrough.md`
  - [ ] `docs/launch/scripts/setup-2min.md`
  - [ ] `docs/launch/scripts/hook-45s.md`

### Beat 1 — Cold Open (0:00–0:30) · FULL FRAME JIM

**Camera only.** No screen recording yet.

Word-for-word (memorize):

> "I'm Jim Coughlin, founder of Remotivated. I built Job Hunt Skills because most AI job-hunt tools optimize for application volume over honest representation. The next 10 minutes are an end-to-end walkthrough using Avery Castillo — a synthetic Solutions Engineer persona we ship in examples so you can clone the files and follow along."

- [ ] Take 1
- [ ] Take 2
- [ ] Take 3 (mark best take in Descript with a star)

Tip: vary delivery slightly across takes (steady / slightly more energy / slightly more relaxed).

### Beat 2 — resume-builder demo (0:30–1:30) · PiP

Switch to screen capture + PiP.

- [ ] Open `examples/avery-castillo/my-documents/resume.md` in your editor — visible on screen
- [ ] Start recording

**Screen actions (narrate as you go):**

1. Show the resume file briefly. Say: *"Avery's resume already exists — this is the source-of-truth markdown that everything else gets generated from."*
2. Invoke the `resume-builder` skill in Claude Code. Say: *"resume-builder is responsible for the source resume itself — versioning, schema, the format the rest of the workflow expects."*
3. Show the version and label in frontmatter. Say: *"Version 3, label 'resume' — that's the canonical source."*
4. Quick edit beat: reword **one bullet** to show the skill is alive. Suggestion: rephrase "Lead SE coverage for the East-region mid-market segment" slightly. Say while editing: *"Watch — I can make a small change and the version will tick up."*
5. After save, show version bumped to 4 (or note it would). Say: *"Now downstream skills know there's a new version to re-tailor against."*

- [ ] Stop recording. Review playback.
- [ ] Retake if pacing dragged or commands fumbled.

### Beat 3 — company-research demo (1:30–3:00) · PiP

- [ ] Start recording

**Screen actions:**

1. Show Avery's `my-documents/reports/` folder — currently has `001-polaris-data-research-2026-05-12.md` from the pre-built example. Say: *"For the demo I'll have it generate a fresh report on the Polaris Data posting — same company Avery's targeting."*
2. Invoke `company-research`. Provide the posting URL: `https://polaris-data.example.com/careers/senior-se` (or pretend to — the real URL is fictional). Say: *"It pulls the posting, then it's going to research the company end-to-end — product, GTM signals, risks, talking points."*
3. Watch the file generate. Say: *"That's a new numbered report — 002 if 001 already exists."*
4. Open the generated report. Skim the screen showing the **At-a-glance** and **GTM signals** sections. Say: *"Two things stand out for Avery — the product wedges between traditional ETL and reverse-ETL, and the founders publicly write about an SE-led discovery motion. Both are interview-ready hooks."*
5. Scroll to **Recommended interview talking points**. Say: *"And the report ends with literal questions Avery can ask in the interview."*

- [ ] Stop recording. Review.
- [ ] Retake if the report didn't generate cleanly or the skim felt rushed.

### Beat 4 — resume-tailor demo (3:00–5:00) · PiP

- [ ] Start recording

**Screen actions:**

1. Show the file explorer with `applications/polaris-data-senior-se/` not yet existing (or empty). Say: *"Now Avery wants to tailor for this specific role. resume-tailor is the skill for that."*
2. Invoke `resume-tailor`. Specify the application: Polaris Data, senior solutions engineer. Say: *"Pointing it at the posting we just researched."*
3. Watch the new `applications/polaris-data-senior-se/resume.md` file appear. Say: *"There's the tailored resume — separate file, links back to the source by version."*
4. **Open the source and tailored versions side-by-side.** Say: *"Look at what changed. The summary now leads with multi-threaded enterprise selling — that's pulling from the research report's signal that Polaris's GTM motion is SE-led."*
5. Point at a specific reframed bullet (e.g., the Docker demo bullet). Say: *"And these technical bullets got reordered to lead with the live-coded demo work, which the posting emphasized."*

- [ ] Stop recording. Review.
- [ ] Retake if side-by-side view didn't render cleanly.

### Beat 5 — claim-check KEYSTONE (5:00–6:30) · PiP

**This is the moment that earns the entire video. Dry-run first.**

- [ ] **DRY RUN (no recording):** Invoke `claim-check` on Avery's tailored resume in the test folder. Confirm it flags "$4.2M in pipeline" (or similar inflated claim).
  - **If it flags cleanly →** record live.
  - **If it doesn't flag, or flags weakly →** use the canned recording from Part 2.

#### If recording live:

- [ ] Start recording

**Screen actions:**

1. Show the tailored resume open. Say: *"Before Avery sends this anywhere — claim-check."*
2. Invoke `claim-check`. Say: *"This is the part nobody else builds. It reads every claim in the tailored resume and checks it against Avery's source documents — resume, story-bank, proof assets."*
3. Watch the response. When it flags the $4.2M claim, **pause for emphasis**. Say: *"There it is. The skill is saying — there's no evidence in your source materials for this specific dollar figure. The activity is supported, the number isn't."*
4. Show the suggested softer rewording. Say: *"It even offers a replacement that keeps the credit for the work."*
5. Accept the rewording. Show the diff landing in the tailored resume. Say: *"Now that line is something Avery can defend in an interview, not something that'll fall apart under pressure."*

- [ ] **Hold the final diff visible for ~5 seconds before stopping.**
- [ ] Stop recording. Review.

#### If using canned:

- [ ] You'll splice the canned MP4 in during editing. Skip live recording — but still narrate the surrounding context as a separate clip so you have voiceover to bridge.

### Beat 6 — cover-letter demo (6:30–7:30) · PiP

- [ ] Start recording

**Screen actions:**

1. Show that `applications/polaris-data-senior-se/coverletter.md` doesn't exist yet (or hide the pre-built example). Say: *"Last piece — cover letter."*
2. Invoke `cover-letter`. Say: *"It already has the research and the tailored resume to draw from, so it's going to write something specific, not boilerplate."*
3. Watch the file generate. Open it.
4. **Read aloud the second paragraph** (the one about the demo stack and close-rate). Say after reading: *"That's the demo-environment story from the story-bank, repurposed as cover-letter narrative."*
5. Show the third paragraph (Polaris-specific angle). Say: *"And this paragraph references specific things from the research report — the SE-led discovery motion. That's the level of personalization the skill is doing automatically."*

- [ ] Stop recording. Review.

### Beat 7 — interview-coach demo (7:30–9:00) · PiP

- [ ] Start recording

**Screen actions:**

1. Show Avery's `story-bank.md` briefly. Say: *"Avery has three stories in the story-bank — Docker demo refactor, PoC restructuring, integration guide. Behavioral evidence."*
2. Invoke `interview-coach`. Say: *"Now we generate a prep brief specifically for the Polaris Data interview."*
3. Watch the brief generate. Open it.
4. Show the likely questions section. **Read one question aloud.** Suggestion: pick one that maps to the demo-refactor story. Say: *"And this brief tells Avery which story to lead with — pulling from the story-bank we just looked at."*
5. Show how a story is matched to a question. Say: *"That's the value — not generic STAR templates, but Avery's actual stories pre-mapped to the interview's likely questions."*

- [ ] Stop recording. Review.

### Beat 8 — applications.md + generate-docx (9:00–9:30) · PiP

- [ ] Start recording

**Screen actions:**

1. Open `applications.md`. Say: *"And the application is tracked — status applied, comp expected, next-action date."*
2. Open a terminal. Run the docx command:
   ```bash
   python scripts/generate-docx.py \
     examples/avery-castillo/my-documents/applications/polaris-data-senior-se/resume.md \
     examples/avery-castillo/my-documents/applications/polaris-data-senior-se/coverletter.md
   ```
   (Adjust paths to your test folder.)
3. **Show the `.docx` and `.pdf` files appearing in the application folder.** Say: *"Real Word doc, real PDF — these are what Avery actually attaches to the application."*
4. Open the PDF briefly to show the formatted output. Say: *"Professional output. Markdown source, no copy-paste."*

- [ ] Stop recording. Review.

### Beat 9 — Wrap (9:30–10:00) · FULL FRAME JIM

Word-for-word (memorize):

> "That's 10 minutes start to finish. Avery's full files are in examples slash avery dash castillo. Repo URL's below. If you've got your own application in mind, install the plugin and type 'Help me get started' — it'll take you from zero."

- [ ] Take 1
- [ ] Take 2
- [ ] Take 3

### Back-up before moving on

- [ ] Save Descript project
- [ ] Copy raw recordings to a separate drive or cloud sync

---

## Part 4: Recording — 2-min Setup (~20 min)

### Beat 1 — Open (0:00–0:15) · FULL FRAME JIM

Word-for-word:

> "There are two ways to install Job Hunt Skills. Pick the one that matches how you already work."

- [ ] Take 1
- [ ] Take 2

After this line, on-screen text will reveal: **"Path 1 — Claude Code (terminal) · Path 2 — Cowork (desktop app)"** (add in Descript).

### Beat 2 — Claude Code path (0:15–0:55) · FULL SCREEN TERMINAL

Single continuous take if possible. Type while talking.

- [ ] Start recording (terminal full-screen, large font)

**Commands in order — narrate each:**

1. `cd ~/dev/launch-shoot/test-folder` (or wherever)
   - *"First, cd into wherever you want your job-search files to live."*
2. `claude`
   - *"Start Claude Code."*
3. `/plugin marketplace add Remotivated/job-hunt-skills`
   - *"Add our marketplace."*
4. `/plugin install job-hunt-skills@job-hunt-skills`
   - *"Install the plugin."*
5. `/reload-plugins`
   - *"Reload."*
6. Type: `Help me get started.`
   - *"Now — plain language. Help me get started."*

- [ ] Stop recording. Review.
- [ ] Retake if any command failed or pacing was rough.

Captions for each command will be added in Descript.

### Beat 3 — Cowork path (0:55–1:45) · VOICE ONLY

You will overlay this on the existing `assets/cowork-setup.mp4` in Descript. Just record your voice timed to ~50 seconds.

- [ ] Start recording (camera optional — won't be used; audio is what matters)

Narrate the 6 steps in this order, pausing briefly between each:

1. *"Download the ZIP from our releases page — link in the description."*
2. *"Open Cowork and click Customize."*
3. *"Browse plugins, then choose the custom upload option."*
4. *"Select the ZIP you just downloaded."*
5. *"Cowork prompts you for a local folder — pick one, or create a new one. This is where all your job-search files will live."*
6. *"Ask 'Help me get started.'"*

- [ ] Stop recording. Review timing — should be 45-55 seconds end-to-end.

### Beat 4 — Close (1:45–2:00) · FULL FRAME JIM

Word-for-word:

> "Whichever path you took: type 'Help me get started.' Everything else flows from there. Repo URL's below."

- [ ] Take 1
- [ ] Take 2

URL bug to add in Descript: `github.com/Remotivated/job-hunt-skills`

---

## Part 5: Recording — 45s Hook (~30 min)

This video gets the most retakes. The opener and closer especially.

### Beat 1 — Opener (0:00–0:05) · FULL FRAME JIM

Word-for-word (memorize):

> "Most AI job-hunt tools auto-apply at scale, with hallucinations and slop. This is the opposite of that."

**Take at LEAST 5 takes.** This is the highest-leverage line in the launch.

- [ ] Take 1 (steady delivery)
- [ ] Take 2 (slightly punchier)
- [ ] Take 3 (slightly more relaxed)
- [ ] Take 4 (vary inflection on "opposite")
- [ ] Take 5 (your choice)
- [ ] Take 6 (optional)
- [ ] Take 7 (optional)

Pick the best in Descript later. Note timestamps of favorites here:

| Take | Notes |
|---|---|
| 1 | |
| 2 | |
| 3 | |
| 4 | |
| 5 | |

### Beat 2 — claim-check refusal (0:05–0:15) · PiP

Two options:

**A. Live screen recording**
- [ ] Re-use the canned recording from Part 2, OR
- [ ] Re-record with PiP Jim in corner and a fresh prompt

**B. Spliced canned**
- [ ] Drop the Part 2 canned MP4 in during editing; record only voiceover here

Voiceover (approx): *"Job Hunt Skills will check every claim against your real experience. When it can't find evidence, it tells you."*

- [ ] Record the voiceover separately if going B-route

Caption to burn in: **"It will tell you 'I have no evidence for this.'"**

### Beat 3 — Motion graphics insert (0:15–0:25) · MOTION GRAPHICS

You will overlay `assets/animations/hook-inserts/inserts.mp4` here. Just record voiceover.

Voiceover: *"Resume builder, company research, claim check, interview prep — one workflow, resume to offer. Every application makes the next one easier."*

- [ ] Record voiceover. Should land at ~10 seconds.

### Beat 4 — Real files (0:25–0:35) · MOTION GRAPHICS + B-ROLL

Continuing motion-graphics RealFiles beat, plus optional B-roll of the `.docx`/`.pdf` files materializing in Finder/Explorer.

Voiceover: *"Real DOCX and PDF you actually attach. Markdown source, professional output."*

- [ ] Record voiceover.
- [ ] Optional: capture 10 seconds of Finder/Explorer showing the application folder, with `resume.docx` and `cover-letter.pdf` visible. Save as `docs/launch/b-roll/files-in-explorer.mp4` (gitignored).

### Beat 5 — Closer (0:35–0:45) · FULL FRAME JIM

Word-for-word:

> "Open source. Free. Works with the Claude or ChatGPT subscription you already have. Link below."

**Take at LEAST 5 takes** — same logic as the opener.

- [ ] Take 1
- [ ] Take 2
- [ ] Take 3
- [ ] Take 4
- [ ] Take 5
- [ ] Take 6 (optional)
- [ ] Take 7 (optional)

### Back up

- [ ] Save Descript project
- [ ] Copy raw recordings to backup drive

---

## Part 6: Editing in Descript

### Walkthrough — Editing Checklist

- [ ] New Descript project: drop all walkthrough clips in order
- [ ] **Transcript-edit pass:**
  - [ ] Remove dead air (>2s silences)
  - [ ] Remove obvious filler ("um", "uh", "so") where they hurt pace
  - [ ] Tighten any beat running long — target total **8–10 min**
- [ ] **PiP layout pass:**
  - [ ] Beats 2–8 (screen content): Jim in lower-right PiP at ~25% size
  - [ ] Beats 1 (cold open) and 9 (wrap): full-frame Jim
- [ ] **Claim-check beat — extra care:**
  - [ ] The rejection text must be **clearly visible on screen for 3-5 seconds**
  - [ ] If spliced canned recording, ensure transition is seamless
  - [ ] This beat must read clearly even when scrubbed
- [ ] **Lower-thirds and on-screen text:**
  - [ ] Skill name appears each time a skill is invoked (e.g., "resume-builder", "claim-check")
  - [ ] File paths shown when files appear (e.g., `applications/polaris-data-senior-se/resume.md`)
  - [ ] "claim-check" beat gets a highlighted label during the keystone moment
- [ ] **Captions:** auto-generate, then review for accuracy on jargon (resume-tailor, MEDDPICC, etc.)
- [ ] Export rough cut at 1080p
- [ ] Watch end-to-end without editing — note anything needing a fix
- [ ] Fix and re-export final
- [ ] Save final as `~/Desktop/walkthrough.mp4` (or wherever Descript exports)

### 2-min Setup — Editing Checklist

- [ ] New Descript project: drop talking-head clips + terminal screen-rec
- [ ] **Drop `assets/cowork-setup.mp4` as full-screen overlay across 0:55–1:45**
  - [ ] The animation already has captions baked in — **do not add duplicate captions** over this section
- [ ] Sync your Cowork voiceover (Beat 3) over the animation
- [ ] Talking-head sections (0:00-0:15 and 1:45-2:00):
  - [ ] Add captions
  - [ ] Add on-screen text "Path 1 — Claude Code (terminal) · Path 2 — Cowork (desktop app)" during opener
  - [ ] Add URL bug `github.com/Remotivated/job-hunt-skills` during closer
- [ ] Terminal section (0:15-0:55):
  - [ ] Each command gets a caption as it runs
- [ ] Export at 1080p 16:9
- [ ] Save as `~/Desktop/setup-2min.mp4`

### 45s Hook — Editing Checklist

- [ ] New Descript project: drop **best** opener take, claim-check beat, **best** closer take
- [ ] **Drop `assets/animations/hook-inserts/inserts.mp4` starting at 0:15**
  - The inserts have correct timing baked in: WorkflowChips 0:15-0:20, Flywheel 0:20-0:25, RealFiles 0:25-0:35
- [ ] Sync your motion-graphics voiceover (Part 5 Beats 3-4) over the inserts
- [ ] **Burn captions on ALL sections** — this video gets watched muted on social
- [ ] Add brand-colored lower thirds (navy bg, white text)
- [ ] Optional: light percussive music bed at low volume — decide by ear
- [ ] **Export three aspect ratios:**

  | Output file | Aspect | Use |
  |---|---|---|
  | `~/Desktop/hook-16x9.mp4` | 16:9 | YouTube, LinkedIn long-form |
  | `~/Desktop/hook-1x1.mp4` | 1:1 | LinkedIn feed, Instagram |
  | `~/Desktop/hook-9x16.mp4` | 9:16 | YouTube Shorts, Reels, TikTok |

  For 1:1 and 9:16: re-frame full-frame Jim shots, reflow motion-graphics inserts. Descript's resize tools handle most of this.

- [ ] **View 9:16 cut on an actual phone** — not desktop preview — to verify readability

---

## Part 7: Publish

### Step 1 — Move exports into repo (gitignored)

```bash
mkdir -p assets/launch
mv ~/Desktop/walkthrough.mp4 assets/launch/walkthrough.mp4
mv ~/Desktop/setup-2min.mp4 assets/launch/setup-2min.mp4
mv ~/Desktop/hook-16x9.mp4 assets/launch/hook-16x9.mp4
mv ~/Desktop/hook-1x1.mp4 assets/launch/hook-1x1.mp4
mv ~/Desktop/hook-9x16.mp4 assets/launch/hook-9x16.mp4
```

### Step 2 — YouTube uploads

- [ ] **45s hook video** — upload **unlisted first**, switch to public after social posts are live
- [ ] **2-min setup video** — public
- [ ] **8–10 min walkthrough** — public
- [ ] Use the wrap line as each video's description opener
- [ ] Note the YouTube URLs:

| Video | YouTube URL |
|---|---|
| Hook | |
| Setup | |
| Walkthrough | |

### Step 3 — Generate Avery's resume PDF + thumbnail

The walkthrough should have created `examples/avery-castillo/my-documents/applications/polaris-data-senior-se/resume.pdf`. If not, run:

```bash
python scripts/generate-docx.py examples/avery-castillo/my-documents/applications/polaris-data-senior-se/resume.md
```

- [ ] Render first page as PNG (any tool — Preview/Photoshop screenshot is fine)
- [ ] Save as `examples/screenshots/avery-castillo-resume.png`

### Step 4 — Final README update

- [ ] Add the 4th `<img>` to the Example Outputs section (reflow widths from 32% to 24%)
- [ ] Replace the text-only Avery caption with the 4-column caption (per plan Task 37 Step 3)
- [ ] Add walkthrough link below hero loop:
  ```markdown
  **Watch the 10-minute walkthrough:** [Job Hunt Skills end-to-end with Avery Castillo](https://www.youtube.com/watch?v=...) — same flow you'll run on your own materials.
  ```
- [ ] Commit and push

### Step 5 — Social posts

- [ ] **LinkedIn:** post the **1:1 hook video** with caption pointing to repo URL. Anti-AI-slop angle + install instructions.
- [ ] **X:** post the **1:1 hook video**, shorter caption, same repo URL.
- [ ] **Subscribers (Remotivated):** headline the walkthrough, include install instructions for both Claude Code and Cowork paths.

### Step 6 — Monitor (24–48h)

- [ ] GitHub README — verify hero loop and Cowork animation autoplay across browsers
- [ ] Social posts — engagement, install issues raised in replies
- [ ] GitHub issues / discussions — respond to install confusion fast
- [ ] Flip the hook video from unlisted to public on YouTube once social is humming

---

## Reference: existing script files

These remain the canonical "what's the message" docs — this checklist consolidates them with the production steps.

- [hook-45s.md](scripts/hook-45s.md)
- [setup-2min.md](scripts/setup-2min.md)
- [walkthrough.md](scripts/walkthrough.md)
