// The $.state contract of claude-desktop-mods' hooks module (hooks/handoff.tsx).

/** One brief in the session-handoff skill's store, as the /handoffs pane lists it. */
export type HandoffBrief = {
  /** Absolute path of the brief file. */
  path: string
  /** The brief's file name. */
  file: string
  /** The objective from the brief's `# Handoff — <objective>` heading. */
  title: string
  /** The `Title this session` value of its first message, when it carries one. */
  sessionTitle: string | null
  /** Repository the work was handed off from, by folder name. */
  repo: string
  /** Branch the work was handed off from. */
  branch: string
  /** The brief's `Reason` row. */
  reason: string
  /** The brief's `To` row. */
  target: string
  /** When it was handed off, in milliseconds since the epoch. */
  handedOffAt: number
  /** The paste-ready first message, from the brief's `## First Message` section. */
  firstMessage: string | null
  /** Whether a session has started with this brief's first message. */
  isPickedUp: boolean
}

/** A brief's text shown in the pane, or a first message shown for copying. */
export type HandoffShown = { path: string; text: string }

declare module 'claude-code' {
  interface PluginState {
    'claude-desktop-mods': {
      /** The briefs the pane lists, newest first. */
      briefs: HandoffBrief[]
      /** The directory those briefs were read from. */
      handoffDir: string
      /** The context window's fill after the last main turn; null when unknown. */
      contextPercent: number | null
      /** The brief opened in the pane. */
      opened: HandoffShown | null
      /** A first message the clipboard did not take, shown for copying. */
      pickup: HandoffShown | null
      /** Whether this session's first prompt has been seen. */
      hasFirstPrompt: boolean
    }
  }
}
