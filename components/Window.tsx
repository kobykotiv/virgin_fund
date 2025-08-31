"use client"

import React from 'react'

interface WindowProps {
	id: string
	title?: string
	isMinimized?: boolean
	isMaximized?: boolean
	onClose?: () => void
	onMinimize?: () => void
	onMaximize?: () => void
	onFocus?: () => void
	zIndex?: number
	initialPosition?: { x: number; y: number }
	initialSize?: { width: number; height: number }
	children?: React.ReactNode
}

export const Window: React.FC<WindowProps> = ({
	id,
	title,
	isMinimized,
	isMaximized,
	onClose,
	onMinimize,
	onMaximize,
	onFocus,
	zIndex = 1,
	initialPosition = { x: 100, y: 100 },
	initialSize = { width: 600, height: 400 },
	children
}) => {
	if (isMinimized) return null

	const style: React.CSSProperties = {
		position: 'absolute',
		left: initialPosition.x,
		top: initialPosition.y,
		width: initialSize.width,
		height: initialSize.height,
		zIndex,
		background: 'white',
		border: '1px solid #e5e7eb',
		boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden'
	}

	return (
		<div style={style} onMouseDown={onFocus} data-window-id={id}>
			<div style={{ padding: 8, borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
				<strong>{title}</strong>
				<div style={{ float: 'right' }}>
					<button onClick={onMinimize} aria-label="Minimize">_</button>
					<button onClick={onMaximize} aria-label="Maximize">[ ]</button>
					<button onClick={onClose} aria-label="Close">×</button>
				</div>
			</div>
			<div style={{ padding: 8, flex: 1, overflow: 'auto' }}>{children}</div>
		</div>
	)
}

export default Window
