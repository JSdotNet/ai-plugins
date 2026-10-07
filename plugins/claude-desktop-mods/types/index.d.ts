// The $.state contract of claude-desktop-mods' context-view hooks module
// (hooks/context-view/register.tsx). Claude Code only.

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
}

export type ContextViewInstructionKind = 'memory' | 'rule' | 'skill' | 'agent' | 'output-style' | 'hook'

/** One instruction source that entered this session's context, with its approximate cost. */
export type ContextViewInstruction = {
  kind: ContextViewInstructionKind
  /** The display name: a path, a skill, an agent type, a style, a hook event. */
  name: string
  tokens: number
  /** What brought it in: `@ import of CLAUDE.md`, `matched plugins/x/agents/a.agent.md`. */
  detail?: string
}

/** A `.claude/rules/*.md` file that loads only when a path its globs match is read. */
export type ContextViewRule = { path: string; globs: string[]; tokens: number }

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
    }
  }
}
