// The $.state contract of claude-desktop-mods' context-view hooks module
// (hooks/context-view/register.tsx). Claude Code only.

/** One read of a Markdown file. */
export type ContextViewReadEvent = {
  /** `$.clock.now()` milliseconds. */
  at: number
  /** The turn it happened in, counted from 1 since the module loaded. */
  turn: number
  via: string
  tokens: number
  /** `lines 40–120` for a partial Read; absent for a whole file. */
  range?: string
  /** The first line it covered, 1-based. */
  from?: number
  /** How many lines it returned. */
  lines?: number
}

/** One Markdown file read in this session, by the Read tool or a shell reader. */
export type ContextViewMdRead = {
  /** Relative to the session's working directory when under it, else absolute; forward slashes. */
  path: string
  /** The folder part of `path`, `.` for the root. */
  folder: string
  /** Approximate tokens of every read together (four characters a token). */
  tokens: number
  /** How many times it was read. */
  count: number
  /** Whether a read showed a fenced ```meta block. */
  hasMeta: boolean
  /** Devbook chapter addresses the reads showed: the file, or `file#heading`. */
  chapters: string[]
  /** Which tool read it last. */
  via: string
  /** Its headings, indented by level, from the fullest read. */
  outline: string[]
  /** The path-scoped rules a read of it fired. */
  rules: string[]
  /** Each read, newest last, capped. */
  events: ContextViewReadEvent[]
}

export type ContextViewInstructionKind = 'memory' | 'rule' | 'skill' | 'agent' | 'output-style' | 'hook'

/** Something that happened to an instruction source: an invocation, a match, a row. */
export type ContextViewInstructionEvent = { at: number; turn: number; note: string }

/** One instruction source that entered this session's context, with its approximate cost. */
export type ContextViewInstruction = {
  kind: ContextViewInstructionKind
  /** The display name: a path, a skill, an agent type, a style, a hook event. */
  name: string
  tokens: number
  /** What brought it in: `@ import of CLAUDE.md`, `matched plugins/x/agents/a.agent.md`. */
  detail?: string
  /** Its headings, indented by level, when it is text the module saw. */
  outline?: string[]
  /** A memory file's `@` imports; a rule's globs; an output style's section ids. */
  refs?: string[]
  /** Every path a rule matched; every call an agent or skill took. */
  events?: ContextViewInstructionEvent[]
}

/** A `.claude/rules/*.md` file that loads only when a path its globs match is read. */
export type ContextViewRule = { path: string; globs: string[]; tokens: number; outline: string[] }

declare module 'claude-code' {
  interface PluginState {
    'claude-desktop-mods': {
      contextReads: ContextViewMdRead[]
      contextInstructions: ContextViewInstruction[]
      contextRules: ContextViewRule[]
      /** The highest input-token count any response of this session was answered over. */
      contextPeak: number
      /** Approximate tokens tool results added, by tool: the fallback categories. */
      contextByTool: Record<string, number>
      /** Devbook warnings, newest last, each written once. */
      contextWarnings: string[]
      /** Devbook files read in the current turn, by folder root. */
      contextTurnReads: Record<string, string[]>
      /** How many Markdown files each devbook folder root holds, counted on first read. */
      contextFolderSizes: Record<string, number>
      /** Skill names whose body has not yet been seen in the conversation. */
      contextPendingSkills: string[]
      /** The turn count since the module loaded. */
      contextTurn: number
      /** The line the pane is zoomed into (`md:<path>`, `in:<kind>:<name>`, `cat:<name>`, `db:<folder>`); empty for the overview. */
      contextFocus: string
      /** Folded sections of the overview, by id, and `instructions-all` when every instruction row shows. */
      contextFolded: Record<string, boolean>
    }
  }
}
