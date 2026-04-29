# Resume Builder

Use this prompt when you need to build a strong source resume or UK/EU work CV before tailoring for individual jobs. This is for work documents, not US academic CVs with publications, grants, and teaching sections.

## What you'll need

- Existing resume, LinkedIn export, or rough work history
- Target roles and industries
- Accomplishments, metrics, scope, tools, and projects
- Education, certifications, and languages
- Region: US resume or UK/EU work CV
- Background reading: [resume-philosophy.md](../guides/resume-philosophy.md), [ats-myths.md](../guides/ats-myths.md)

## The prompt

```
Build or rebuild my source work document. I want one truthful, reusable base document that I can later tailor for specific jobs. Do not invent facts, metrics, tools, employers, dates, titles, credentials, or outcomes.

DOCUMENT TYPE / REGION:
[US resume / UK work CV / EU work CV / not sure]

TARGET ROLES:
[roles, seniority, industries, and work model I am aiming for]

EXISTING RESUME OR LINKEDIN:
[paste text, or write "none"]

WORK HISTORY:
[for each role: employer, title, dates, location, responsibilities, accomplishments, projects, metrics, team size, tools]

EDUCATION / CERTIFICATIONS:
[paste details]

SKILLS / TOOLS:
[paste tools, technologies, platforms, methods, languages, proficiency qualifiers]

REMOTE / HYBRID SIGNALS:
[remote work, async work, cross-timezone collaboration, documentation, independent delivery, or write "none listed"]

ANYTHING NOT TO OVERSTATE:
[known gaps, skills I am learning, tools I only used lightly, claims I do not want inflated]

Follow this process:

1. DOCUMENT TYPE CHECK
   - If I wrote "CV" but did not name UK or EU, ask whether this is for a UK/EU work CV or a US resume before drafting.
   - If I appear to need a US academic CV, say that this prompt is not designed for academic CVs and ask whether I want a US resume or UK/EU work CV instead.

2. INPUT CHECK
   If the input is too thin to build responsibly, ask up to 8 targeted questions before drafting. Prioritize:
   - Current role accomplishments and outcomes
   - Metrics, scope, scale, and business impact
   - Promotions or title changes
   - Tool proficiency qualifiers
   - Target role angle
   - Remote-readiness evidence

3. ANGLE
   Identify the strongest positioning for my target roles: specialist, generalist, career changer, first-time manager, technical expert, operator, or another clear angle. Explain the choice in 2-3 sentences.

4. CONTENT RULES
   - Write accomplishment bullets, not responsibility lists.
   - Bullet structure: action verb + what I did + result or scope.
   - Use past tense throughout, including current role.
   - Preserve qualifiers such as "intermediate," "learning," "scripting only," "~1 year," or "exposure to."
   - Do not expand broad tools into specific services. If I wrote AWS, do not add S3, EC2, Lambda, or other services unless I named them.
   - If a metric would help but I did not provide one, write [ASK: what was the result?] rather than inventing a number.

5. OUTPUT FORMAT
   If US resume:
   - Name and contact line
   - Professional Summary, only if it sharpens the angle
   - Experience
   - Skills
   - Education

   If UK/EU work CV:
   - Name and contact line
   - Personal Statement, 2-4 sentences
   - Experience
   - Education, including degree classification if provided
   - Skills and spoken languages with CEFR levels if provided
   - References available on request
   - Do not include photo, date of birth, marital status, or full home address unless I explicitly ask.

6. QUALITY CHECK
   After drafting, include:
   - Strongest 3 bullets and why they work
   - Weakest 3 bullets and what information would improve them
   - Every [ASK] gap I need to answer
   - Every claim that may be over-specific or unsupported

Output the full document and the quality check.
```

## What you'll get

A source resume or UK/EU work CV grounded in your own evidence, plus a list of missing facts to fill before tailoring for specific applications.
