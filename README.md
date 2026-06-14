# Sentinel

**An on-chain AI content-policy gate. Publish rules in plain language, submit content against them, and let an injection-resistant moderator settle the ruling under validator consensus.**

Art direction: Aurora glass (deep indigo field, an animated teal-to-violet gradient mesh drifting behind frosted glass panels). Display type Sora, body Inter, mono JetBrains Mono.

- Live dApp: https://samiinw.github.io/sentinel/
- Contract: [`0x216c90ae3FB104640563f1391B2BbF44b7B9258B`](https://explorer-bradbury.genlayer.com/address/0x216c90ae3FB104640563f1391B2BbF44b7B9258B) on GenLayer Bradbury Testnet
- Deploy transaction: [`0x645d51c1175541fea0115d673c3a56a61a45fa5b0c740f19fd758b5546a2ffb4`](https://explorer-bradbury.genlayer.com/tx/0x645d51c1175541fea0115d673c3a56a61a45fa5b0c740f19fd758b5546a2ffb4)

---

## Control-room briefing

This document is written the way an operations desk briefs a new shift: read it top to bottom and you will know exactly what the system does, what crosses your desk, and which levers exist. The center of the briefing is one real moderation, traced from the moment content arrives to the moment its ruling is sealed on-chain.

### What is on the board

Sentinel turns a content-policy decision into an on-chain settlement. There is no server, no database, and no moderation team behind a curtain. The Intelligent Contract holds every policy, every ruling, and an append-only chronicle. A static frontend reads that state directly from the chain and stages the consensus lifecycle while validators deliberate.

Two things happen on the board:

1. A publisher posts a **policy**: a title and a set of rules written in plain language.
2. Anyone submits a piece of **content** to be checked against an open policy. That submission is the AI write. A moderator reads the content strictly against the policy and returns a ruling with a severity score, and the network settles it under consensus.

No deposits, no staking, no value transfer. Submitters pay only network fees, mostly refunded after the AI write executes.

---

## Trace: one moderation, end to end

Follow a single check across the desk. This is the worked example the rest of the briefing refers back to.

**00:00 - Content arrives.** A submitter sends up to 800 characters of content against `policy-1` ("Community Marketplace Listing Standards"). The contract first runs deterministic guards: the policy must exist and the content length must be in range. A bad request fails here, cheaply, before any model runs.

**00:01 - The leader drafts.** Inside a consensus round, the leader validator builds a prompt that pins the policy rules as authoritative and frames the content as untrusted data. It calls the language model and parses the reply defensively into a ruling word, a severity integer (0 to 100), an injection flag, and a one-sentence rationale. The frontend can peek at this draft and display it, clearly labeled as not yet final.

**00:02 - Validators re-judge.** Every other validator independently re-runs the exact same moderation over the same policy and content. This is the heart of GenLayer consensus: the decision is not trusted because the leader said so, it is trusted because independent nodes reproduced it.

**Agreement rule.** Validators agree only when the **ruling word matches exactly** and the **severity scores agree within tolerance** (the greater of 20 points or 20 percent of the larger score). If they disagree, the network rotates the leader and tries again. A leader timeout is never a failure on the board, it is the system rotating to a fresh leader.

**00:03 - Backstops fire.** After consensus, deterministic code enforces what a prompt alone cannot. If the moderator detected a manipulation attempt, the ruling is forced to BLOCKED at severity 100. Then the severity is clamped into the band its ruling requires, so a "compliant" verdict can never carry a high-risk score and a "blocked" verdict can never look harmless:

| Ruling | Meaning | Severity band |
| --- | --- | --- |
| COMPLIANT | respects every policy rule | 0 to 24 |
| FLAGGED | borderline or a minor breach, needs review | 25 to 69 |
| BLOCKED | clear violation or attempted manipulation | 70 to 100 |

**00:04 - Sealed.** The contract updates the policy's last ruling, increments the O(1) counters, and appends a chronicle entry with the ruling, severity, rationale, and a content excerpt. The frontend reads the authoritative state back and flashes the updated card. The ruling is now a permanent, auditable moderation record.

The equivalence principle in use is a **custom validator** built on `gl.vm.run_nondet_unsafe`. A comparative principle was chosen over `strict_eq` because language-model output is never byte-identical across validators; the contract compares the fields that matter (the ruling exactly, the severity within tolerance) instead of demanding an impossible exact match.

---

## The console: every public method

The contract class is `Sentinel`. Methods marked write change state under consensus; views are free reads designed for paged batching so the frontend never loops single-item calls.

### Writes

- `publish_policy(title: str, policy: str) -> str`
  Deterministic write. Validates lengths (title 1 to 120, policy 1 to 600), assigns a sequential id like `policy-1`, stores the record, and appends a `PUBLISHED` chronicle entry. Returns the new policy id.

- `submit_content(policy_id: str, content: str) -> None`
  The AI write. Guards the policy id and content length (1 to 800), runs one consensus round of moderation, applies the injection and severity-band backstops, updates the policy's last ruling and the counters, and appends a `CHECKED` chronicle entry. This is the settlement.

### Views

- `get_policies(start: u256) -> list`
  Returns up to 20 policy records starting at an index. Drives the registry grid and pagination.

- `get_policy(policy_id: str) -> dict`
  Returns a single policy record, including its most recent ruling, severity, and rationale.

- `get_chronicle(start: u256) -> list`
  Returns up to 20 append-only log entries (publications and rulings), oldest first.

- `get_stats() -> dict`
  O(1) counters: `policies`, `checks`, `compliant`, `flagged`, `blocked`, and `owner`. The frontend derives dashboard figures from these without scanning.

---

## The wiring (architecture boundary)

```
   Browser (static SPA, GitHub Pages)            GenLayer Bradbury
   +--------------------------------+            +-----------------------------+
   |  Hero + living mesh canvas     |  reads     |  Sentinel intelligent       |
   |  Policy registry (bento grid)  | ---------> |  contract                   |
   |  Consensus stage + leader peek |            |   - policies TreeMap        |
   |  Submit modal (publish/check)  |  writes    |   - chronicle DynArray      |
   |  Wallet (MetaMask, chain 4221) | ---------> |   - O(1) counters           |
   +--------------------------------+            |   - AI moderator under      |
        genlayer-js, no backend                  |     validator consensus     |
                                                 +-----------------------------+
```

The frontend owns presentation, wallet, polling, and derived stats. The contract owns all authoritative state and the moderation judgment. External model providers own only raw inference; the contract re-runs and compares so no single inference is trusted.

Frontend stack: Next.js 14 (App Router, static export), TypeScript, Tailwind with a custom Aurora-glass token set, Framer Motion, lucide-react icons, and `genlayer-js` 1.1.8 for all chain access. Reads need no wallet, so live chain state renders on first paint; a dead RPC degrades only the registry section, never the whole page. Polling runs at 95 seconds and pauses entirely while a transaction is in flight, with exponential backoff to respect Bradbury rate limits.

---

## Run it yourself

Clone, then work in two halves: the contract toolchain (Python) and the frontend (Node).

Contract side, from the project root:

```bash
pip install genlayer-test genvm-linter
genvm-lint check contracts/contract.py
gltest tests/integration/ -v -s --network studionet
```

Deploy and verify against Bradbury (set `GENLAYER_PRIVATE_KEY` in `.env`, fund it from the faucet first):

```bash
python scripts/deploy.py        # writes deployment.json with the address and tx
python scripts/verify_read.py   # reads get_stats and the paged views
python scripts/verify_write.py  # publishes a policy and moderates content end to end
```

Frontend side:

```bash
cd frontend
npm install
npm run dev      # local development at http://localhost:3000/sentinel
npm run build    # static export to out/ (the hard gate before deploy)
npm run deploy   # publish out/ to GitHub Pages with gh-pages --dotfiles
```

The emoji gate runs with `node scripts/no-emoji.js` and must print `No emojis - clean.` before any commit.

---

## Notes from the desk

- **Consensus reality.** A write can land ACCEPTED with a single validator dissenting while the majority agrees. That is normal. Only an overall UNDETERMINED status means the validators truly could not converge.
- **Confidentiality.** On a public chain, all stored state is ultimately readable. Sentinel stores nothing secret; policies and content excerpts are public by design, which is what makes the moderation auditable.
- **Not advice.** Rulings are AI judgments under validator consensus, provided as is. They are not professional content moderation or legal advice.

Built on GenLayer. The judgment is the settlement.
