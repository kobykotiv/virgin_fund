"use client"

import React, { useState, useEffect } from 'react'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { ResizableBox } from 'react-resizable'
import 'react-resizable/css/styles.css'

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
	const [pos, setPos] = useState<{ x: number; y: number }>(initialPosition)
	const [size, setSize] = useState<{ width: number; height: number }>(initialSize)

	useEffect(() => {
		setPos(initialPosition)
	}, [initialPosition.x, initialPosition.y])

	useEffect(() => {
		setSize(initialSize)
	}, [initialSize.width, initialSize.height])

	if (isMinimized) return null

	const headerStyle: React.CSSProperties = {
		padding: 8,
		borderBottom: '1px solid #f3f4f6',
		background: '#fafafa',
		cursor: 'move',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	}

	return (
			<Draggable
				handle=".window-header"
				defaultPosition={{ x: pos.x, y: pos.y }}
				position={pos}
				onStop={(_e: any, data: any) => setPos({ x: data.x, y: data.y })}
			>
				<div style={{ position: 'absolute', zIndex, left: 0, top: 0 }} data-window-id={id} onMouseDown={onFocus}>
					<ResizableBox width={isMaximized ? window.innerWidth : size.width} height={isMaximized ? window.innerHeight - 48 : size.height} minConstraints={[300, 200]} onResizeStop={(_e: any, data: any) => setSize({ width: data.size.width, height: data.size.height })}>
					<div style={{ width: '100%', height: '100%', background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
						<div className="window-header" style={headerStyle} onDoubleClick={onMaximize}>
							<strong style={{ userSelect: 'none' }}>{title}</strong>
							<div>
								<button onClick={onMinimize} aria-label="Minimize">_</button>
								<button onClick={onMaximize} aria-label="Maximize">[ ]</button>
								<button onClick={onClose} aria-label="Close">×</button>
							</div>
						</div>
						<div style={{ padding: 8, flex: 1, overflow: 'auto' }}>{children}</div>
					</div>
				</ResizableBox>
			</div>
		</Draggable>
	)
}

export default Window
