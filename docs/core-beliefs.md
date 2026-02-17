# Core Beliefs

Golden principles that guide development of Gary The Gardener.

## Eat Your Own Dog Food

This repository is self-hosted — the garden system maintains its own source code. Every workflow, audit, and sync runs on the repo that defines it. If a workflow is broken or produces poor output, we experience it before any user does. Self-hosting is not optional; it is the primary quality gate.

## Report Before You Prune

Never make changes silently. Always show findings first, then ask for approval. This applies to the gardener agent, to workflows, and to contributors alike. Surprises erode trust; transparency builds it.

## Compress, Never Lose

When reducing verbosity (compacting AGENTS.md, trimming docs), preserve every fact. It is acceptable to say something in fewer words. It is never acceptable to drop information.

## Minimal Dependencies, Maximum Portability

The CLI ships with one runtime dependency (`@inquirer/prompts` for interactive UI). Every additional dependency is a maintenance burden and an attack surface. We add packages only when reimplementing would be fragile and significantly more code. Fewer moving parts means fewer things that can break.
