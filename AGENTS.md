# Project Agent Rules

## 1. Automatic Development Log (`DEVLOG.md`)
- After completing any code modification, feature implementation, refactoring, or bug fix, automatically record an entry in `DEVLOG.md` at the repository root.
- Each dev log entry must include:
  - **Date & Time**: Timestamp of the change.
  - **Summary**: High-level overview of what changed.
  - **Details**: Bullet points listing modified/added/removed files and key technical decisions or performance improvements.

## 2. Automatic GitHub Summary, Description & Submission
- Once a coding task is completed and verified (build/typecheck passes) and `DEVLOG.md` is updated:
  1. Draft a clear **GitHub Commit Summary** (subject line) and **Detailed Description** (commit body) summarizing all changes.
  2. Automatically stage, commit, and push the changes to the remote GitHub repository (`git add -A`, `git commit -m "<summary>" -m "<description>"`, and `git push`).
  3. Include the GitHub commit summary and description in the final response to the user.

