import { useState, useRef, useEffect } from 'react'
import './App.css'
import dancingGif from './assets/dancing.gif'

const PRESETS = [375, 768, 1024, 1280, 1440, 1920]

function Eyebrow({ text }) {
  if (!text) return null
  return <div className="eyebrow">{text}</div>
}

function AccountActionsBar({ headline, tileLabels, tileCount }) {
  const ventureName = tileLabels[0] || 'Venture Name'
  const initial = ventureName[0].toUpperCase()
  return (
    <div className="actions-bar">
      <div className="actions-bar__lockup">
        {headline && <span className="actions-bar__heading">{headline}</span>}
      </div>
      <div className="actions-bar__tiles-wrap">
        <div className="actions-bar__tiles">
          <div className="action-tile action-tile--venture">
            <div className="action-tile__avatar">{initial}</div>
            <span className="action-tile__label">{ventureName}</span>
            <span className="action-tile__chev">›</span>
          </div>
          {tileLabels.slice(1, tileCount).map((label, i) => (
            <div key={i} className="action-tile">
              <div className="action-tile__icon" />
              <span className="action-tile__label">{label}</span>
              <span className="action-tile__chev">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActionMarqueeCard({ eyebrow, headline, body, cta }) {
  return (
    <div className="card marquee-card">
      <div className="marquee-card__text">
        <Eyebrow text={eyebrow} />
        <h2 className="headline">{headline || 'Headline goes here'}</h2>
        {body && <p className="body-copy">{body}</p>}
        <button className="btn btn--dark">{cta || 'Get Started'}</button>
      </div>
      <div className="marquee-card__media" aria-hidden="true" />
    </div>
  )
}

function FlexPlacement({ eyebrow, headline, cta1, cta2 }) {
  return (
    <div className="flex-placement">
      <div className="flex-placement__content">
        <Eyebrow text={eyebrow} />
        <h2 className="headline headline--flex">{headline || 'Headline goes here'}</h2>
        <div className="flex-placement__btns">
          <button className="btn btn--dark btn--small">{cta1 || 'Get Started'}</button>
          {cta2 && <button className="btn btn--outline btn--small">{cta2}</button>}
        </div>
      </div>
      <div className="flex-placement__icon" aria-hidden="true" />
    </div>
  )
}

function Field({ label, value, onChange, multiline, rows = 3 }) {
  const chars = value.length
  const words = value.trim() === '' ? 0 : value.trim().split(/\s+/).length
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {multiline
        ? <textarea className="field__ctrl" value={value} onChange={e => onChange(e.target.value)} rows={rows} />
        : <input className="field__ctrl" value={value} onChange={e => onChange(e.target.value)} />
      }
      <div className="field__counts">
        <span className="field__word-count">{words}w</span>
        <span className="field__char-count">{chars} chars</span>
      </div>
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select className="field__ctrl field__ctrl--select" value={value} onChange={e => onChange(Number(e.target.value))}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}

export default function App() {
  const [barHeadline, setBarHeadline] = useState('Hey Michael, pick up where you left off')
  const [tileCount, setTileCount] = useState(4)
  const [tileLabels, setTileLabels] = useState(['Venture Name', 'Domain', 'Hosting', 'Email'])

  const [eyebrow, setEyebrow] = useState('EMAIL AND MICROSOFT® 365')
  const [mainHl, setMainHl] = useState('Boost credibility with branded email')
  const [mainBody, setMainBody] = useState('Get a professional, branded email with shared calendars and up to 400 aliases, then add Microsoft 365 apps like Word, Excel, and Teams as you grow.')
  const [mainCta, setMainCta] = useState('Get Started')

  const [flexEyebrow, setFlexEyebrow] = useState('NEW AIRO AI BUILDER')
  const [flexHl, setFlexHl] = useState('Create production ready apps in minutes')
  const [flexCta1, setFlexCta1] = useState('Get Started')
  const [flexCta2, setFlexCta2] = useState('Learn More')

  const [vpW, setVpW] = useState(1440)
  const [vpInput, setVpInput] = useState('1440')
  const [canvasW, setCanvasW] = useState(0)
  const [vpH, setVpH] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [exportKey, setExportKey] = useState(0)

  const canvasRef = useRef(null)
  const vpRef = useRef(null)
  const vpInputRef = useRef(null)
  const dragging = useRef(false)
  const startX = useRef(0)
  const startW = useRef(0)

  useEffect(() => {
    if (document.activeElement !== vpInputRef.current) {
      setVpInput(String(Math.round(vpW)))
    }
  }, [vpW])

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === canvasRef.current) setCanvasW(entry.contentRect.width)
        if (entry.target === vpRef.current) setVpH(entry.contentRect.height)
      }
    })
    if (canvasRef.current) obs.observe(canvasRef.current)
    if (vpRef.current) obs.observe(vpRef.current)
    return () => obs.disconnect()
  }, [])

  const availW = canvasW > 0 ? canvasW - 80 - 18 : vpW
  const scale = Math.min(1, availW / vpW)

  const commitWidth = () => {
    const v = parseInt(vpInput, 10)
    if (!isNaN(v)) setVpW(Math.max(320, Math.min(1920, v)))
    else setVpInput(String(Math.round(vpW)))
  }

  const onHandleDown = (e) => {
    dragging.current = true
    startX.current = e.clientX
    startW.current = vpW
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      setVpW(Math.max(320, Math.min(1920, startW.current + (e.clientX - startX.current))))
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const exportScreenshots = async () => {
    setExportKey(k => k + 1)
    setExporting(true)
    const [{ default: html2canvas }, { default: JSZip }] = await Promise.all([
      import('html2canvas'),
      import('jszip')
    ])
    const zip = new JSZip()
    const folder = zip.folder('recore-screens')
    const originalVpW = vpW

    for (const bp of PRESETS) {
      setVpW(bp)
      setVpInput(String(bp))
      await new Promise(resolve => setTimeout(resolve, 350))

      const el = vpRef.current
      if (!el) continue

      const prevTransform = el.style.transform
      const prevOrigin = el.style.transformOrigin
      el.style.transform = 'none'
      el.style.transformOrigin = ''

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        width: bp,
        height: el.scrollHeight,
        windowWidth: bp,
      })

      el.style.transform = prevTransform
      el.style.transformOrigin = prevOrigin

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
      folder.file(`recore-${bp}px.png`, blob)
    }

    setVpW(originalVpW)
    setVpInput(String(originalVpW))

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'recore-screens.zip'
    a.click()
    URL.revokeObjectURL(url)
    setExporting(false)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__left">
          <div className="topbar__logo">GD</div>
          <span className="topbar__title">ReCore Emulation Tool</span>
        </div>
        <div className="topbar__right">
          {PRESETS.map(bp => (
            <button
              key={bp}
              className={`bp-btn${Math.round(vpW) === bp ? ' bp-btn--active' : ''}`}
              onClick={() => setVpW(bp)}
            >
              {bp}
            </button>
          ))}
          <input
            ref={vpInputRef}
            className="topbar__badge"
            type="text"
            inputMode="numeric"
            value={vpInput}
            onChange={e => setVpInput(e.target.value)}
            onFocus={e => e.target.select()}
            onBlur={commitWidth}
            onKeyDown={e => {
              if (e.key === 'Enter') { commitWidth(); e.target.blur() }
              if (e.key === 'Escape') { setVpInput(String(Math.round(vpW))); e.target.blur() }
            }}
          />
          <button
            className={`export-btn${exporting ? ' export-btn--loading' : ''}`}
            onClick={exportScreenshots}
            disabled={exporting}
          >
            {exporting ? 'Exporting…' : 'Export PNGs'}
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="panel">

          <div className="panel__group">
            <div className="panel__group-label">AccountActionsBar</div>
            <Field label="Headline" value={barHeadline} onChange={setBarHeadline} />
            <SelectField label="Number of tiles" value={tileCount} onChange={setTileCount} options={[1, 2, 3, 4]} />
            {tileLabels.slice(0, tileCount).map((label, i) => (
              <Field
                key={i}
                label={i === 0 ? 'Venture Name' : `Tile ${i + 1}`}
                value={label}
                onChange={v => setTileLabels(prev => prev.map((l, idx) => idx === i ? v : l))}
              />
            ))}
          </div>

          <div className="panel__sep" />

          <div className="panel__group">
            <div className="panel__group-label">ActionMarqueeCard</div>
            <Field label="Eyebrow" value={eyebrow} onChange={setEyebrow} />
            <Field label="Headline" value={mainHl} onChange={setMainHl} multiline rows={3} />
            <Field label="Body Copy" value={mainBody} onChange={setMainBody} multiline rows={4} />
            <Field label="CTA Label" value={mainCta} onChange={setMainCta} />
          </div>

          <div className="panel__sep" />

          <div className="panel__group">
            <div className="panel__group-label">FlexPlacement</div>
            <Field label="Eyebrow" value={flexEyebrow} onChange={setFlexEyebrow} />
            <Field label="Headline" value={flexHl} onChange={setFlexHl} multiline rows={3} />
            <Field label="Primary CTA" value={flexCta1} onChange={setFlexCta1} />
            <Field label="Secondary CTA" value={flexCta2} onChange={setFlexCta2} />
          </div>

        </aside>

        <main className="canvas" ref={canvasRef}>
          <div className="vp-wrap">
            <div
              className="vp-scaler"
              style={{
                width: vpW * scale,
                height: vpH > 0 ? vpH * scale : undefined,
              }}
            >
              <div
                ref={vpRef}
                className="vp"
                style={{
                  width: vpW,
                  ...(scale < 1 && {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }),
                }}
              >
                <div className="recore-bento">
                  <AccountActionsBar headline={barHeadline} tileLabels={tileLabels} tileCount={tileCount} />
                  <div className="cards-row">
                    <ActionMarqueeCard
                      eyebrow={eyebrow}
                      headline={mainHl}
                      body={mainBody}
                      cta={mainCta}
                    />
                    <FlexPlacement
                      eyebrow={flexEyebrow}
                      headline={flexHl}
                      cta1={flexCta1}
                      cta2={flexCta2}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="drag-handle" onMouseDown={onHandleDown} title="Drag to resize viewport">
              <div className="grip">
                <div className="grip__dot" />
                <div className="grip__dot" />
                <div className="grip__dot" />
              </div>
            </div>
          </div>
          <div className="vp-label">
            {Math.round(vpW)}px wide
            {scale < 1 && <span className="vp-zoom"> · {Math.round(scale * 100)}%</span>}
          </div>
        </main>
      </div>

      <div className={`export-overlay${exporting ? '' : ' export-overlay--hidden'}`}>
        <img key={exportKey} src={dancingGif} alt="" className="export-overlay__gif" />
        <span className="export-overlay__label">Processing</span>
      </div>
    </div>
  )
}
