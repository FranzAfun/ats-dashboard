# 06 Authentication, Roles, Permissions and Feature Flags

## 1. Purpose

This document defines the user access model for the ATS web application.

The system shall support individual users, roles, permissions, and
administrator-managed feature flags.

The purpose is to control:

-   Which pages a user can access
-   Which navigation items a user can see
-   Which actions a user can perform
-   Which features are enabled for a user
-   Which data sections appear on the Dashboard
-   Which administrative functions are available

The model is designed so that access decisions are centralized rather
than scattered throughout the frontend.

------------------------------------------------------------------------

# 2. Core Access Model

The application shall use the following conceptual structure:

``` text
User
 │
 ├── Role
 │
 └── Effective Access
      ├── Page / Navigation Access
      ├── Action Access
      └── Feature Access
```

The user's effective access determines what the application exposes to
that user.

------------------------------------------------------------------------

# 3. Users

Each person using the system shall have an individual user account.

A user record will eventually contain information such as:

``` text
User
├── id
├── name
├── email / username
├── role
├── status
├── permissions
├── feature access
└── account metadata
```

The exact user fields depend on the final authentication implementation.

Users should not share accounts because access, actions, and audit
history need to remain attributable to an individual account.

------------------------------------------------------------------------

# 4. Roles

Roles provide a reusable way of grouping access.

The initial role model should remain flexible until the project owner
confirms the exact operational roles.

Potential roles may include:

``` text
Admin
Operator
Viewer
```

These are proposed starting roles, not final requirements.

### Admin

An administrator is responsible for administrative configuration and
access management.

Potential capabilities:

-   Manage users
-   Manage roles/permissions where authorized
-   Manage feature flags
-   Review access
-   Access operational features according to assigned permissions

### Operator

An operator may monitor the ATS and use selected operational controls.

Potential capabilities:

-   Dashboard
-   Power monitoring
-   Alerts
-   HMI controls where explicitly permitted
-   Selected analytics

### Viewer

A viewer may monitor permitted system information without operational
control.

Potential capabilities:

-   Dashboard
-   Selected telemetry
-   Selected analytics
-   Alerts

The final roles must be confirmed before production authorization is
implemented.

------------------------------------------------------------------------

# 5. Permissions

Permissions represent specific capabilities.

Permissions should be granular enough to distinguish between viewing a
page and performing an action.

Examples:

``` text
dashboard.view

power.view

financial.view
financial.export

alerts.view

hmi.view
hmi.changeSource
hmi.changeCost

admin.view

admin.users.view
admin.users.manage

admin.permissions.view
admin.permissions.manage

admin.features.view
admin.features.manage
```

Permission names are proposed examples and will be finalized during
implementation.

------------------------------------------------------------------------

# 6. Page / Navigation Access

Page access controls whether a user can access a module.

Example:

``` text
financial.view
```

If the user does not have the required access:

``` text
Financial navigation item
        ↓
Not rendered
```

The route must also be protected.

### Important Rule

> Hiding a navigation item is a user-interface behavior, not the
> complete security mechanism.

The backend or protected application layer must reject unauthorized
access as well.

------------------------------------------------------------------------

# 7. Action-Level Access

A user can have access to a page while lacking specific actions.

Example:

``` text
HMI
├── View source status       ✓
├── View telemetry           ✓
├── Change source            ✗
└── Change cost/day          ✗
```

The user can access the HMI page, but unauthorized controls are not
displayed.

Examples of action permissions:

``` text
hmi.changeSource
hmi.changeCost

financial.export

admin.users.manage
admin.features.manage
```

This allows the application to expose only the actions the current user
is allowed to perform.

Unauthorized actions are hidden. They must not be shown as disabled
controls.

------------------------------------------------------------------------

# 8. Feature Flags

Feature flags control whether defined application capabilities are
enabled.

They are separate from the user's basic identity and are managed through
the administrative module.

A feature may represent:

-   A complete application module
-   A Dashboard section
-   A specific operational capability
-   An analytics capability
-   An HMI capability
-   An administrative capability

Example feature identifiers:

``` text
powerMonitoring
financialAnalytics
alerts
hmi
dataExport
advancedAnalytics
```

These are proposed identifiers.

------------------------------------------------------------------------

# 9. Feature Management

Feature flags shall be managed through the Administration module.

Only authorized administrators shall be able to change feature
availability for users or applicable access groups.

The frontend must not contain manual per-user feature decisions such as:

``` js
if (user.email === "someone@example.com") {
  ...
}
```

Access configuration must come from the application's access system.

------------------------------------------------------------------------

# 10. Feature Flags and Permissions Work Together

Feature access and permissions should work together.

Conceptually:

``` text
Feature enabled?
       ↓
User has required permission?
       ↓
YES → expose capability
NO  → hide capability
```

A feature being enabled does not automatically mean every user can use
it.

Likewise, a user having a permission should not expose a feature that
has been disabled by the system.

The final effective-access logic will define the exact precedence and
inheritance rules.

------------------------------------------------------------------------

# 11. Navigation Visibility

Navigation items shall be access-aware.

Example:

``` text
Dashboard      → visible
Power          → visible
Financial      → hidden
Alerts         → visible
HMI            → visible
Administration → hidden
```

The navigation configuration should contain the access requirements for
each item.

Example:

``` js
const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    feature: null,
    permission: "dashboard.view"
  },
  {
    label: "Financial",
    path: "/financial",
    feature: "financialAnalytics",
    permission: "financial.view"
  }
];
```

The navigation renderer evaluates access before displaying the item.

------------------------------------------------------------------------

# 12. Dashboard Feature Access

The Dashboard is a core application section.

However, not every Dashboard section is necessarily visible to every
user.

Dashboard sections may depend on feature access.

Example:

``` text
Dashboard
├── Core ATS status
├── Power Monitoring
├── Financial Analytics
├── Alerts
└── HMI
```

A user without Financial Analytics access should see:

``` text
Dashboard
├── Core ATS status
├── Power Monitoring
├── Alerts
└── HMI
```

The financial section and its data should not be rendered.

When Financial Analytics access is granted, the relevant Dashboard
section becomes available.

------------------------------------------------------------------------

# 13. Dashboard Data Protection

Dashboard visibility must follow the same access rules as dedicated
pages.

The application must not do this:

``` text
Financial page hidden
        +
Financial data still visible on Dashboard
```

Instead:

``` text
No Financial access
        ↓
Financial page hidden
        ↓
Financial navigation hidden
        ↓
Financial Dashboard section hidden
        ↓
Restricted financial data not requested or exposed where possible
```

This keeps feature boundaries consistent throughout the application.

------------------------------------------------------------------------

# 14. Data Fetching and Feature Access

Access control should also influence data fetching where appropriate.

If a user has no access to Financial Analytics, the frontend should not
unnecessarily request financial data just to hide it afterward.

Preferred:

``` text
User Access
    ↓
Determine required features
    ↓
Request permitted data
    ↓
Render permitted sections
```

This improves both security boundaries and efficiency.

The final backend behavior must also enforce data authorization.

------------------------------------------------------------------------

# 15. Action Visibility

Buttons and controls should be rendered according to action permissions.

Example:

``` js
{canPerform("hmi.changeSource") && (
  <ChangeSourceButton />
)}
```

Similarly:

``` js
{canPerform("financial.export") && (
  <ExportButton />
)}
```

This pattern should be centralized through reusable access
helpers/components rather than repeated custom logic.

------------------------------------------------------------------------

# 16. Access Helper Layer

The frontend should provide a consistent access API.

Conceptual examples:

``` js
canAccess("financial")
```

``` js
canPerform("hmi.changeSource")
```

``` js
hasFeature("financialAnalytics")
```

Potential hooks:

``` js
useAuth()
useAccess()
useFeature()
```

The exact implementation will be decided during frontend development.

------------------------------------------------------------------------

# 17. Protected Routes

Routes must be protected independently of navigation visibility.

Example:

``` text
User attempts:
 /financial

        ↓

Route guard
        ↓
Has access?
   ├── YES → render page
   └── NO  → deny / redirect
```

### Implemented behavior

Direct access to a page the user cannot access renders an "Access
denied" page at the requested URL. The restricted page component is not
rendered, so its data is never requested. The access-denied page links
to the first page the user can access.

Unknown page, action or section identifiers are denied (fail closed).

------------------------------------------------------------------------

# 18. Administration Module

The Administration module is restricted to authorized administrators.

Potential sections:

``` text
Administration
├── Users
├── Roles / Permissions
├── Feature Flags
└── Access Review
```

The module should allow authorized administrators to manage supported
access settings.

### Administration Access Rules

`admin.view` is the page-level permission for the Administration area.

-   Without `admin.view`, Administration is not shown in navigation and
    the route is protected.
-   With `admin.view`, each section and action additionally requires its
    granular permission. A section or action the user lacks permission
    for is not shown.

  Section / action             Required permission
  ---------------------------- ---------------------------
  Administration page          `admin.view`
  View users                   `admin.users.view`
  Manage users                 `admin.users.manage`
  View roles/permissions       `admin.permissions.view`
  Manage role permissions      `admin.permissions.manage`
  View feature flags           `admin.features.view`
  Manage feature flags         `admin.features.manage`

`admin.view` alone grants no administrative data or actions.

------------------------------------------------------------------------

# 19. User Management

Authorized administrators may eventually be able to:

-   Create users
-   View users
-   Edit user information
-   Disable users
-   Assign roles
-   Manage applicable feature access

The exact capabilities depend on the final authorization model.

------------------------------------------------------------------------

# 20. Feature Flag Management

The Feature Flags section should allow authorized administrators to
manage available features.

Conceptual view:

``` text
Feature Flags

Power Monitoring       ON
Financial Analytics    ON
Alerts                 ON
HMI                    ON
Data Export             OFF
Advanced Analytics      OFF
```

The exact UI and whether features are assigned individually, through
roles, groups, or a combination must be finalized.

------------------------------------------------------------------------

# 21. User-Specific Feature Access

The system should support the ability to provide different feature
access to different users when required.

Example:

``` text
User A
✓ Power Monitoring
✓ Alerts
✗ Financial Analytics

User B
✓ Power Monitoring
✓ Alerts
✓ Financial Analytics
✓ Data Export

User C
✓ Power Monitoring
✓ Alerts
✓ HMI
✗ Financial Analytics
```

The Administration module is responsible for managing these differences.

------------------------------------------------------------------------

# 22. Role-Based Defaults

Roles may provide default access.

For example:

``` text
Operator
 ├── Power Monitoring
 ├── Alerts
 └── HMI
```

An individual user's effective access may then be adjusted where the
final authorization model permits it.

The exact inheritance model is not yet finalized.

------------------------------------------------------------------------

# 23. Effective Access

The system needs one final effective-access representation for the
frontend.

Conceptually:

``` js
{
  user: {
    id: "user-id",
    role: "operator"
  },

  permissions: [
    "dashboard.view",
    "power.view",
    "alerts.view",
    "hmi.view"
  ],

  features: [
    "powerMonitoring",
    "alerts",
    "hmi"
  ]
}
```

This is a proposed application-level structure.

The actual authentication system may provide additional information.

------------------------------------------------------------------------

# 24. Access Evaluation

The application should use a centralized evaluation process.

Conceptually:

``` text
Requested capability
        ↓
Is feature enabled?
        ↓
Does user have permission?
        ↓
YES → expose capability
NO  → hide / deny capability
```

For Dashboard sections:

``` text
Dashboard section
        ↓
Feature enabled?
        ↓
User has access?
        ↓
YES → render section
NO  → do not render section
```

For actions:

``` text
Action
  ↓
Required permission?
  ↓
YES → render action
NO  → hide action
```

The backend/control layer must repeat authorization for protected
operations.

------------------------------------------------------------------------

# 25. Admin-Only Feature Management

Feature management is an administrative capability.

Therefore:

``` text
User
  ↓
admin.features.manage?
  ├── YES → Feature Management available
  └── NO  → Feature Management hidden
```

A normal operator must not be able to enable restricted features for
themselves.

------------------------------------------------------------------------

# 26. Security Principle

The application shall follow the principle:

> UI visibility improves user experience, but authorization protects the
> system.

Therefore:

``` text
Navigation hidden
        ≠
Security complete
```

The protected application/backend/control layer must validate
permissions for:

-   Sensitive data
-   HMI commands
-   User management
-   Feature management
-   Permission management
-   Export operations where appropriate

------------------------------------------------------------------------

# 27. Responsive Access Management

All access-related screens must be responsive.

This includes:

-   Login
-   Dashboard
-   Navigation
-   User management
-   Permission management
-   Feature management
-   Access review
-   HMI controls

The Administration module must remain usable on smaller screens rather
than being designed only for desktop monitors.

Tailwind responsive utilities and intentional mobile layouts should be
used during implementation.

------------------------------------------------------------------------

# 28. Auditability

Access-management changes should eventually be auditable.

Potential events include:

``` text
User created
Role changed
Permission changed
Feature enabled
Feature disabled
User disabled
HMI command issued
```

The exact audit implementation will be defined separately if required by
the project.

------------------------------------------------------------------------

# 29. Mock Access Testing

Frontend development must include mock users with different access
configurations.

Example:

``` text
Admin Mock
Operator Mock
Viewer Mock
Restricted Operator Mock
```

This allows developers to verify:

-   Navigation visibility
-   Dashboard section visibility
-   Action/button visibility
-   Protected routes
-   Admin access
-   Feature-dependent data rendering

Mock access must use the same application access structure expected from
the real authentication system.

------------------------------------------------------------------------

# 30. Requirements Still To Be Confirmed

The following must be confirmed before production
authentication/authorization implementation:

-   Final role list
-   Final permission list
-   Final feature list
-   Whether features are assigned directly to users
-   Whether features are assigned through roles
-   Whether both role defaults and user overrides are supported
-   Whether groups/teams are required
-   Authentication provider
-   Session/token strategy
-   Password/reset requirements
-   Admin capabilities
-   Audit requirements
-   Exact backend authorization mechanism

------------------------------------------------------------------------

# 31. Implementation Principles

The implementation must follow these principles:

1.  Do not hardcode user-specific access in React components.
2.  Do not hardcode feature flags in page components.
3.  Do not use hidden navigation as the only security mechanism.
4.  Keep page access and action access separate.
5.  Keep feature availability separate from individual action
    permissions.
6.  Use the same access model for navigation, Dashboard sections, pages,
    and actions.
7.  Let administrators manage supported feature availability.
8.  Keep the Dashboard aware of feature access.
9.  Do not request restricted data unnecessarily.
10. Make the entire access-management experience responsive.

------------------------------------------------------------------------

# 32. Frontend Implementation (Mock)

The access model is implemented in the frontend against a mock access
backend. Production authentication and authorization remain TBD.

  Concern                     Location
  --------------------------- ------------------------------------------
  Permission/feature catalog  `src/config/access.config.js`
  Page/section/action rules   `src/config/access.config.js`
  Evaluation helpers          `src/utils/access.js`
  React access helpers        `src/app/AccessProvider.jsx`,
                              `src/hooks/useAccess.js`
  Route protection            `src/routes/PageAccessGuard.jsx`
  Section/action rendering    `src/components/access/`
  Mock users/roles/flags      `src/data/mock/access.mock.js`
  Mock access backend         `src/services/integration/mock/mockAccess.js`

### Evaluation rules

-   Page: user holds the page permission AND every required feature is
    in the user's effective features.
-   Dashboard section: same requirement as the corresponding page.
-   Action: user holds the action permission AND the feature of the
    area it belongs to (export requires `financialAnalytics` and
    `dataExport`).

### Application-wide elements

The live alarm banner shown above every page is part of the Alerts
feature. It requires the same access as the Alerts page (`alerts.view`
and the `alerts` feature), so users without Alerts access do not receive
alarm data through the banner.

### Mock inheritance model (development only)

``` text
permissions = role permissions + user grants - user revocations
features    = (role features + user grants - user revocations)
              ∩ globally enabled feature flags
disabled user → no permissions and no features
```

This model exists so the UI can be developed and tested. It is not a
confirmed production rule.

### Mock backend enforcement

The mock access backend checks the current user's permissions on every
administrative read and write and rejects unauthorized calls with
`FORBIDDEN`. It also prevents an administrator from changing their own
account or their own role's permissions, so the mock cannot lock itself
out. A production backend must enforce authorization independently.

### Mock users

  User                         Role       Purpose
  ---------------------------- ---------- ------------------------------------
  Mock Administrator           admin      Full access including administration
  Mock Operator                operator   Operational access with HMI actions
  Mock Viewer                  viewer     Read-only monitoring and analytics
  Mock HMI Observer            operator   HMI page access without HMI actions
  Mock Viewer (no Financial)   viewer     Financial Analytics feature revoked
  Mock Analyst                 viewer     Export permission and feature granted
  Mock Disabled User           viewer     Disabled account, no access

------------------------------------------------------------------------

# 33. Current Status

### Confirmed Direction

-   Individual user accounts
-   Role-based access
-   Page/navigation access
-   Action-level access
-   Feature flags
-   Admin-controlled feature management
-   Feature-dependent Dashboard sections
-   Responsive access-management UI
-   Centralized access evaluation
-   Backend/control-layer authorization

### Proposed

-   Initial roles
-   Permission naming
-   Feature naming
-   Effective-access object
-   Access helper methods
-   Mock user profiles

### To Be Confirmed

-   Exact roles
-   Exact permissions
-   Exact features
-   Authentication provider
-   Role/feature inheritance
-   User-specific overrides
-   Groups
-   Audit requirements
-   Session/token implementation

The next document should define how the custom frontend and the existing
Node-RED system will integrate while preserving these access boundaries.
