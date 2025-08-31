"use client"

import React from 'react'

interface WindowInfo {
	id: string
	title: string
	isMinimized?: boolean
}

interface TaskbarProps {
	windows: WindowInfo[]
	onWindowClick?: (id: string) => void
	onMinimizeAll?: () => void
	onCloseWindow?: (id: string) => void
}

export const Taskbar: React.FC<TaskbarProps> = ({ windows = [], onWindowClick, onMinimizeAll, onCloseWindow }) => {
	return (
		<div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: '#111827', color: 'white', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
			<button onClick={onMinimizeAll} style={{ marginRight: 8 }}>Minimize All</button>
			<div style={{ display: 'flex', gap: 8 }}>
				{windows.map(w => (
					<div key={w.id} style={{ padding: '4px 8px', background: w.isMinimized ? '#374151' : '#1f2937', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => onWindowClick?.(w.id)}>
						<span style={{ marginRight: 8 }}>{w.title}</span>
						<button onClick={(e) => { e.stopPropagation(); onCloseWindow?.(w.id) }} style={{ marginLeft: 8 }}>x</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default Taskbar
