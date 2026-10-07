// The spec-builder hooks module's session state: the budgeted files it already toasted
// about, so a reload or a second crossing in the same session stays quiet.
export type SpecBuilderToasted = string[]

declare module 'claude-code' {
  interface PluginState {
    'spec-builder': { toasted: SpecBuilderToasted }
  }
}
