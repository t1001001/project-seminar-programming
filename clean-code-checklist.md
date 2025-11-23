# Clean Code Rules

## 1. Naming
- Descriptive names (avoid `x`, `tmp`, `d`)
- Pronounceable and searchable
- Boolean names use `is/has/can` prefix
- Constants in `UPPER_CASE`

## 2. Functions
- Maximum ~20–30 lines
- Does **one** thing
- Maximum of 3 parameters
- No side effects

## 3. DRY (Don't Repeat Yourself)
- No copy‑paste code
- Replace magic numbers with constants
- Extract duplicated logic

## 4. SOLID (S)
- Each class has a single responsibility
- Layering: Controller → Service → Repository
- Max ~200–300 lines per class

## 5. Comments
- Code should be self‑explanatory
- No commented‑out code
- Comments explain **why**, not **what**

## 6. Exceptions
- Use specific exceptions
- Never use empty catch blocks
- Use try‑with‑resources

## 7. Tests
- Use the AAA Pattern (Arrange – Act – Assert)
- Include happy path, edge cases, and error scenarios
- Mock dependencies
- Coverage targets: 80% line / 70% branch

## 8. Before Committing
- All tests pass (`mvn test`)
- No `System.out.println`
- Code is formatted
- Commit messages are meaningful

---

### ❌ Common Code Smells to Avoid
Magic Numbers • Long Methods • Large Classes • Duplicate Code • Dead Code • God Class • Cryptic Names • SQL Injection • Missing Resource Cleanup

---

*Based on the Clean Code Quick Checklist.*
