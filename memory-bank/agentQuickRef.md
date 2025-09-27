# Agent Quick Reference (Weave Studio)

## How to Work
1) PLAN → Show short plan, file list, synthetic diff, rollback plan.
2) WAIT → Do not write/run/commit until I approve.
3) ACT → Make only approved edits, then run the one approved command.
4) COMMIT → One small commit per sub-step (see format).
5) UPDATE → If we added a pattern/decision, note it in activeContext.md.

## Guardrails
- No auto-commits. Ask permission for writes/runs.
- If unsure at any point, stop and ask. Do not guess.
- If >5 files or >120 lines would change, stop and ask.

## CSS/JS
- Component-scoped CSS; logical props; dark mode inherits.
- JS is vanilla, tiny (≤3KB gz), lazy-loaded, and a11y-friendly.

## Commit Formats
- Sub-step: type(scope): summary  (≤50 chars)
- End-of-phase:
  Subject (≤50): type(scope): <result>
  Body: 3–5 bullets, each ≤72 chars.
