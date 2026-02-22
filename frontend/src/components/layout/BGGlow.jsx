export default function BGGlow() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-float-a"
        style={{
          background: 'radial-gradient(circle, rgba(50,200,100,0.08) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full animate-float-b"
        style={{
          background: 'radial-gradient(circle, rgba(147,80,255,0.06) 0%, transparent 70%)',
          bottom: '-10%',
          right: '-10%',
        }}
      />
    </div>
  )
}
