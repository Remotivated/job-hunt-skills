"""Unit tests for scripts/generate-docx.py.

Run with:  python scripts/test_generate_docx.py

Covers the parser + preprocessing layer (no LibreOffice required) and a
smoke test on the full md->docx build path. The soffice integration step
is exercised by running the script against a fixture in CI environments
where LibreOffice is installed; here we stop at the .docx artifact.
"""

import importlib.util
import io
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from zipfile import ZipFile


# Load generate-docx.py — it has a hyphen in the filename so it can't be
# imported with a normal `import` statement.
_HERE = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location(
    "generate_docx", _HERE / "generate-docx.py"
)
gd = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(gd)


SAMPLE_RESUME = """# Sarah Chen

sarah.chen@email.com \u00B7 [LinkedIn](https://linkedin.com/in/sarahchen) \u00B7 San Francisco, CA

---

## Experience

### Marketing Manager \u2014 TechStartup Inc.
*Jan 2022 \u2013 Present* \u00B7 San Francisco, CA

- Did things, **with impact**
- Did *more* things
"""


class NormalizeUnicodeTests(unittest.TestCase):
    def test_em_dash(self):
        self.assertEqual(gd.normalize_unicode("a \u2014 b"), "a - b")

    def test_en_dash(self):
        self.assertEqual(gd.normalize_unicode("2022 \u2013 2024"), "2022 - 2024")

    def test_smart_double_quotes(self):
        self.assertEqual(gd.normalize_unicode("\u201Chello\u201D"), '"hello"')

    def test_smart_single_quotes(self):
        self.assertEqual(gd.normalize_unicode("it\u2019s"), "it's")

    def test_ellipsis(self):
        self.assertEqual(gd.normalize_unicode("wait\u2026"), "wait...")

    def test_zero_width_space(self):
        self.assertEqual(gd.normalize_unicode("a\u200Bb"), "ab")

    def test_zwj_zwnj(self):
        self.assertEqual(gd.normalize_unicode("a\u200Cb\u200Dc"), "abc")

    def test_bom(self):
        self.assertEqual(gd.normalize_unicode("\uFEFFtitle"), "title")

    def test_nbsp(self):
        self.assertEqual(gd.normalize_unicode("a\u00A0b"), "a b")

    def test_plain_ascii_untouched(self):
        self.assertEqual(gd.normalize_unicode("Hello, world."), "Hello, world.")


class StripFrontmatterTests(unittest.TestCase):
    def test_strips_yaml_block(self):
        text = "---\nversion: 3\nupdated: 2026-04-08\n---\n# Name\n"
        self.assertEqual(gd.strip_frontmatter(text), "# Name\n")

    def test_consumes_blank_lines_after_frontmatter(self):
        text = "---\nversion: 1\n---\n\n\n# Name\n"
        self.assertEqual(gd.strip_frontmatter(text), "# Name\n")

    def test_no_frontmatter_passthrough(self):
        text = "# Name\n\ncontact\n"
        self.assertEqual(gd.strip_frontmatter(text), text)

    def test_only_strips_first_block(self):
        text = "---\nversion: 1\n---\n# Name\n\n---\n\nbody"
        out = gd.strip_frontmatter(text)
        self.assertTrue(out.startswith("# Name"))
        self.assertIn("---", out)  # the body divider survives


class ParseResumeSectionsTests(unittest.TestCase):
    def test_extracts_name(self):
        name, _, _ = gd.parse_resume_sections(SAMPLE_RESUME)
        self.assertEqual(name, "Sarah Chen")

    def test_extracts_contact(self):
        _, contact, _ = gd.parse_resume_sections(SAMPLE_RESUME)
        self.assertIn("sarah.chen@email.com", contact)
        self.assertIn("[LinkedIn]", contact)

    def test_body_starts_after_divider(self):
        _, _, body = gd.parse_resume_sections(SAMPLE_RESUME)
        self.assertTrue(body.startswith("## Experience"))

    def test_handles_blank_lines_between_name_and_contact(self):
        text = "# Name\n\n\nemail@x.com\n\n---\n\nbody"
        name, contact, body = gd.parse_resume_sections(text)
        self.assertEqual(name, "Name")
        self.assertEqual(contact, "email@x.com")
        self.assertEqual(body.strip(), "body")

    def test_missing_h1_raises(self):
        with self.assertRaisesRegex(ValueError, "name"):
            gd.parse_resume_sections("no heading\n")

    def test_missing_divider_raises(self):
        with self.assertRaisesRegex(ValueError, "divider"):
            gd.parse_resume_sections("# Name\n\ncontact\n\nbody no divider\n")


class PickKindTests(unittest.TestCase):
    def test_resume(self):
        self.assertEqual(gd.pick_kind("my-documents/resume.md"), "resume")

    def test_coverletter(self):
        self.assertEqual(gd.pick_kind("my-documents/coverletter.md"), "coverletter")

    def test_cv(self):
        self.assertEqual(gd.pick_kind("my-documents/cv.md"), "cv")

    def test_case_insensitive(self):
        self.assertEqual(gd.pick_kind("/abs/CoverLetter.md"), "coverletter")
        self.assertEqual(gd.pick_kind("/abs/CV.md"), "cv")
        self.assertEqual(gd.pick_kind("/abs/Resume.md"), "resume")

    def test_application_subdir(self):
        self.assertEqual(
            gd.pick_kind("my-documents/applications/acme/resume.md"), "resume"
        )
        self.assertEqual(
            gd.pick_kind("my-documents/applications/acme/coverletter.md"),
            "coverletter",
        )


class BuildDocumentTests(unittest.TestCase):
    """Smoke tests that exercise the full md->docx pipeline. We inspect the
    docx XML to verify content survived the round-trip; we don't verify
    pixel-level styling (that's what visual review is for)."""

    def setUp(self):
        normalized = gd.normalize_unicode(SAMPLE_RESUME)
        name, contact, body = gd.parse_resume_sections(normalized)
        self.doc = gd.build_document(name, contact, body, "resume")
        # Save into memory so we can inspect document.xml.
        buf = io.BytesIO()
        self.doc.save(buf)
        buf.seek(0)
        with ZipFile(buf) as z:
            self.document_xml = z.read("word/document.xml").decode("utf-8")

    def test_contains_name(self):
        self.assertIn("Sarah Chen", self.document_xml)

    def test_contains_section_header_uppercase(self):
        self.assertIn("EXPERIENCE", self.document_xml)

    def test_contains_company_line(self):
        self.assertIn("TechStartup Inc.", self.document_xml)

    def test_contains_bullet_text(self):
        self.assertIn("Did things", self.document_xml)
        self.assertIn("with impact", self.document_xml)

    def test_em_dash_normalized(self):
        # The original \u2014 should have been normalized to a hyphen.
        self.assertNotIn("\u2014", self.document_xml)

    def test_hyperlink_emitted(self):
        # External hyperlink relationship should appear.
        self.assertIn("w:hyperlink", self.document_xml)

    def test_uses_georgia_font(self):
        self.assertIn("Georgia", self.document_xml)

    def test_no_charter_references(self):
        self.assertNotIn("Charter", self.document_xml)

    def test_section_header_has_bottom_border(self):
        # At least one paragraph should carry a w:pBdr/w:bottom (section
        # header underline or contact rule).
        self.assertIn("w:pBdr", self.document_xml)
        self.assertIn("w:bottom", self.document_xml)


class CoverLetterTests(unittest.TestCase):
    def test_cover_letter_paragraphs_have_extra_spacing(self):
        sample = "# Jane Doe\n\njane@x.com\n\n---\n\nDear Hiring Manager,\n\nI am writing about the role.\n"
        name, contact, body = gd.parse_resume_sections(sample)
        doc = gd.build_document(name, contact, body, "coverletter")
        # Find a body paragraph (skip header). Body paragraphs in cover
        # letter mode should have space_after = 10pt.
        body_paras = [p for p in doc.paragraphs
                      if "Hiring Manager" in p.text or "writing about" in p.text]
        self.assertTrue(body_paras, "expected to find body paragraphs")
        for p in body_paras:
            self.assertEqual(p.paragraph_format.space_after.pt, 10.0)


class RenderValidationTests(unittest.TestCase):
    def test_allows_markdown_links(self):
        sample = (
            "# Jane Doe\n\n"
            "[jane@x.com](mailto:jane@x.com) · [LinkedIn](https://linkedin.com/in/jane)\n\n"
            "---\n\n"
            "Dear Hiring Team,\n\n"
            "You're hiring a frontend engineer to improve accessibility across your product. "
            "At Acme, I led the cleanup of a legacy component library and cut the number of "
            "keyboard-navigation bugs by 40%.\n"
        )
        self.assertEqual(gd.find_render_blockers(sample, "coverletter"), [])

    def test_flags_bracket_placeholders(self):
        sample = (
            "# [Your Name]\n\n"
            "jane@x.com\n\n"
            "---\n\n"
            "[Date]\n\n"
            "Dear [Hiring Team],\n"
        )
        blockers = gd.find_render_blockers(sample, "coverletter")
        self.assertIn("unresolved bracket placeholder: [Your Name]", blockers)
        self.assertIn("unresolved bracket placeholder: [Date]", blockers)
        self.assertIn("unresolved bracket placeholder: [Hiring Team]", blockers)

    def test_flags_comments_and_ask_verify_markers(self):
        sample = (
            "# Jane Doe\n\n"
            "jane@x.com\n\n"
            "---\n\n"
            "<!-- template note -->\n"
            "[ASK: what was the result?]\n"
            "[VERIFY: exact team size]\n"
            "year TBD\n"
        )
        blockers = gd.find_render_blockers(sample, "resume")
        self.assertIn("HTML comments/template notes are still present", blockers)
        self.assertIn(
            "unresolved ASK marker: [ASK: what was the result?]", blockers
        )
        self.assertIn(
            "unresolved VERIFY marker: [VERIFY: exact team size]", blockers
        )
        self.assertIn("unresolved placeholder: year TBD", blockers)

    def test_md_to_docx_rejects_unresolved_placeholders(self):
        sample = (
            "# Jane Doe\n\n"
            "jane@x.com\n\n"
            "---\n\n"
            "[Date]\n\n"
            "Dear Hiring Team,\n"
        )
        path = _HERE.parent / "tmp-coverletter-validation.md"
        try:
            path.write_text(sample, encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "not ready to render"):
                gd.md_to_docx(path)
        finally:
            if path.exists():
                path.unlink()


class BuildHtmlTests(unittest.TestCase):
    """HTML preview path. Generates a self-contained HTML file with the
    same parsed content as the DOCX walker."""

    def setUp(self):
        normalized = gd.normalize_unicode(SAMPLE_RESUME)
        name, contact, body = gd.parse_resume_sections(normalized)
        self.html = gd.build_html(name, contact, body, "resume")

    def test_is_complete_html_document(self):
        self.assertTrue(self.html.lstrip().startswith("<!doctype html>"))
        self.assertIn("</html>", self.html)

    def test_contains_name(self):
        self.assertIn("Sarah Chen", self.html)

    def test_section_header_uppercased(self):
        self.assertIn("EXPERIENCE", self.html)

    def test_contains_company_line_class(self):
        # The italic+dot line right after an h3 should land in
        # .company-line, not .body-para.
        self.assertIn('class="company-line"', self.html)

    def test_contains_h3_role_title(self):
        self.assertIn("Marketing Manager", self.html)

    def test_bullet_list_emitted_as_ul(self):
        self.assertIn("<ul>", self.html)
        self.assertIn("</ul>", self.html)
        self.assertIn("Did things", self.html)

    def test_bold_inside_bullet_renders_as_strong(self):
        self.assertIn("<strong>with impact</strong>", self.html)

    def test_em_inside_bullet_renders_as_em(self):
        self.assertIn("<em>more</em>", self.html)

    def test_em_dash_normalized(self):
        # Source had —; normalize_unicode -> "-".
        self.assertNotIn("—", self.html)

    def test_link_in_contact_renders_as_anchor(self):
        self.assertIn('href="https://linkedin.com/in/sarahchen"', self.html)

    def test_uses_georgia_in_styles(self):
        self.assertIn("Georgia", self.html)

    def test_navy_token_in_styles(self):
        # Design accent that should appear in the embedded stylesheet.
        self.assertIn("#2C5F8A", self.html)


class HtmlEscapingTests(unittest.TestCase):
    def test_text_with_lt_gt_is_escaped(self):
        sample = (
            "# Jane <Doe>\n\n"
            "jane@x.com\n\n"
            "---\n\n"
            "## Experience\n\n"
            "Worked on A & B at <Acme>.\n"
        )
        name, contact, body = gd.parse_resume_sections(sample)
        out = gd.build_html(name, contact, body, "resume")
        # Raw angle brackets in source content must not appear unescaped.
        self.assertNotIn("<Doe>", out)
        self.assertNotIn("<Acme>", out)
        self.assertIn("Jane &lt;Doe&gt;", out)
        self.assertIn("&lt;Acme&gt;", out)
        self.assertIn("A &amp; B", out)


class CoverLetterHtmlTests(unittest.TestCase):
    def test_cover_letter_paragraphs_use_cover_para_class(self):
        sample = (
            "# Jane Doe\n\n"
            "jane@x.com\n\n"
            "---\n\n"
            "Dear Hiring Manager,\n\n"
            "I am writing about the role.\n"
        )
        name, contact, body = gd.parse_resume_sections(sample)
        out = gd.build_html(name, contact, body, "coverletter")
        self.assertIn('class="cover-para"', out)
        self.assertNotIn('class="body-para"', out)


class MdToHtmlTests(unittest.TestCase):
    def test_writes_html_next_to_input(self):
        with tempfile.TemporaryDirectory() as tmp:
            md_path = Path(tmp) / "resume.md"
            md_path.write_text(SAMPLE_RESUME, encoding="utf-8")
            out = gd.md_to_html(md_path)
            self.assertEqual(out, md_path.with_suffix(".html"))
            self.assertTrue(out.exists())
            self.assertGreater(out.stat().st_size, 500)
            content = out.read_text(encoding="utf-8")
            self.assertIn("Sarah Chen", content)

    def test_rejects_unresolved_placeholders(self):
        sample = (
            "# Jane Doe\n\n"
            "jane@x.com\n\n"
            "---\n\n"
            "[Date]\n\n"
            "Dear Hiring Team,\n"
        )
        with tempfile.TemporaryDirectory() as tmp:
            md_path = Path(tmp) / "coverletter.md"
            md_path.write_text(sample, encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "not ready to render"):
                gd.md_to_html(md_path)


class MainWritesHtmlTests(unittest.TestCase):
    """End-to-end: running the script writes both .docx and .html. PDF
    step is independent and tested separately."""

    def test_main_emits_html_alongside_docx(self):
        with tempfile.TemporaryDirectory() as tmp:
            md_path = Path(tmp) / "resume.md"
            md_path.write_text(SAMPLE_RESUME, encoding="utf-8")
            script = _HERE / "generate-docx.py"
            result = subprocess.run(
                [sys.executable, str(script), str(md_path)],
                capture_output=True, text=True, check=False,
            )
            # Exit code may be nonzero if soffice isn't installed; that's
            # OK — we only care that .docx and .html both got written.
            self.assertTrue(
                md_path.with_suffix(".docx").exists(),
                f"missing .docx; stdout={result.stdout!r} stderr={result.stderr!r}",
            )
            self.assertTrue(
                md_path.with_suffix(".html").exists(),
                f"missing .html; stdout={result.stdout!r} stderr={result.stderr!r}",
            )


class SofficeIntegrationTests(unittest.TestCase):
    """End-to-end test that the .docx -> .pdf step produces a real PDF.
    Skipped when LibreOffice (`soffice`) is not on PATH so local runs
    without LibreOffice still pass. CI installs LibreOffice and exercises
    this path."""

    @unittest.skipUnless(
        shutil.which("soffice"), "LibreOffice (soffice) not on PATH"
    )
    def test_resume_renders_to_pdf(self):
        with tempfile.TemporaryDirectory() as tmp:
            md_path = Path(tmp) / "resume.md"
            md_path.write_text(SAMPLE_RESUME, encoding="utf-8")
            script = _HERE / "generate-docx.py"
            result = subprocess.run(
                [sys.executable, str(script), str(md_path)],
                capture_output=True, text=True, check=False,
            )
            self.assertEqual(
                result.returncode, 0,
                f"generate-docx.py failed:\nstdout: {result.stdout}\nstderr: {result.stderr}",
            )
            pdf_path = md_path.with_suffix(".pdf")
            self.assertTrue(
                pdf_path.exists(),
                f"expected {pdf_path}, got: {list(Path(tmp).iterdir())}",
            )
            self.assertGreater(
                pdf_path.stat().st_size, 1024,
                "PDF is suspiciously small — render likely produced an empty file",
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
