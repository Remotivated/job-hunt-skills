#!/usr/bin/env python3
"""Contract checks for Job Hunt Skills skill docs.

These tests catch the repo-level invariants that are easy to break when
editing prose skills: skill discovery frontmatter, state-layer naming,
story-bank schema drift, and resume/CV format handling.
"""

from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SKILLS = ROOT / "skills"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


class ProviderCompatibilityTests(unittest.TestCase):
    def test_proof_asset_handoff_is_provider_neutral(self) -> None:
        text = read(SKILLS / "proof-asset-creator" / "SKILL.md")
        self.assertNotRegex(text, r"(?i)\bClaude\b")
        self.assertNotIn("normal agent conversation", text)
        self.assertNotIn("current agent conversation", text)
        self.assertGreaterEqual(text.count("fresh agent conversation"), 4)

    def test_workspace_recovery_covers_codex_and_existing_claude_surfaces(self) -> None:
        state = read(SKILLS / "_shared" / "state-layer.md")
        get_started = read(SKILLS / "get-started" / "SKILL.md")
        scaffold = read(ROOT / "scripts" / "scaffold-state.mjs")
        for label, text in (("state-layer", state), ("get-started", get_started)):
            self.assertRegex(
                text,
                r"(?i)\*\*Codex CLI/IDE:\*\*[^\n]*(?:open|cd)[^\n]*folder"
                r"[^\n]*start Codex",
                label,
            )
            self.assertRegex(
                text,
                r"(?i)\*\*Desktop agents with folder controls[^\n]*:\*\*"
                r"[^\n]*folder/workspace control[^\n]*select a folder"
                r"[^\n]*start a new conversation",
                label,
            )
            self.assertRegex(
                text,
                r"(?i)\*\*Claude Code:\*\*[^\n]*cd[^\n]*chosen folder"
                r"[^\n]*run `claude`",
                label,
            )

        for pattern in (
            r"Codex CLI/IDE:[^\n]*open or cd[^\n]*job-hunt folder[^\n]*start Codex",
            r"Desktop agent:[^\n]*select a folder[^\n]*folder/workspace control"
            r"[^\n]*start again",
            r"Claude Code:[^\n]*cd[^\n]*job-hunt folder[^\n]*run 'claude'",
        ):
            self.assertRegex(scaffold, pattern)

    def test_workspace_recovery_preserves_confirmation_hard_stop(self) -> None:
        state = read(SKILLS / "_shared" / "state-layer.md")
        get_started = read(SKILLS / "get-started" / "SKILL.md")

        for phrase in (
            "Confirm the path with the user before scaffolding.",
            "wait for explicit acceptance",
            "surface the message verbatim to the user and stop",
            "Do not retry",
        ):
            self.assertIn(phrase, state)

        for phrase in (
            "do not scaffold until they have confirmed a real folder",
            "stop until they come back",
            "Wait for the user to fix the folder",
            "surface that message verbatim and go back to 3c",
        ):
            self.assertIn(phrase, get_started)


class SkillDiscoveryTests(unittest.TestCase):
    def test_required_user_facing_skills_exist(self) -> None:
        expected = {
            "get-started",
            "resume-builder",
            "resume-tailor",
            "cover-letter",
            "company-research",
            "interviewing",
            "interview-coach",
            "resume-auditor",
            "linkedin-optimizer",
            "proof-asset-creator",
            "claim-check",
        }
        actual = {
            path.name
            for path in SKILLS.iterdir()
            if path.is_dir() and not path.name.startswith("_")
        }
        self.assertTrue(expected.issubset(actual), expected - actual)

    def test_skill_name_matches_folder(self) -> None:
        for skill_dir in SKILLS.iterdir():
            if not skill_dir.is_dir() or skill_dir.name.startswith("_"):
                continue
            skill_md = skill_dir / "SKILL.md"
            self.assertTrue(skill_md.exists(), skill_md)
            text = read(skill_md)
            match = re.search(r"^name:\s*(\S+)\s*$", text, re.MULTILINE)
            self.assertIsNotNone(match, skill_md)
            self.assertEqual(skill_dir.name, match.group(1), skill_md)

    def test_skill_description_present_and_routable(self) -> None:
        for skill_dir in SKILLS.iterdir():
            if not skill_dir.is_dir() or skill_dir.name.startswith("_"):
                continue
            skill_md = skill_dir / "SKILL.md"
            text = read(skill_md)
            fm = re.match(r"\A---\r?\n(.*?)\r?\n---", text, re.DOTALL)
            self.assertIsNotNone(fm, f"{skill_md}: missing YAML frontmatter")
            block = fm.group(1)
            desc_match = re.search(
                r"^description:\s*(.+?)(?=\n\S|\Z)",
                block,
                re.DOTALL | re.MULTILINE,
            )
            self.assertIsNotNone(desc_match, f"{skill_md}: missing description")
            description = " ".join(desc_match.group(1).split())
            self.assertGreaterEqual(
                len(description),
                60,
                f"{skill_md}: description too short to route ({len(description)} chars)",
            )
            self.assertTrue(
                description.startswith("Use when "),
                f"{skill_md}: description must start with 'Use when ' "
                f"(got: {description[:40]!r})",
            )


class StateLayerContractTests(unittest.TestCase):
    def test_reports_use_report_id_not_application_id_alias(self) -> None:
        state = read(SKILLS / "_shared" / "state-layer.md")
        self.assertIn("report_id: 007", state)
        self.assertIn("Do not use `id` for application slugs", state)

        for skill_md in SKILLS.glob("*/SKILL.md"):
            text = read(skill_md)
            self.assertNotIn("Frontmatter: `id`", text, skill_md)
            self.assertNotIn("frontmatter: `id`", text, skill_md)
            self.assertNotIn("Frontmatter fields: `id`", text, skill_md)

    def test_story_bank_schema_is_single_sourced(self) -> None:
        state = read(SKILLS / "_shared" / "state-layer.md")
        scaffold = read(ROOT / "scripts" / "scaffold-state.mjs")

        for text in (state, scaffold):
            self.assertIn("Schema - one section per story", text)
            self.assertIn("## {Short memorable title}", text)
            self.assertIn("usage: []", text)
            self.assertNotIn("distributed-team-migration", text)

    def test_applications_tracker_schema_is_canonical(self) -> None:
        # Canonical column order: id, company, role, status, comp_expected,
        # source, next_action_date, updated, link.
        # `my-documents/applications.md` is gitignored (per-user), so the only
        # tracked, authoritative sources are state-layer.md and scaffold-state.mjs.
        canonical_columns = (
            "| id | company | role | status | comp_expected | source "
            "| next_action_date | updated | link |"
        )
        state = read(SKILLS / "_shared" / "state-layer.md")
        scaffold = read(ROOT / "scripts" / "scaffold-state.mjs")

        for label, text in (
            ("state-layer.md", state),
            ("scaffold-state.mjs", scaffold),
        ):
            self.assertIn(
                canonical_columns,
                text,
                f"{label}: applications.md schema header drifted from canonical "
                f"9-column form (id, company, role, status, comp_expected, "
                f"source, next_action_date, updated, link)",
            )

        # Back-compat rule must be documented in the state-layer so skills know
        # how to handle older 6-column tables in the wild.
        self.assertIn(
            "missing one or more of `comp_expected`, `source`, or `next_action_date`",
            state,
            "state-layer.md: missing back-compat rule for old tracker schemas",
        )

    def test_resume_cv_are_format_variants(self) -> None:
        state = read(SKILLS / "_shared" / "state-layer.md")
        tailor = read(SKILLS / "resume-tailor" / "SKILL.md")
        claim_check = read(SKILLS / "claim-check" / "SKILL.md")

        self.assertIn("format variants of the same work-document concept", state)
        self.assertIn("{document_filename}", tailor)
        self.assertIn("my-documents/applications/{id}/{document_filename}", tailor)
        self.assertIn("`my-documents/applications/*/cv.md`", claim_check)

        all_skills = "\n".join(read(path) for path in SKILLS.glob("*/SKILL.md"))
        self.assertNotIn("Tailored CVs are not produced", all_skills)
        self.assertNotIn("Git history on the canonical", all_skills)


class VariantDisciplineTests(unittest.TestCase):
    """A/B variants for high-leverage angle decisions: LinkedIn headline,
    LinkedIn About hook, LinkedIn About full draft, and cover letter
    opening. The discipline rests on prose contracts — these checks make
    sure the load-bearing terms ("variant", "angle label", "3 variants")
    don't quietly disappear from the SKILL.md files."""

    def test_linkedin_optimizer_specifies_variant_discipline(self) -> None:
        text = read(SKILLS / "linkedin-optimizer" / "SKILL.md")
        self.assertIn("3 variants", text,
                      "linkedin-optimizer must specify a 3-variant default")
        self.assertIn("angle label", text,
                      "linkedin-optimizer must specify the angle-label discipline")
        # The three places variants apply.
        self.assertRegex(text, r"(?si)\*\*Headline\*\*.{0,800}?\b3 variants\b",
                         "headline section must specify 3 variants")
        self.assertRegex(text, r"(?si)above-the-fold.*hook.*3 variants",
                         "About above-the-fold hook must specify 3 variants")
        self.assertRegex(text, r"(?si)full About draft.*3 full-draft variants",
                         "About full draft must specify 3 variants")

    def test_resume_tailor_specifies_cover_letter_opening_variants(self) -> None:
        text = read(SKILLS / "resume-tailor" / "SKILL.md")
        self.assertIn("Opening paragraph variants", text,
                      "resume-tailor must define cover-letter opening variants")
        self.assertIn("3 variants", text,
                      "resume-tailor must specify 3 opening variants")
        self.assertIn("angle label", text,
                      "resume-tailor must specify the angle-label discipline")

    def test_reports_log_variants_and_choice(self) -> None:
        # Both skills must record all variants + the user's pick in their
        # report so a future rerun can revisit unchosen angles.
        linkedin = read(SKILLS / "linkedin-optimizer" / "SKILL.md")
        tailor = read(SKILLS / "resume-tailor" / "SKILL.md")
        for label, text in (("linkedin-optimizer", linkedin),
                            ("resume-tailor", tailor)):
            self.assertRegex(
                text,
                r"(?si)record all (opening )?variants.*mark which one the user chose",
                f"{label}: report must log all variants + the user's choice",
            )


class ProgressRewardContractTests(unittest.TestCase):
    """The progress/reward loop (state-layer §11) is a prose contract spread
    across the shared file and the skills. These checks keep the load-bearing
    pieces from silently disappearing: the §11 section itself, the
    anti-volume guardrail, the profile-strength script it points at, and the
    closing beats in the skills that write to the state layer."""

    def test_state_layer_defines_section_11(self) -> None:
        state = read(SKILLS / "_shared" / "state-layer.md")
        self.assertIn("## 11. Progress and Reward", state)
        self.assertIn("profile-strength.mjs", state)
        # The truthful-search guardrail must be explicit: reward depth and
        # follow-through, never raw application volume.
        self.assertRegex(
            state,
            r"(?i)never reward raw application count|reward depth and follow-through, never volume",
            "state-layer §11 must forbid rewarding raw application volume",
        )
        # Both closing beats named.
        self.assertIn("What you just unlocked", state)
        self.assertIn("Strength + next unlock", state)

    def test_profile_strength_script_exists_and_is_wired(self) -> None:
        script = ROOT / "scripts" / "profile-strength.mjs"
        self.assertTrue(script.exists(), script)
        text = read(script)
        # The three CLI surfaces skills call.
        for flag in ("--pulse", "--json"):
            self.assertIn(flag, text, f"profile-strength.mjs must support {flag}")
        pkg = read(ROOT / "package.json")
        self.assertIn("profile-strength.mjs", pkg,
                      "package.json must expose the profile-strength script")

    def test_state_writing_skills_close_with_reward_beats(self) -> None:
        # Every skill that writes to my-documents/ links §11 at its close so
        # the loop stays consistent instead of each skill reinventing it.
        expected = {
            "get-started",
            "resume-builder",
            "resume-tailor",
            "resume-auditor",
            "company-research",
            "interviewing",
            "interview-coach",
            "linkedin-optimizer",
            "proof-asset-creator",
        }
        for name in expected:
            text = read(SKILLS / name / "SKILL.md")
            self.assertIn(
                "#11-progress-and-reward",
                text,
                f"{name}: must reference state-layer §11 (progress/reward beats)",
            )

    def test_tracker_writing_skills_print_the_pulse(self) -> None:
        # Skills that upsert applications.md surface the momentum pulse.
        for name in ("resume-tailor", "company-research", "interviewing"):
            text = read(SKILLS / name / "SKILL.md")
            self.assertIn(
                "--pulse",
                text,
                f"{name}: must print the tracker momentum pulse after writing "
                f"applications.md",
            )


class FastPathContractTests(unittest.TestCase):
    """The fast path (issue #30) is what cuts time-to-first-wow. These checks
    keep get-started's two-door routing and resume-tailor's in-chat quick
    mode from regressing back to interview-first."""

    def test_get_started_offers_the_fast_path(self) -> None:
        text = read(SKILLS / "get-started" / "SKILL.md")
        self.assertIn("fast path", text.lower())
        # The fast path must run before any disk write / preflight.
        self.assertRegex(
            text,
            r"(?i)in-chat first|nothing is written to disk until",
            "get-started fast path must run in-chat before touching disk",
        )
        # Routing description must admit resume+posting first-timers.
        fm = re.match(r"\A---\r?\n(.*?)\r?\n---", text, re.DOTALL).group(1)
        self.assertIn("tailor it for this job", fm,
                      "get-started description must route pasted resume+posting users")

    def test_resume_tailor_defines_quick_mode(self) -> None:
        text = read(SKILLS / "resume-tailor" / "SKILL.md")
        self.assertIn("Quick-tailor mode", text)
        self.assertRegex(
            text,
            r"(?i)no scaffold|nothing (is )?written to disk|no preflight",
            "resume-tailor quick mode must skip scaffold/preflight",
        )
        # The read-back → before/after → honest-flag output shape.
        self.assertIn("read-back", text.lower())
        self.assertIn("before/after", text.lower())


class PublicDocsContractTests(unittest.TestCase):
    def test_docs_expose_user_facing_wrappers(self) -> None:
        readme = read(ROOT / "README.md")
        getting_started = read(ROOT / "GETTING-STARTED.md")

        self.assertIn("skills/claim-check/SKILL.md", readme)
        self.assertIn("skills/cover-letter/SKILL.md", readme)
        self.assertIn("skills/interviewing/SKILL.md", readme)
        self.assertNotIn("Downstream tailoring is strongest", getting_started)
        self.assertIn("Resume And CV Formats", getting_started)


if __name__ == "__main__":
    unittest.main(verbosity=2)
