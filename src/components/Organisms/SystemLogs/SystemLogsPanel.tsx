import { useEffect, useState } from 'react'
import { getSystemLogs } from '../../../services/systemLog.service'
import type { SystemLog } from '../../../services/systemLog.service'

const SystemLogsPanel = () => {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true

    getSystemLogs({ limit: 50 })
      .then((result) => {
        if (!active) return
        setLogs(result.system_logs)
        setStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
      <div className="border-b border-outline-variant/20 p-xl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">System Logs</h2>
        <p className="mt-xs font-body-sm text-body-sm text-on-surface-variant">Audit trail for role, status, admin, and critical data changes.</p>
      </div>

      {status === 'loading' && <div className="p-xl font-body-sm text-body-sm text-on-surface-variant">Loading system logs...</div>}
      {status === 'error' && (
        <div className="m-lg rounded-lg bg-error-container px-md py-sm font-body-sm text-body-sm text-on-error-container">
          Unable to load system logs.
        </div>
      )}
      {status === 'ready' && logs.length === 0 && (
        <div className="p-xl text-center font-body-md text-body-md text-on-surface-variant">No system logs found.</div>
      )}
      {logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-outline-variant/20 bg-surface-container-low">
              <tr>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Time</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Actor</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Action</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Target</th>
                <th className="px-xl py-md font-label-md text-label-md text-on-surface-variant">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {logs.map((log) => (
                <tr className="transition-colors hover:bg-surface-container-low" key={log.id}>
                  <td className="whitespace-nowrap px-xl py-lg font-body-sm text-body-sm text-on-surface">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">
                    {log.actor?.email || (log.actor_user_id ? `User #${log.actor_user_id}` : 'System')}
                  </td>
                  <td className="px-xl py-lg font-label-sm text-label-sm text-on-surface">{log.action}</td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface">
                    {log.target_type || '-'} {log.target_id ? `#${log.target_id}` : ''}
                  </td>
                  <td className="px-xl py-lg font-body-sm text-body-sm text-on-surface-variant">{log.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default SystemLogsPanel
