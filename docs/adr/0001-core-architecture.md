# ADR-0001: Core Application Architecture (Child Repo)

- **Status:** Accepted
- **Date:** 2026-11-19
- **Deciders:** Prism Mail team

> Template for child repositories. Template-repo baseline ADR is `docs/adr/0000-template-baseline.md`.
> Prism Mail decision recorded in [ADR-0017](0017-prism-multi-client-topology.md).

## Context

Choose a primary architecture pattern for the application layer. Document the choice before Golden Path implementation.

## Decision

**Selected pattern:** 🔲 MVVM  🔲 Clean Architecture  🔲 Hexagonal (Ports & Adapters)

### MVVM

- **View:** UI components (web components, Android Jetpack Compose, CLI output)
- **ViewModel:** Presentation state, user actions, no platform SDK calls
- **Model:** Domain + data services

**When:** UI-heavy apps with clear screen-level state.

### Clean Architecture

- **Entities:** Enterprise business rules
- **Use cases:** Application-specific rules
- **Interface adapters:** Controllers, presenters, gateways
- **Frameworks:** DB, web framework, device APIs

**When:** Long-lived products with multiple delivery surfaces.

### Hexagonal

- **Ports:** Interfaces the app exposes or requires
- **Adapters:** HTTP, DB, CLI, Android Activities wired to ports
- **Domain core:** No inward dependencies

**When:** Strong testability and swappable infrastructure matter most.

## Consequences

- Golden Path feature must respect layer boundaries chosen above
- CI coverage and lint gates apply per `examples/{stack}/` conventions
- Prism Mail: see ADR-0017 for the accepted Hexagonal multi-client topology
