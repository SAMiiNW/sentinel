'use client';

import { motion } from 'framer-motion';
import { FileText, ScanSearch, Network, ShieldAlert, Lock } from 'lucide-react';

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="uplabel font-mono text-teal">How the gate works</span>
          <h2 className="mt-3 font-display text-4xl font-700 leading-tight tracking-tight text-mist sm:text-5xl">
            One submission, <span className="gradient-text">independently re-judged</span>.
          </h2>
          <p className="mt-4 font-body text-haze">
            Sentinel is not a single opinion. The moderator ruling is the settlement, reproduced by
            every validator before the chain records it.
          </p>
        </div>

        {/* bento grid: one dominant cell + supporting cells */}
        <div className="mt-14 grid auto-rows-fr gap-5 md:grid-cols-3">
          {/* dominant cell */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="glass relative overflow-hidden rounded-4xl p-8 md:col-span-2 md:row-span-2"
          >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-teal/15 blur-3xl" />
            <div className="absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-violet/15 blur-3xl" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 shadow-glow">
              <Network size={26} className="text-teal" />
            </span>
            <h3 className="relative mt-7 font-display text-2xl font-700 tracking-tight text-mist">
              Validators concur, or the leader rotates
            </h3>
            <p className="relative mt-3 max-w-lg font-body text-haze">
              The moderator runs inside GenLayer consensus through a custom equivalence principle.
              Each validator independently re-runs the same moderation over the same policy and
              content. The ruling word must match exactly, and the severity score must agree within
              tolerance (the greater of twenty points or twenty percent). If they disagree, the
              network rotates the leader and tries again, so no single node decides a verdict alone.
            </p>
            <div className="relative mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
              <span className="rounded-full border border-compliant/40 bg-compliant/10 px-3 py-1 text-compliant">
                Compliant 0-24
              </span>
              <span className="rounded-full border border-flagged/40 bg-flagged/10 px-3 py-1 text-flagged">
                Flagged 25-69
              </span>
              <span className="rounded-full border border-blocked/40 bg-blocked/10 px-3 py-1 text-blocked">
                Blocked 70-100
              </span>
            </div>
          </motion.div>

          <BentoCell
            icon={FileText}
            step="01"
            title="Publish a policy"
            body="Write the rules in plain language: what is allowed and what is not. A deterministic write opens the policy. No deposit, only network fees."
            delay={0.06}
          />
          <BentoCell
            icon={ScanSearch}
            step="02"
            title="Submit content"
            body="Send up to 800 characters of content against any open policy. The moderator judges it strictly against the published rules, nothing else."
            delay={0.12}
          />
          <BentoCell
            icon={ShieldAlert}
            step="03"
            title="Injection resistance"
            body="Any attempt to override the rules, leak the prompt, or impersonate the system forces a hard BLOCK at severity 100. Prompt rules deter; code enforces."
            delay={0.18}
          />
          <BentoCell
            icon={Lock}
            step="04"
            title="Etched as a record"
            body="The ruling, severity, and rationale are written for good, with severity clamped into the band its ruling requires. An auditable moderation trail anyone can read."
            delay={0.24}
          />
        </div>
      </div>
    </section>
  );
}

function BentoCell({
  icon: Icon,
  step,
  title,
  body,
  delay,
}: {
  icon: typeof FileText;
  step: string;
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-4xl p-7"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
          <Icon size={20} className="text-violet-soft" />
        </span>
        <span className="font-mono text-xs tracking-widest text-faint">{step}</span>
      </div>
      <h3 className="mt-5 font-display text-lg font-600 tracking-tight text-mist">{title}</h3>
      <p className="mt-2 font-body text-sm leading-relaxed text-haze">{body}</p>
    </motion.div>
  );
}
