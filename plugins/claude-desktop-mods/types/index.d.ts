// The $.state contract of claude-desktop-mods' hooks module (hooks/handoff.tsx).

/** A cross-repository handoff brief found in a reply. */
export type HandoffBrief = {
  /** The change, from the brief's `# Handoff — <change>` heading. */
  title: string
  /** The brief's `**Target repository:**` value. */
  target: string
  /** The whole brief: what Copy puts on the clipboard. */
  text: string
}

declare module 'claude-code' {
  interface PluginState {
    'claude-desktop-mods': {
      /** The latest brief, until it is dismissed. */
      brief: HandoffBrief | null
      /** Whether the clipboard refused the brief, so the pane shows it as plain text. */
      isCopyRefused: boolean
    }
  }
}
