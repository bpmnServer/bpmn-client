# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!---
your comment goes here
and here
## [Unreleased]
### Added

### Changed
-->
## Unreleased — Remove caller-supplied identity (#4)

- Stop serializing workflow principals in request bodies.
- Allow versioned runtime and administration clients to carry bearer tokens.
- Leave principal resolution to the trusted server-side integration layer.

## Unreleased — Canonical versioned API client (#3)

- Add `BPMNClientV1` for the canonical `/api/v1` runtime contract.
- Add `BPMNAdminClientV1` for the canonical `/admin/api/v1` administration contract.
- Retain the older client classes as compatibility surfaces.

## Unreleased — Separate runtime and administration clients (#2)

- Keep workflow execution calls on the runtime client.
- Introduce explicit administration clients for workflow-definition management.
- Remove model-management methods from the runtime client contract.

## Release 2.2.4 -- 2024-05
- Fix api dataStore/findInstances(query,projection)
## Release 2.1.5 -- 2024-03
- added engine.startEvent
### cli enhancements
- support double quotes, so parameters like: `name "Buy Used Car" ` can now work
- support backspace on input


## Release 2.1.0 -- 2024-03
- added engine.restart
