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
