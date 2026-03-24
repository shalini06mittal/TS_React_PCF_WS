import { useState } from "react";

type Tab = 'overview' | 'details' | 'history'
 
function TabBar() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
 
  return (
    <div>
      <div style={{ display: "flex", gap: "8px" }}>
        {(['overview', 'details', 'history'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ fontWeight: activeTab === tab ? "bold" : "normal", color: activeTab === tab ? "blue" : "black" }}
          >
            {tab}
          </button>
        ))}
      </div>
 
      <p>You are on: {activeTab}</p>
    </div>
  )
}

export default TabBar;