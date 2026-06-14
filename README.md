# SENTINEL , Datasheet

On-chain AI content-policy gate. Rev. 1.0, GenLayer Bradbury.

A single-chip moderation primitive: feed it a policy and a piece of content, and it returns a ruling sealed under validator consensus. No server, no database, no moderation team behind the curtain.

| Parameter | Value |
| --- | --- |
| Part | Sentinel content-policy gate |
| Network | GenLayer Bradbury Testnet, chain 4221 |
| Live unit | https://sentinel-9ei.pages.dev |
| Contract | [0x216c90ae3FB104640563f1391B2BbF44b7B9258B](https://explorer-bradbury.genlayer.com/address/0x216c90ae3FB104640563f1391B2BbF44b7B9258B) |
| Deploy tx | [0x645d51c1...546a2ffb4](https://explorer-bradbury.genlayer.com/tx/0x645d51c1175541fea0115d673c3a56a61a45fa5b0c740f19fd758b5546a2ffb4) |
| Source | https://github.com/SAMiiNW/sentinel |
| Deposit / custody | none, none |

## 1. Theory of operation

A publisher writes a policy in plain language. Anyone then submits content to be checked against it. That submission is the only state-changing AI call: a moderator reads the content strictly against the policy and returns a ruling plus a 0-100 severity, and the network settles the result under consensus. The contract is the entire backend; a static client reads chain state directly and stages the deliberation while validators work.

## 2. Output codes

| Ruling | Condition | Severity band |
| --- | --- | --- |
| `COMPLIANT` | respects every policy rule | 0 to 24 |
| `FLAGGED` | borderline or minor breach, needs review | 25 to 69 |
| `BLOCKED` | clear violation or attempted manipulation | 70 to 100 |

A detected injection attempt is forced to `BLOCKED` at severity 100. After consensus, deterministic code clamps the severity into the band its ruling allows, so the word and the number can never contradict each other on-chain.

## 3. Consensus characteristics

The moderation runs through a custom validator on `gl.vm.run_nondet_unsafe`, not `strict_eq` (language-model output is never byte-identical across nodes). The leader drafts `{ruling, severity, injection, rationale}`; every validator re-runs the same check independently and agreement requires:

- the ruling word matches **exactly** (it drives state, no tolerance), and
- the severity scores agree within **max(20 points, 20 percent)** of the larger value.

Disagreement rotates the leader; a leader timeout is rotation, not failure. Error classes are compared so even failures converge.

## 4. Interface (pinout)

Writes, state-changing under consensus:

- `publish_policy(title, policy) -> str` , deterministic. Validates lengths (title 1-120, policy 1-600), assigns `policy-N`, logs `PUBLISHED`, returns the id.
- `submit_content(policy_id, content) -> None` , the AI write. Guards id and length (1-800), runs one consensus round, applies the injection and severity-band backstops, updates the policy and counters, logs `CHECKED`.

Reads, free and paged at 20:

- `get_policies(start)` , page of policy records.
- `get_policy(policy_id)` , one record with its latest ruling.
- `get_chronicle(start)` , append-only publish/ruling log.
- `get_stats()` , O(1) counters: policies, checks, compliant, flagged, blocked, owner.

## 5. Reference design

```
   static client (Cloudflare Pages)            GenLayer Bradbury
   +------------------------------+   reads     +--------------------------+
   |  windowed control-desk UI    | ----------> |  Sentinel contract       |
   |  command rail + bento field  |             |   policies TreeMap       |
   |  consensus stage, leader peek |   writes    |   chronicle DynArray     |
   |  wallet (MetaMask, 4221)     | ----------> |   O(1) counters          |
   +------------------------------+             |   AI moderator + consensus|
        genlayer-js, no backend                 +--------------------------+
```

Stack: Next.js 14 static export, TypeScript, Tailwind (Aurora-glass tokens), Framer Motion, lucide-react, genlayer-js 1.1.8. Reads need no wallet and paint on load; view polling runs at 95s and pauses during a write, with backoff for Bradbury rate limits.

## 6. Bring-up

```bash
# contract
pip install genlayer-test genvm-linter
genvm-lint check contracts/contract.py
gltest tests/integration/ -v -s --network studionet

# deploy + verify (GENLAYER_PRIVATE_KEY in .env, funded from the faucet)
python scripts/deploy.py
python scripts/verify_read.py
python scripts/verify_write.py

# frontend
cd frontend && npm install && npm run dev      # local
npm run build                                  # static export to out/
```

Hosting is Cloudflare Pages: the build sets `basePath` to root when `CF_PAGES=1`, so `CF_PAGES=1 npm run build` then `wrangler pages deploy out --project-name sentinel`.

## 7. Limits and notes

- A write can land ACCEPTED with one dissenting validator while the majority agrees; only an overall UNDETERMINED status means no convergence.
- All stored state is public by design, which is what makes the moderation auditable. Nothing secret is stored.
- Rulings are AI judgments under validator consensus, provided as is. Not professional moderation or legal advice.

Test GEN: https://testnet-faucet.genlayer.foundation/
