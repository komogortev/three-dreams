# Cinematography Reference — Phase 4C

Research date: 2026-04-12
Purpose: Shot vocabulary and parameter reference for `CinematicCameraRig` implementation.

---

## 1. Shot Vocabulary (Dialog-Relevant)

| Shot Name | Framing | Primary Use | Emotional Register |
|---|---|---|---|
| **Establishing Shot** | Wide — both characters + environment | Scene opener; orient the player | Neutral, context-setting |
| **Two-Shot** | Both characters in frame, medium distance | Simultaneous reaction; duo dynamic | Equal weight, comedic or tense |
| **Medium Shot** | Waist up | Back-and-forth dialog | Balanced — body language + face |
| **Medium Close-Up** | Chest/shoulder up | Intimate dialog | Warmth, connection without intensity |
| **Close-Up** | Face fills frame | Emotional peak, reaction | Intensity, vulnerability, revelation |
| **Over-the-Shoulder (OTS)** | Camera behind one character, framing the other | Classic dialog exchange | Establishes eyeline, grounded POV |
| **Reaction Shot** | Cut to listening character | Emotional beat confirmation | Empathy, subtext |

---

## 2. Camera Movement Patterns

| Movement | Description | Emotional Effect | Speed |
|---|---|---|---|
| **Static** | Camera locked in place | Stability, tension through stillness | N/A |
| **Dolly in** | Camera moves toward subject | Intimacy, revelation, isolation | Slow = dread/intimacy; fast = shock |
| **Dolly out** | Camera pulls back from subject | Loss, overwhelm, solitude | Slow = melancholy |
| **Arc / orbit** | Camera circles subject (60-180 deg) | Heightens tension; conveys mental state; catharsis | Slow = introspection; fast = chaos |
| **Drift / float** | Gentle continuous drift during static scene | Alive, breathing world feel | Very slow, barely perceptible |

---

## 3. Hard Rules

### 180-Degree Rule
All cameras must stay on the same side of the axis between two characters. Violating this disorients the viewer — they lose track of who is left/right.

### Eyeline Match
When character A looks at B, the OTS shot of B must frame A looking in the correct direction relative to the cut.

### Rule of Thirds
Subject placed on grid intersections, not centered. Creates natural tension and leads the eye. (Centering = authority/confrontation — use intentionally.)

---

## 4. Transition Types

| Transition | Technique | Feel |
|---|---|---|
| **Cut** | Instant switch | Neutral, rhythmic, editorial |
| **Blend / cross-fade** | Lerp between two camera positions | Dreamlike, soft, cinematic |
| **Dolly blend** | Move into new position while fading | Continuity, seamless immersion |
| **Hard snap** | Instant with no interpolation | Jarring — intentional shock |

---

## 5. Game-Specific Conventions

### Priority-Based Camera Switching (Cinemachine Pattern)
Gameplay camera runs at base priority. Dialog camera activates at higher priority. On dialog end, gameplay camera resumes. This is the dominant pattern across game frameworks.

### Shot Sequencing per Conversation Beat
Establish → OTS speaker 1 → OTS speaker 2 → reaction close-up → pull back to two-shot for resolution. Standard film grammar adapted to games.

### Arc on Greeting / Reveal
Arc shot at slow speed around subject is the canonical "reveal" or "arrival" shot. Used for game intros, boss reveals, NPC introductions. Typical parameters: radius ~2-4m, 60-120 deg sweep, 2-4 seconds.

### No-Cut Continuous Camera (God of War Style)
Single continuous camera — no cuts ever. Keeps player spatially grounded but sacrifices reaction shot intimacy. Very high skill to execute well.

---

## 6. Scene-01 Shot Map (Draft — to be calibrated in R-2)

| Scene Moment | Recommended Shot | Movement | Duration | Notes |
|---|---|---|---|---|
| Player approaches NPC | Establishing / wide two-shot | Dolly in gently | 2-3s | Orient player in space |
| NPC greeting begins | Medium OTS (NPC faces player) | Static or slow drift | 1-2s | 180-degree rule applies |
| NPC delivers key line | Medium close-up on NPC | Slow dolly in | 2-4s | Emotional focus |
| Player response / reaction | OTS reverse (player faces NPC) | Static | 1-2s | Eyeline match |
| Emotional peak | Close-up on NPC face | Static or barely drifting | 1-3s | Use sparingly |
| Dialog resolves | Pull back to two-shot or wide | Dolly out | 1-2s | Release tension |
| Return to gameplay | Blend back to gameplay camera | Priority transition | 0.5-1s | Seamless handoff |

---

## 7. Next Session Plan: R-2 → R-4

### R-2 — Taxonomy Distillation
Pick 4-6 shot archetypes from the vocabulary above that map to `three-dreams` scene-01:
- NPC greeting / reveal (arc)
- Dialog exchange (OTS pair)
- Emotional peak (close-up)
- Resolution / return (dolly out + blend)

Define each as a named `ShotPreset` with concrete parameter ranges.

### R-3 — Technical Parameter Mapping
Map each `ShotPreset` to `CinematicCameraRig` API surface:
- `positionOffset` (relative to subject/player)
- `lookAtTarget` (what the camera focuses on)
- `fov` range
- `duration` + easing curve type
- `transitionType` (cut / blend / dolly)

### R-4 — Spec Output
Write `CinematicCameraRig` API contract + `ShotPreset` type definitions. This becomes the implementation spec for 4C-1 through 4C-5.

---

## Sources
- [Popular camera angles in video games — Behind The Scenes](https://behind-the-scenes.net/popular-camera-angles-used-in-video-games/)
- [Cinematography in Games — Game Developer](https://www.gamedeveloper.com/design/cinematography-in-games)
- [Cinemachine Conversation Setup — Unity Discussions](https://discussions.unity.com/t/best-cinemachine-setup-for-character-conversations-3d/1587657)
- [God of War Single-Shot Camera — Push Square](https://www.pushsquare.com/news/2021/09/god-of-war-ragnaroks_camera_is_a_single_shot_from_start_to_finish_just_like_the_last_game)
- [The Arc Shot — StudioBinder](https://www.studiobinder.com/blog/arc-shot-in-film-definition/)
- [Dynamic Dialogue Scenes — Clint Till](https://clinttill.net/blog/2019/7/23/heres-how-to-make-dialogue-scenes-more-dynamic)
- [Camera Shots Guide — StudioBinder](https://www.studiobinder.com/blog/ultimate-guide-to-camera-shots/)
- [Cutscene Sequences — Pixel Crushers](https://www.pixelcrushers.com/dialogue_system/manual2x/html/cutscene_sequences.html)
