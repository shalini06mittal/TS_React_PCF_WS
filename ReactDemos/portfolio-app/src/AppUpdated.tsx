// import './App.css'

import ProfileCard from "./components/ProfileCard"

// import { profiles } from './data/profiles';

function AppUpdated() {

  const handleSelectManager = (name: string) => {
    alert(`Manager selected ${name}`)
  }

  return (
     <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1>Portfolio Dashboard</h1>
      <ProfileCard
        name="Alex Chen"
        role="Portfolio Manager"
        skills={['Equities', 'Fixed Income', 'ETFs']}
        bio="Builds and manages investment portfolios to maximize returns while balancing risk."
	    featured={true}	  
       avatarUrl="https://picsum.photos/200"   
    />

      <ProfileCard
        name="Sara Patel"
        role="Risk Analyst"
        skills={['Derivatives', 'Options', 'Hedging']}
        bio="Identifies, measures, and mitigates financial risks to protect assets and ensure stability."
        avatarUrl="https://picsum.photos/200"
        isActive={false}
        onSelect={handleSelectManager}
      />
      <ProfileCard
        name="James Okafor"
        role="Quant Researcher"
        skills={['Algo Trading', 'Python', 'Statistics']}
        bio="Develops data-driven models and algorithms to uncover market insights and optimize trading strategies"
        onSelect={handleSelectManager}
      /> 

          {/* {profiles.map(profile => (
              <ProfileCard
                    key={profile.id}
                      name={profile.name}
                      role={profile.role}
                      skills={profile.skills}
                      bio={profile.bio}
                      avatarUrl={profile.avatarUrl}
                      featured={profile.featured}
                      isActive = {profile.isActive}
                      onSelect={handleSelectManager}
              />
          ))} */}
      
     

    </div>
  )
}

export default AppUpdated
