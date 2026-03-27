# Hacker News Submission

**Title:** Show HN: Open-source Claude skills for remote job hunting

**URL:** https://github.com/remotivated/job-hunt-os

**Comment (post as first comment):**

Hi HN — I built this at Remotivated (remote job platform).

Job Hunt OS is a collection of Claude Cowork/Code skills, standalone LLM prompts, and methodology guides for remote job seekers.

The interesting technical bits:

- The resume auditor skill is specifically prompt-engineered to counteract LLM sycophancy. We found that default AI behavior gives uniformly positive resume feedback, which is useless. The skill uses a "hiring manager with 30 seconds" frame and leads with what needs improvement.

- The company radar skill uses a structured 4-stage evaluation framework (job posting → careers page → reviews → LinkedIn) with a red flag scoring system. It's designed to help people detect "remote-washing" — companies that say remote but mean something else.

- The standalone prompts are adapted from the skills for single-shot use in any LLM. The key difference: prompts need to include methodology inline (since they can't reference external files), so they're more verbose but self-contained.

The research notes in `research/` are also committed — they document the evidence basis for the guides (ATS myth-busting, negotiation success rates, what remote companies actually look for). Might be interesting independent of the tools.

All MIT licensed. Feedback welcome — especially from people who've been on the hiring side of remote roles.
