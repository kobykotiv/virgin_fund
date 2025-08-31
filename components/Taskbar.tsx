"use client"

import React from 'react'
import { StartMenu } from './StartMenu'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Menu, Minimize2, X, Clock } from 'lucide-react'

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
	isStartMenuOpen?: boolean
	onToggleStartMenu?: () => void
}

export const Taskbar: React.FC<TaskbarProps> = ({
	windows = [],
	onWindowClick,
	onMinimizeAll,
	onCloseWindow,
	isStartMenuOpen = false,
	onToggleStartMenu
}) => {
	const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

	return (
		<>
			<div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 flex items-center px-4 z-40">
				{/* Start Menu Button */}
				<Button
					variant="ghost"
					size="sm"
					className="mr-4 px-3 py-1 h-8 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
					onClick={onToggleStartMenu}
				>
					<Menu className="w-4 h-4 mr-2" />
					Start
				</Button>

				{/* Window Buttons */}
				<div className="flex gap-2 flex-1">
					{windows.map(w => (
						<div
							key={w.id}
							className={`px-3 py-1 rounded-md cursor-pointer flex items-center gap-2 text-sm transition-all ${
								w.isMinimized
									? 'bg-slate-700/50 text-slate-400'
									: 'bg-slate-700 text-white hover:bg-slate-600'
							}`}
							onClick={() => onWindowClick?.(w.id)}
						>
							<span className="truncate max-w-32">{w.title}</span>
							<Button
								variant="ghost"
								size="sm"
								className="h-4 w-4 p-0 hover:bg-red-500/20"
								onClick={(e) => {
									e.stopPropagation()
									onCloseWindow?.(w.id)
								}}
							>
								<X className="w-3 h-3" />
							</Button>
						</div>
					))}
				</div>

				{/* Right side controls */}
				<div className="flex items-center gap-2 ml-4">
					<Button
						variant="ghost"
						size="sm"
						className="px-2 py-1 h-8 text-slate-400 hover:text-white hover:bg-slate-700"
						onClick={onMinimizeAll}
						title="Minimize All Windows"
					>
						<Minimize2 className="w-4 h-4" />
					</Button>

					{/* Time display */}
					<div className="flex items-center gap-1 text-white text-sm font-mono px-2 py-1 bg-slate-800 rounded">
						<Clock className="w-3 h-3" />
						{currentTime}
					</div>
				</div>
			</div>

			{/* Start Menu */}
			<StartMenu
				isOpen={isStartMenuOpen}
				onClose={onToggleStartMenu || (() => {})}
			/>
		</>
	)
}

export default Taskbar
