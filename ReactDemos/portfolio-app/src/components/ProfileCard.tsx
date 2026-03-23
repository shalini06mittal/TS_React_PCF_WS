//import type {FC} from "react";
// import SkillBadge from './SkillBadge';
// import styles from './ProfileCard.module.css';

// import type { Profile } from '../data/profiles';


// Re-use the Profile interface as props
// Omit id since the card doesn't need it
// type ProfileCardProps = Omit<Profile, 'id'>;

type ProfileCardProps = {
  name: string
  role: string
  skills: string[]
  isActive?: boolean        // the ? makes this optional
  bio: string
  avatarUrl?: string;   // optional
  featured?: boolean;  // optional — defaults to false
  onSelect?: (name: string) => void   // a function prop
}


//const ProfileCard : FC= () => {

// OR 

function ProfileCard({ name, role, skills, isActive = true, bio, avatarUrl,
  featured = false,  // default prop value
  onSelect }: ProfileCardProps){


  // Data lives inside the component for now
  // const name = "Alex Chen"
  // const role = "Portfolio Manager!!"
  // const skills = ["Equities", "Fixed Income", "ETFs"]

  return (
    <div style={{ background: '#1e3a5f', borderRadius: '12px', padding: '1.5rem', color: 'white', border: featured ? '3px groove #cbb78b' :'#fff' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 	        {avatarUrl ? (
                 <img src={avatarUrl} alt={name} style={{width:'56px',height:'56px',   
                         borderRadius:'50%',
                         objectFit:'cover', border: '2px solid #0D9488'}} />
                    ) : (
                      <div style={{width:'56px',height:'56px',  borderRadius:'50%',background:'#0D9488', fontSize:'1rem'}}>
                             No image</div>
              )}

            <h2>{name}</h2>
            <span style={{
              background: isActive ? 'rgba(34,197,94,0.2)' : 'rgba(68, 35, 35, 0.2)',
              color: isActive ? '#86efac' : '#fca5a5',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '12px',
            }}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

            <p>{role}</p>
            <p>{bio}</p>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        {skills.map((skill) => (
          <span key={skill} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '13px',
            }}>{skill}</span>
        ))}
      </div>
            <button
        onClick={() => onSelect?.(name)}
        style={{
          marginTop: '1rem',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(255,255,255,0.15)',
          color: 'white',
          cursor: 'pointer',
          fontSize: '13px',
        }}
      >
        Select Manager
      </button>

    </div>
  )
}


/**
 * 
 * BELOW CODE IS FROM THE EXTRA SECTION: 
 */
// function ProfileCard({
//   name,
//   role,
//   bio,
//   skills,
//   avatarUrl,
//   featured = false,  // default prop value
//   isActive=true
// }: ProfileCardProps) {
//   // Derive initials for avatar placeholder
//   const initials = name
//     .split(' ')
//     .map(n => n[0])
//     .join('');

//   // Compose class names: always .card, add .featured if prop is true
//   const cardClass = [
//     styles.card,
//     featured ? styles.featured : '',
//   ].join(' ');

//   return (
//     <div className={cardClass}>
//       {/* Header row: avatar + name/role */}
//       <div className={styles.header}>
//         {avatarUrl ? (
//           <img src={avatarUrl} alt={name} className={styles.avatar} />
//         ) : (
//           <div className={styles.avatarPlaceholder}>{initials}</div>
//         )}
//         <div>
//           <p className={styles.name}>{name}</p>
//           <p className={styles.role}>{role}</p>
//         </div>
//         {featured && (
//           <span className={styles.featuredBadge}>Featured</span>
//         )}
//         <span className={isActive? styles.pactive: styles.pinactive}>
//           {isActive ? 'Active' : 'Inactive'}
//       </span>
//       </div>
      
//       {/* Bio */}
//       <p className={styles.bio}>{bio}</p>

//       {/* Skills — reusable SkillBadge components */}
//       <div className={styles.skillsSection}>
//         {skills.map((skill) => (
//           <SkillBadge key={skill} label={skill} />
//         ))}
//       </div>
//     </div>
//   );
// }

 export default ProfileCard;

