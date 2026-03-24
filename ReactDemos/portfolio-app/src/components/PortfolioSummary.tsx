import { useState } from 'react'
import type { PortfolioSummaryProps,  Toggleable } from '../data/profiles';

import './PortfolioSummary.css'

type Props = PortfolioSummaryProps & Toggleable
function PortfolioSummary({ ownerName, holdings, onClose }: Props) {

  // State 1: are the holdings expanded or collapsed?
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
 

  // Derived value (not state) — computed from holdings on every render
  const totalValue = holdings?.reduce((sum, h) => sum + h.value, 0)
  // Derived value (not state) — computed from holdings on every render

  return (
     <>
      {/* Backdrop */}
      <div className="backdrop" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="sidebar">

        {/* Close button */}
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>{ownerName}</h2>

        <p style={{ fontSize: "28px", fontWeight: "bold", margin: "8px 0" }}>
          ${totalValue?.toLocaleString()}
        </p>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "rgb(12, 116, 50)",
            border: "none",
            color: "white",
            borderRadius: "8px",
            padding: "6px 14px",
            cursor: "pointer",
            marginTop: "8px"
          }}
        >
          {isExpanded ? "Hide Holdings" : "Show Holdings"}
        </button>

        {isExpanded && (
          <div style={{ marginTop: "1rem" }}>
            {holdings?.map((holding) => (
              <div
                key={holding.ticker}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <span>
                  <strong>{holding.ticker}</strong> — {holding.name}
                </span>
                <span>
                  ${holding.value.toLocaleString()}
                  <span
                    style={{
                      color: holding.change >= 0 ? "rgb(12, 116, 50)" : "#fca5a5",
                      marginLeft: "8px"
                    }}
                  >
                    {holding.change >= 0 ? "+" : ""}
                    {holding.change}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default PortfolioSummary