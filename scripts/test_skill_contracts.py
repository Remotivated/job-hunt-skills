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
            "resume-drift-check",
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
        # `resume-drift-check` is the documented internal exception that does not
        # follow the user-facing "Use when ..." trigger pattern.
        TRIGGER_EXEMPT = {"resume-drift-check"}
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
            if skill_dir.name not in TRIGGER_EXEMPT:
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
        drift = read(SKILLS / "resume-drift-check" / "SKILL.md")

        self.assertIn("format variants of the same work-document concept", state)
        self.assertIn("{document_filename}", tailor)
        self.assertIn("my-documents/applications/{id}/{document_filename}", tailor)
        self.assertIn("`my-documents/applications/*/cv.md`", drift)

        all_skills = "\n".join(read(path) for path in SKILLS.glob("*/SKILL.md"))
        self.assertNotIn("Tailored CVs are not produced", all_skills)
        self.assertNotIn("Git history on the canonical", all_skills)


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
