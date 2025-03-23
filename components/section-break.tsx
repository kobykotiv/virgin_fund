import Image from "next/image"

interface SectionBreakProps {
  className?: string
  height?: number
}

export const SectionBreak = ({ className = "", height = 8 }: SectionBreakProps) => {
  return (
    <div className={`w-full relative overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      <div className="absolute inset-0 w-full opacity-70">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_3_tiled_6x.png-99jkMXkp4qYbQIHTu23yHizkXO65ZO.jpeg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export const SectionDivider = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`my-8 ${className}`}>
      <SectionBreak />
      <div className="h-px bg-border my-2" />
      <SectionBreak />
    </div>
  )
}

