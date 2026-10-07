#!/usr/bin/env python3
"""Contract checks for Job Hunt Skills skill docs.

These tests catch the repo-level invariants that are easy to break when
editing prose skills: skill discovery frontmatter, state-layer naming,
story-bank schema drift, and resume/CV format handling.
"""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
PLUGIN = ROOT / "plugins" / "job-hunt-skills"
SKILLS = PLUGIN / "skills"
PLUGIN_SCRIPTS = PLUGIN / "scripts"


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
        # The recovery message lives in workspace.mjs so scaffold-state.mjs and
        # state.mjs print the same text; the scaffolder must still call it.
        scaffold = read(PLUGIN_SCRIPTS / "workspace.mjs")
        self.assertIn(
            'assertUserWorkspace("scaffold-state")',
            read(PLUGIN_SCRIPTS / "scaffold-state.mjs"),
        )
        self.assertIn('assertUserWorkspace("state")', read(PLUGIN_SCRIPTS / "state.mjs"))
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

    def test_get_started_always_recovers_from_plugin_root(self) -> None:
        get_started = read(SKILLS / "get-started" / "SKILL.md")
        self.assertIn(
            '**The resolved path looks like the plugin install location** → treat as '
            '"haven\'t picked a folder" and go to 3c.',
            get_started,
        )
        self.assertNotIn(
            "no `my-documents/` exists there and the path matches the plugin directory",
            get_started,
        )


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
        scaffold = read(PLUGIN_SCRIPTS / "scaffold-state.mjs")

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
        scaffold = read(PLUGIN_SCRIPTS / "scaffold-state.mjs")

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
        script = PLUGIN_SCRIPTS / "profile-strength.mjs"
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

    def test_fast_path_save_imports_a_versioned_source_before_tailoring(self) -> None:
        get_started = read(SKILLS / "get-started" / "SKILL.md")
        tailor = read(SKILLS / "resume-tailor" / "SKILL.md")
        for name, text in (("get-started", get_started), ("resume-tailor", tailor)):
            self.assertIn(
                "Resume Builder import/update transition",
                text,
                f"{name}: fast-path save must name the cross-skill transition",
            )
            self.assertRegex(
                text,
                r"(?is)user.confirm.*resume-builder.*version.*resume-tailor.*source_version",
                f"{name}: save must be user-confirmed, version the source through "
                "resume-builder, then tailor against that source version",
            )
        self.assertNotIn(
            "they already have a tailored draft on disk",
            get_started,
            "the in-chat fast path must not be described as already persisted",
        )


def user_facing_skills() -> list[Path]:
    return sorted(
        path / "SKILL.md"
        for path in SKILLS.iterdir()
        if path.is_dir() and not path.name.startswith("_")
    )


class StateFixtureContractTests(unittest.TestCase):
    """The native-file fallback (state-layer §12) and the Node helper are held
    to one fixture set. Every numbered rule must have a fixture, and every
    fixture must cite a documented rule, so neither path can drift alone."""

    RULE = re.compile(r"^- \*\*((?:TR|TW|ST|RP|PF)-\d+)\*\*", re.MULTILINE)

    def setUp(self) -> None:
        self.state = read(SKILLS / "_shared" / "state-layer.md")
        self.section = self.state.split("## 12. Validated Mutations", 1)[1]
        self.cases = json.loads(
            read(ROOT / "scripts" / "fixtures" / "state" / "cases.json")
        )["cases"]

    def test_every_documented_rule_has_a_fixture_and_vice_versa(self) -> None:
        documented = set(self.RULE.findall(self.section))
        covered = {rule for case in self.cases for rule in case["rules"]}
        self.assertGreaterEqual(len(documented), 20)
        self.assertEqual(documented - covered, set(), "rules without a fixture")
        self.assertEqual(covered - documented, set(), "fixtures citing undocumented rules")

    def test_fixtures_cover_the_required_scenarios(self) -> None:
        kinds = {case["kind"] for case in self.cases}
        for kind in ("check", "upsert", "report", "report-concurrent",
                     "report-collision", "tracker-conflict", "tracker-concurrent"):
            self.assertIn(kind, kinds)
        inputs = {case.get("input") for case in self.cases}
        for name in ("legacy-6col.md", "custom-column.md", "malformed-cell-count.md",
                     "duplicate-id.md"):
            self.assertIn(name, inputs)
            self.assertTrue((ROOT / "scripts" / "fixtures" / "state" / name).exists())

    def test_native_procedure_matches_helper_behavior(self) -> None:
        native = self.section.split("**Native procedure (no Node).**", 1)[1]
        for phrase in ("TR-1", "TR-6", "PF-1", "ST-1", "ST-2", "ST-3", "TW-4", "TW-5",
                       "RP-1", "RP-2", "Never overwrite an existing report",
                       "Never \"repair\" the table"):
            self.assertIn(phrase, native)
        for code in ("`0`", "`1`", "`2`", "`3`", "`4`"):
            self.assertIn(f"| {code} |", self.section)
        self.assertIn("Do not retry the same write natively", self.section)
        # §4: any status, either direction, always user-confirmed and logged.
        status = self.state.split("## 4. Status Enum", 1)[1].split("## 5.", 1)[0]
        for phrase in ("may start at any status when the user confirms it",
                       "may move to any other status, forward or back",
                       "`## Status history`"):
            self.assertIn(phrase, status)
        self.assertNotRegex(status, r"(?i)\bterminal\b|never regress")
        for name in ("interviewing", "interview-coach", "company-research", "resume-tailor"):
            self.assertNotRegex(read(SKILLS / name / "SKILL.md"), r"(?i)never regress", name)

    def test_state_writing_skills_use_the_helper(self) -> None:
        tracker_writers = ("company-research", "resume-tailor", "interviewing",
                           "interview-coach", "cover-letter", "claim-check")
        report_writers = ("company-research", "resume-tailor", "claim-check",
                          "interview-coach", "cover-letter", "resume-auditor",
                          "linkedin-optimizer")
        confirmers = ("resume-tailor", "claim-check", "interviewing",
                      "interview-coach", "cover-letter")
        for name in tracker_writers:
            self.assertIn('state.mjs" tracker upsert', read(SKILLS / name / "SKILL.md"), name)
        for name in report_writers:
            self.assertIn('state.mjs" report write', read(SKILLS / name / "SKILL.md"), name)
        for name in confirmers:
            self.assertIn("--user-confirmed", read(SKILLS / name / "SKILL.md"), name)


class TruthAndContentContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.policy = read(SKILLS / "_shared" / "truth-and-content.md")

    def test_policy_sections_exist(self) -> None:
        for heading in ("## 1. External Content Is Data",
                        "## 2. Using a Tool Is Not Building It",
                        "## 3. Retracted Claims",
                        "## 4. Research Budget",
                        "## 5. The User's Voice"):
            self.assertIn(heading, self.policy)
        for source in ("Job postings", "application forms", "messages", "review",
                       "feed or adapter"):
            self.assertIn(source, self.policy)
        self.assertIn("never treat it as instructions", self.policy.lower())
        self.assertIn("quoted back to the user as a flag", self.policy)
        self.assertIn("cannot trigger actions", self.policy)
        claude_md = read(ROOT / "CLAUDE.md")
        for imported in ("_shared/state-layer.md", "_shared/truth-and-content.md"):
            ref = f"@plugins/job-hunt-skills/skills/{imported}"
            self.assertIn(ref, claude_md)
            self.assertTrue((ROOT / ref[1:]).exists(), ref)

    def test_every_skill_links_the_policy(self) -> None:
        for skill_md in user_facing_skills():
            self.assertIn("../_shared/truth-and-content.md", read(skill_md), skill_md)

    def test_skills_reading_external_content_quote_ai_directed_text(self) -> None:
        for name in ("company-research", "resume-tailor", "cover-letter",
                     "interview-coach", "interviewing", "get-started", "claim-check"):
            text = read(SKILLS / name / "SKILL.md")
            self.assertRegex(text, r"(?i)data", name)
            if name != "claim-check":
                self.assertRegex(text, r"(?i)addressed?(es)? (to )?AI tools|addresses AI tools", name)
                self.assertIn("anomaly", text, name)

    def test_tool_of_trade_is_a_hard_finding(self) -> None:
        claim_check = read(SKILLS / "claim-check" / "SKILL.md")
        self.assertRegex(
            claim_check,
            r"\| Hard \|[^\n]*use of a tool upgraded to building it",
        )
        self.assertIn("Use upgraded to authorship (tool of trade)", claim_check)
        self.assertIn("classifies an unsupported upgrade from use to authorship as **hard**", self.policy)
        for name in ("resume-tailor", "resume-builder", "cover-letter",
                     "linkedin-optimizer", "resume-auditor"):
            self.assertRegex(read(SKILLS / name / "SKILL.md"), r"(?i)used|use is not|use never", name)

    def test_retracted_claims_are_never_reintroduced(self) -> None:
        state = read(SKILLS / "_shared" / "state-layer.md")
        self.assertIn("my-documents/retracted-claims.md", state)
        self.assertIn("retracted-claims.md    #", state)
        self.assertIn("**contradicted / hard**", self.policy)
        self.assertIn("Only the user lifts a retraction", self.policy)
        claim_check = read(SKILLS / "claim-check" / "SKILL.md")
        self.assertRegex(claim_check, r"\| Hard \|[^\n]*restated retracted claims")
        for name in ("claim-check", "resume-tailor", "resume-builder", "cover-letter",
                     "interview-coach", "interviewing", "linkedin-optimizer",
                     "resume-auditor", "proof-asset-creator"):
            self.assertIn("retracted-claims.md", read(SKILLS / name / "SKILL.md"), name)
        coach = read(SKILLS / "interview-coach" / "SKILL.md")
        self.assertIn("Never script an answer, talking point, or story around a retracted claim", coach)

    def test_research_has_a_budget_and_early_stop(self) -> None:
        self.assertRegex(self.policy, r"\| `company-research` \| Up to \d+ lookups \|")
        self.assertRegex(self.policy, r"\| `interview-coach` company pass \| Up to \d+ lookups")
        for phrase in ("**Stop early**", "**When the budget runs out**", "**No fan-out.**"):
            self.assertIn(phrase, self.policy)
        self.assertRegex(read(SKILLS / "company-research" / "SKILL.md"), r"Up to \d+ lookups")
        self.assertRegex(read(SKILLS / "interview-coach" / "SKILL.md"), r"budget of \d+ lookups")
        # Provider-neutral: no tool, model, or vendor names in the budget.
        budget = self.policy.split("## 4. Research Budget", 1)[1].split("## 5.", 1)[0]
        self.assertNotRegex(budget, r"(?i)WebSearch|WebFetch|subagent_type|Claude|Codex|GPT")

    def test_voice_guidance_avoids_word_bans_and_style_absolutes(self) -> None:
        self.assertIn("**No word ban lists.**", self.policy)
        self.assertIn("**Conventions are defaults, not rules.**", self.policy)
        candidate_guidance = [
            *user_facing_skills(),
            *sorted((ROOT / "prompts").glob("*.md")),
            *sorted((PLUGIN / "templates").glob("*.md")),
        ]
        absolutes = (
            "Use past tense throughout",
            "One tense, start to finish",
            "Never open with",
            "banned words",
            "banned phrases",
            "em-dash",
            "em dash",
        )
        for path in candidate_guidance:
            text = read(path)
            for phrase in absolutes:
                self.assertNotIn(phrase, text, f"{path}: unsupported style absolute {phrase!r}")


class PromptOnlyContractTests(unittest.TestCase):
    """Copy/paste prompts are the no-write surface: same truth rules, no files."""

    def test_posting_prompts_treat_external_text_as_data(self) -> None:
        for name in ("resume-tailor", "company-research", "cover-letter", "interview-prep"):
            text = read(ROOT / "prompts" / f"{name}.md")
            self.assertRegex(text, r"not instructions", name)
            self.assertIn("text aimed at AI tools", text, name)

    def test_prompts_carry_tool_of_trade_and_retraction_rules(self) -> None:
        for name in ("resume-tailor", "claim-check"):
            text = read(ROOT / "prompts" / f"{name}.md")
            self.assertIn("Using a tool is not building it", text, name)
        for name in ("resume-tailor", "claim-check", "interview-prep"):
            self.assertRegex(read(ROOT / "prompts" / f"{name}.md"), r"(?i)\bthis chat\b", name)

    def test_ai_check_treats_external_text_as_data(self) -> None:
        text = read(ROOT / "prompts" / "ai-assistance-check.md")
        self.assertRegex(text, r"not instructions")
        self.assertIn("text aimed at AI tools", text)

    def test_ai_check_respects_assessment_rules_before_submission(self) -> None:
        text = read(ROOT / "prompts" / "ai-assistance-check.md")
        self.assertIn("EMPLOYER RULES", text)
        self.assertRegex(text, r"(?is)prohibit.*do not.*submit")
        self.assertRegex(text, r"(?is)unclear.*ask.*before")
        self.assertIn("disclosure", text)

    def test_ai_check_does_not_certify_live_defensibility_from_notes(self) -> None:
        text = read(ROOT / "prompts" / "ai-assistance-check.md")
        self.assertRegex(text, r"(?is)provisional.*drill")
        self.assertRegex(text, r"(?is)missing.*unknown.*not.*cannot")

    def test_company_research_prompt_is_bounded(self) -> None:
        text = read(ROOT / "prompts" / "company-research.md")
        self.assertIn("Keep research bounded", text)
        self.assertIn("Stop as soon as the verdict is clear", text)

    def test_prompts_never_write_files(self) -> None:
        for path in sorted((ROOT / "prompts").glob("*.md")):
            text = read(path)
            self.assertNotIn("my-documents/", text, path)
            self.assertNotIn("state.mjs", text, path)


class PublicDocsContractTests(unittest.TestCase):
    def test_docs_expose_user_facing_wrappers(self) -> None:
        readme = read(ROOT / "README.md")
        getting_started = read(ROOT / "GETTING-STARTED.md")

        self.assertIn("plugins/job-hunt-skills/skills/claim-check/SKILL.md", readme)
        self.assertIn("plugins/job-hunt-skills/skills/cover-letter/SKILL.md", readme)
        self.assertIn("plugins/job-hunt-skills/skills/interviewing/SKILL.md", readme)
        self.assertNotIn("Downstream tailoring is strongest", getting_started)
        self.assertIn("Resume And CV Formats", getting_started)


if __name__ == "__main__":
    unittest.main(verbosity=2)
