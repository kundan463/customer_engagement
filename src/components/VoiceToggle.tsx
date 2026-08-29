import { primeVoice, setVoiceOn, useVoiceOn, voiceSupported } from '../voice'
import { Icon } from './Icon'

/**
 * Mute for the demo voice, which is on by default.
 *
 * It is still a real button rather than a stored preference: pressing it is
 * a gesture, and on the way back from muted that is the one browsers count.
 */
export function VoiceToggle({ label = 'Sound' }: { label?: string }) {
  const on = useVoiceOn()
  if (!voiceSupported()) return null

  return (
    <button
      type="button"
      className={`vt${on ? ' is-on' : ''}`}
      onClick={() => { primeVoice(); setVoiceOn(!on) }}
      aria-pressed={on}
      title={on ? 'Turn the demo voice off' : 'Hear the demo out loud'}
    >
      <Icon name={on ? 'voice' : 'mute'} size={13} />
      <span>{label} {on ? 'on' : 'off'}</span>
    </button>
  )
}
