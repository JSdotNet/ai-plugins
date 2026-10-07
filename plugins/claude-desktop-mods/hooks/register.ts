// The plugin's one hooks module: hooks.json names a single module, so each mod registers here.
// Only `on` crosses the import; each mod keeps every `$` call in its own file.

import type { Register } from 'claude-code'

import { register as contextView } from './context-view/register'
import { register as handoff } from './handoff'

export const register: Register = (on, options) => {
  handoff(on, options)
  contextView(on, options)
}
