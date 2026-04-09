---
name: civic-backend-implementation
overview: "Plan the Spring Boot + MySQL backend for the Civic Issue Reporting System, strictly following requirements.txt: DBML v2 schema, JWT security rules, and the defined REST API contract. Includes phased build steps, folder structure, entity/API lists, and risks/assumptions based on repo findings."
todos: []
isProject: false
---

## Project understanding summary
- **Repo layout**
  - **Frontend**: `frontend/` (React + Vite + Tailwind). UI is an interactive wireframe; no real backend integration yet.
  - **Backend**: `backend/civic-backend/` is an existing Maven + Spring Boot skeleton.
- **Frontend structure**
  - **Screens/components**: All screens are implemented inside a single file: `frontend/src/App.jsx` (no `pages/` / `components/` folders).
  - **Routing**: No React Router; the UI switches screens via local `useState` (`currentScreen`).
  - **State management**: Local state only (`useState`, `useEffect`); no Redux/Zustand/TanStack Query.
  - **Issue submission form shape (current UI)**: `onSubmit({ location, category, description, photo })` where:
    - `location`: `{ lat, lng }`
    - `category`: string values like `road_damage`, `garbage_dumping`, etc.
    - `photo`: `File`
    - Source: `frontend/src/App.jsx`.
  - **API calls already implemented**: none found (no `fetch`/`axios`, no `/api/*`, no `Authorization` header usage).
  - **Environment config**: no `.env*` files found; no `import.meta.env` usage; no Vite proxy config.
- **Backend structure (current repo state)**
  - **Exists**: `backend/civic-backend/pom.xml` + app entrypoint.
  - **Missing** (currently not present in repo): `application.properties|yml`, `src/main/resources/`, any `@Entity`, `@Repository`, `@Service`, or `@RestController` classes.
  - **Pom note**: current `pom.xml` uses Spring Boot parent `4.0.0` and has `spring-boot-starter-webmvc` + JPA + Security + Validation, but does **not** include the required JWT dependencies listed in `requirements.txt`.
- **Docker / DB init assets**
  - No `Dockerfile` / `docker-compose` found.
  - `requirements.txt` mentions a `data-mysql.sql` mock-data file, but it is not currently present.

## Extracted requirements summary
- **Backend tech stack (explicit)**
  - **Java**: 17+ (env lists 17.0.12).
  - **Build**: Maven.
  - **Spring dependencies required**: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, MySQL driver, `spring-boot-starter-security`, `jjwt-api/jjwt-impl/jjwt-jackson`, `spring-boot-starter-validation`. Source: `requirements.txt` lines 1–11.
  - **DB**: MySQL; JPA schema auto-create/update: `ddl-auto=update`. Source: `requirements.txt` lines 13–18.
- **Security requirements (explicit)**
  - Stateless security: `SessionCreationPolicy.STATELESS`.
  - **Public routes**: `/api/v1/auth/**` and `/api/v1/issues/public`.
  - **Secure routes**: all other `/api/v1/**`.
  - JWT payload must include **`user_id`** and **`user_role`**.
  - Enforce roles: **CITIZEN, OFFICIAL, ADMIN**.
  - Source: `requirements.txt` lines 26–37.
- **Core business logic requirements (explicit)**
  - **RoutingService**
    - `mapCoordinatesToWard(lat,long)`: placeholder ward lookup.
    - `getDefaultAssignment(wardId, categoryId)`: find correct AuthorityRole + active OfficerAssignment; must support **fallback to zone-level assignment** (Officer_Assignment.ward_id can be NULL).
  - **Aggregation**: geo-proximity check (MySQL spatial funcs or bounding box) against `Issue_Report` to select `parent_issue_id`.
    - If duplicate: set new issue’s `parent_issue_id`, increment master `duplicate_count`, update master `priority_level`.
  - **SLA**: compute `resolution_deadline` from `Issue_Category.sla_hours`; create initial `Issue_SLA` record.
  - **Writes on creation**: `Location`, `Issue_Report`, `Issue_SLA`, `Issue_Log` (initial OPEN).
  - **Update status**: `updateIssueStatus(issueId, newStatus, officerId, notes)` must check officer assignment authorization; update `Issue_Report.status` and append `Issue_Log`.
  - Source: `requirements.txt` lines 38–53 and 124–136.
- **API contract (explicit)**
  - `POST /api/v1/auth/login`
  - `POST /api/v1/issues` (CITIZEN only)
    - Request body: `category_id`, `description`, `photo_base64`, `latitude`, `longitude` (all required).
    - Response (201): `docket_id` (int), `status` ("OPEN"), `assigned_role` (role title), `deadline` (datetime).
  - `GET /api/v1/issues/public` (public): list **master issues** filtered/sorted by priority.
  - `GET /api/v1/issues/{id}` (public): full issue + IssueLog history.
  - Source: `requirements.txt` lines 54–65 and 111–144.
- **Database schema (DBML v2, explicit tables)**
  - Tables: `Users`, `Department`, `Ward`, `Authority_Role`, `Officer_Assignment`, `Location`, `Issue_Category`, `Issue_Report`, `Issue_Assignment`, `Issue_SLA`, `Issue_Log`.
  - Key notes:
    - `Issue_Report.parent_issue_id` is self-FK for duplicates; `duplicate_count` and `priority_level` are denormalized on master issues.
    - `Officer_Assignment.ward_id` nullable for zone-level roles.
    - Lat/Long types: decimal(10,8), decimal(11,8) mapped to `BigDecimal` with precision/scale.
  - Source: `requirements.txt` lines 157–268.

## Clarifying questions
(Answered)
- **Product**
  - **Auth**: Proceed with **mock login** in `POST /api/v1/auth/login` (mobile + OTP-like flow) issuing JWT; no real UIDAI integration.
- **Technical**
  - **Duplicate detection**: Assume **no MySQL spatial extensions**; implement bounding-box / simple proximity logic in SQL as described.

## Full backend architecture plan
### Phase 0 — Project Initialization
- **Objective**: Ensure backend project matches required stack and is runnable locally.
- **Components to build**
  - Confirm/align Maven `pom.xml` dependencies with `requirements.txt` (add JWT deps, ensure Web starter choice).
  - Create `src/main/resources/application.properties` for MySQL + JPA (`ddl-auto=update`) and JWT settings.
  - Add CORS configuration (initially permissive for `localhost` dev) to support frontend integration.
- **Dependencies**: Existing skeleton in `backend/civic-backend/`.
- **Expected output**: Backend boots successfully, connects to MySQL, exposes actuator-less health via basic startup logs.
- **Risks**
  - Current `pom.xml` uses Spring Boot parent `4.0.0` which may be incompatible with some common Spring Security/JJWT examples.
- **Validation strategy**
  - Start app; verify DB connection; verify unauthorized access to secured endpoints.

### Phase 1 — Database Design
- **Objective**: Implement DBML v2 as JPA entities exactly.
- **Components to build**
  - JPA entities for all DBML tables with correct:
    - PK identity strategy
    - FKs and relationships (ManyToOne/OneToMany)
    - Nullability and unique constraints where explicitly defined
    - `BigDecimal` precision/scale for lat/long
    - `LocalDateTime` for datetime
  - Decide relationship loading defaults (prefer LAZY on ManyToOne unless required).
- **Dependencies**: Phase 0 config; MySQL schema auto update.
- **Expected output**: Hibernate generates schema closely matching DBML; FK constraints present.
- **Risks**
  - Self-referential FK (`Issue_Report.parent_issue_id`) can cause recursion in JSON serialization if exposed directly.
- **Validation strategy**
  - Run app; inspect generated tables/constraints; create minimal records via repository tests.

### Phase 2 — Repository Layer
- **Objective**: Provide persistence primitives for services.
- **Components to build**
  - `JpaRepository` interfaces for all entities.
  - Custom queries needed for:
    - Proximity search for master issue detection.
    - Selecting active `Officer_Assignment` by ward+role with zone-level fallback.
    - Public board query: master issues only (`parent_issue_id IS NULL`) sorted by priority then time.
- **Dependencies**: Phase 1 entities.
- **Expected output**: Repos compile and support service-layer requirements.
- **Risks**
  - Bounding-box proximity query accuracy vs performance.
- **Validation strategy**
  - Repository integration tests with seeded data.

### Phase 3 — Security Layer
- **Objective**: Implement stateless JWT auth per requirements.
- **Components to build**
  - `SecurityConfig`:
    - Stateless sessions
    - Permit `/api/v1/auth/**` and `/api/v1/issues/public` (and `GET /api/v1/issues/{id}` since it is required public).
    - Secure all other `/api/v1/**`.
  - JWT utility service:
    - Issue tokens with claims: `user_id`, `user_role`.
    - Validate token and attach Authentication.
  - JWT filter in security chain.
  - Role model mapping: `CITIZEN`, `OFFICIAL`, `ADMIN`.
- **Dependencies**: Phase 0 properties for JWT secret/expiry; Phase 1 `Users` entity + repository.
- **Expected output**: Protected endpoints require valid JWT; role checks enforce CITIZEN on issue creation.
- **Risks**
  - Misconfigured route matchers leading to accidental public exposure.
- **Validation strategy**
  - Security integration tests: access matrix by route and role.

### Phase 4 — Core Business Logic
- **Objective**: Implement routing, aggregation, SLA, logging, and status updates.
- **Components to build**
  - `RoutingService`
    - `mapCoordinatesToWard`: placeholder returning ward id (deterministic stub).
    - `getDefaultAssignment(wardId, categoryId)`:
      - lookup `Issue_Category.default_role_id`
      - find active `Officer_Assignment` for ward+role
      - fallback to `Officer_Assignment` with `ward_id IS NULL` (zone-level)
  - `IssueService.createIssue(issueData, reporterId)` implementing required steps:
    - Authenticated reporter from JWT
    - Insert `Location`
    - Duplicate detection query in `Issue_Report` using bounding box; choose master (`parent_issue_id IS NULL`) as parent
    - Insert `Issue_Report` (status OPEN)
    - If duplicate: update master `duplicate_count` and master `priority_level`
    - Insert `Issue_SLA` with computed deadline from `Issue_Category.sla_hours`
    - Insert `Issue_Log` initial record
  - `IssueService.updateIssueStatus(...)`
    - Check officer access: officer is currently assigned to the role handling this issue (per requirements)
    - Update `Issue_Report.status` and append `Issue_Log`
- **Dependencies**: Phase 2 queries; Phase 3 security principal.
- **Expected output**: Business logic works end-to-end for create issue and status updates.
- **Risks**
  - Priority update rules are not explicitly defined beyond “update priority_level”; must define deterministic mapping based on `duplicate_count` thresholds (documented as an assumption unless requirements specify elsewhere).
  - Transactionality: multi-table writes must be atomic.
- **Validation strategy**
  - Service-layer tests with transactions; verify duplicate_count increments; verify SLA deadline math.

### Phase 5 — REST Controllers
- **Objective**: Implement API contract “no change to endpoints/contracts”.
- **Components to build**
  - `AuthController`
    - `POST /api/v1/auth/login`: mock OTP login → returns JWT containing `user_id` and `user_role`.
  - `IssueController`
    - `POST /api/v1/issues` (CITIZEN role): accepts request with `category_id`, `description`, `photo_base64`, `latitude`, `longitude`; returns 201 response with `docket_id`, `status`, `assigned_role`, `deadline`.
    - `GET /api/v1/issues/public` (public): master issues sorted/filtered by priority.
    - `GET /api/v1/issues/{id}` (public): issue detail + Issue_Log history.
- **Dependencies**: Phase 4 services.
- **Expected output**: Endpoint responses match contract; proper HTTP status codes.
- **Risks**
  - DTO vs Entity leakage; JSON recursion; inconsistent field names.
- **Validation strategy**
  - Controller integration tests for request/response shapes.

### Phase 6 — Data Initialization
- **Objective**: Provide initial org data to test routing quickly.
- **Components to build**
  - Create the `data-mysql.sql` described in requirements to seed:
    - `Department`, `Ward`, `Authority_Role`, `Issue_Category`, and mock `Users` for officials.
  - (Optional) `CommandLineRunner` seeding for dev if SQL import is not used.
- **Dependencies**: Phase 1 schema.
- **Expected output**: Fresh DB can be bootstrapped to demo routing and assignment.
- **Risks**
  - Keeping SQL seed aligned with evolving JPA schema.
- **Validation strategy**
  - Start app on empty DB; verify seed data present.

### Phase 7 — Integration with Frontend
- **Objective**: Enable the React app to call backend.
- **Components to build**
  - CORS configuration for dev.
  - Publish a minimal API usage guide for the frontend team:
    - How to call login
    - How to attach `Authorization: Bearer <token>`
    - How to convert `File` to `photo_base64` to match contract.
  - (Optional) Add a Vite proxy snippet suggestion (frontend currently has none).
- **Dependencies**: Phase 5 endpoints.
- **Expected output**: Frontend can be wired to backend without contract mismatch.
- **Risks**
  - Frontend currently uses `category` strings, while backend contract requires `category_id`.
- **Validation strategy**
  - Manual smoke test from browser/devtools or Postman.

### Phase 8 — Testing Strategy
- **Objective**: Ensure correctness for security + business logic + API contract.
- **Components to build**
  - **Unit tests**: JWT utils; SLA deadline calculations; priority mapping.
  - **Integration tests**: repositories and service transactional flows.
  - **API tests**: endpoints for login, create issue, public list, issue detail.
- **Dependencies**: All prior phases.
- **Expected output**: Automated test suite runnable via Maven.
- **Risks**
  - MySQL-dependent tests can be flaky without containerization.
- **Validation strategy**
  - Use dedicated test profile; consider Testcontainers later if allowed.

## Suggested folder structure
Within `backend/civic-backend/src/main/java/com/civic/backend/`:
- `config/` (SecurityConfig, CORS)
- `security/` (JWT filter, JWT util, auth principal)
- `controller/` (AuthController, IssueController)
- `dto/` (request/response DTOs)
- `model/` (JPA entities matching DBML)
- `repository/` (Spring Data repositories)
- `service/` (IssueService, RoutingService)
- `exception/` (API error model, handlers)

## Suggested entity list (DBML v2)
- `User`
- `Department`
- `Ward`
- `AuthorityRole`
- `OfficerAssignment`
- `Location`
- `IssueCategory`
- `IssueReport` (self-reference `parentIssue`)
- `IssueAssignment`
- `IssueSla`
- `IssueLog`

## Suggested API endpoint list (as explicitly defined)
- **Auth**
  - `POST /api/v1/auth/login` (public)
- **Issues**
  - `POST /api/v1/issues` (CITIZEN)
  - `GET /api/v1/issues/public` (public)
  - `GET /api/v1/issues/{id}` (public)

## Risks and assumptions
- **Assumption (confirmed)**: auth is mock OTP-like login; JWT issued with `user_id` and `user_role` claims.
- **Assumption (confirmed)**: duplicate detection uses bounding box / simple proximity SQL (no spatial extensions).
- **Assumption (needed unless specified elsewhere)**: priority escalation thresholds for `priority_level` based on `duplicate_count` (requirements only say “update priority_level”).
- **Risk**: Frontend form uses category strings and `File` upload, but API contract requires `category_id` and `photo_base64`.
- **Risk**: Current backend `pom.xml` differs from required deps list (missing jjwt); Spring Boot version alignment may require attention.
- **Risk**: Public access rules in requirements mention `/api/v1/issues/public` but issue detail is also required public; security matchers must reflect both.

## Recommended implementation order
- Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
- Within Phase 4, implement in this order:
  - SLA deadline calculation
  - Assignment lookup (ward + zone fallback)
  - Duplicate detection + master updates
  - Transactional createIssue orchestration
  - updateIssueStatus authorization + logging
