# GitHub Issues & Project Management Guide

This guide establishes the workflow and discipline for managing the **Stamp Valuation App** development using GitHub Issues and Milestones. All AI Dev Agents must follow these instructions strictly to ensure project transparency and progress tracking.

---

## 🚀 Core Philosophy
1. **No Issue, No Work**: Every task, bug fix, or feature must be represented by a GitHub Issue.
2. **Context Continuity**: The GitHub Issue should be the source of truth for the *intent* and *status* of a task.
3. **Automated Tracking**: AI Agents are responsible for creating, updating, and closing issues as they progress.

---

## 📝 Issue Creation Standards

When starting a new task that doesn't have an issue, create one immediately.

### 📝 Description Template
```markdown
## 🎯 Objective
Briefly describe what this issue aims to achieve.

## 🛠 Proposed Changes
- [ ] List specific implementation steps.
- [ ] Mention affected components/files.

## ✅ Acceptance Criteria
- [ ] Criterion 1 (e.g., "Button is visible on mobile")
- [ ] Criterion 2 (e.g., "Console errors are resolved")

## 🔗 Related Resources
- Link to relevant IMPLEMENTATION_PLAN.md or documentation.
```

### 🏷 Labels

Apply these labels when creating/updating issues:
- `enhancements`: New features or improvements.
- `bug`: Errors or broken functionality.
- `documentation`: Changes to README, guides, or code comments.
- `refactor`: Code cleanup without logic changes.
- `urgent`: Blocks critical workflows.

### 🔄 Status Labels
- `status:todo`: Not yet started.
- `status:in-progress`: Currently being worked on.
- `status:review`: Ready for verification.
- `status:done`: Completed and verified.

### 📅 Milestones
Always assign issues to the current active Milestone (e.g., `v1.0-mvp`).

---

## 🔄 The AI Agent Workflow

### Phase 1: Initiation
- **Search**: Check if an issue already exists for the task.
- **Create**: If not, create the issue using the standards above.
- **Update**: If it exists, add a comment: *"I am starting work on this issue. [Current Date/Time]"* and set label to `status:in-progress`.

### Phase 2: Implementation
- **Micro-Updates**: For long-running tasks, add comments to the issue summarizing progress (e.g., *"Completed the header responsiveness; moving to the footer."*).
- **Blockers**: If you encounter a bug or change in scope, update the issue immediately.

### Phase 3: Completion
- **Verify**: Cross-check against the "Acceptance Criteria" in the issue description.
- **Comment**: Provide a brief summary of the final implementation and any technical notes for the user.
- **Close**: Close the issue with a reference to the changes made.

---

## 🛠 MCP Tools to Use
- `mcp_github-mcp-server_search_issues`: Find existing work.
- `mcp_github-mcp-server_issue_write`: Create (`method: 'create'`) or Update (`method: 'update'`).
- `mcp_github-mcp-server_add_issue_comment`: Log progress.
- `mcp_github-mcp-server_list_issues`: Audit the current backlog.

---

> [!IMPORTANT]
> **Discipline is Key.** If you forget to track an issue, the project history becomes fragmented. Always start by checking GitHub.
