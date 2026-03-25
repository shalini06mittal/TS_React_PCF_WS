import { useState } from 'react'
import type { Profile, ProfileFormState, ProfileFormErrors } from '../data/profiles'
import { ROLE_OPTIONS } from '../data/profiles'
 
// Props: parent passes onAdd (to receive the new profile) and onCancel
interface AddProfileFormProps {
  onAdd:    (profile: Profile) => void
  onCancel: () => void
}
 
// ── Initial form state ────────────────────────────────────────────────
const init: ProfileFormState = {
  name:     "",
  role:     "",
  bio:      "",
  skills:   "",
  isActive: true,
  featured: false,
}
 
// ── Field-level validation rules ─────────────────────────────────────
const validateField = (
  name: keyof ProfileFormState,
  value: unknown
): string => {
  switch (name) {
    case "name":
      if (!String(value).trim())         return "Name is required"
      if (String(value).trim().length<2) return "Name must be at least 2 characters"
      return ""
    case "role":
      if (!String(value))                return "Please select a role"
      return ""
    case "bio":
      if (!String(value).trim())         return "Bio is required"
      if (String(value).trim().length<10) return "Bio must be at least 10 characters"
      return ""
    case "skills":
      if (!String(value).trim())         return "At least one skill is required"
      return ""
    default:
      return ""
  }
}
 
// ── ErrorMsg helper ──────────────────────────────────────────────────
const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? (
    <span style={{ color:"#ef4444", fontSize:"12px",
                   display:"block", marginTop:"4px" }}>
      {msg}
    </span>
  ) : null
 
// ── Component ─────────────────────────────────────────────────────────
function AddProfileForm({ onAdd, onCancel }: AddProfileFormProps) {
  const [form,   setForm]   = useState<ProfileFormState>(init)
  const [errors, setErrors] = useState<ProfileFormErrors>({})
 
  // ── Generic change handler (text, select, checkbox) ────────────────
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const v = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value
    setForm(prev => ({ ...prev, [name]: v }))
    // Clear error as user corrects the field
    if (errors[name as keyof ProfileFormState]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }
 
  // ── Blur handler: validate single field on leave ────────────────────
  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    const v = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : value
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name as keyof ProfileFormState, v),
    }))
  }
 
  // ── Submit handler ─────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 1. Validate all fields at once
    const newErrors: ProfileFormErrors = {}
    ;(Object.keys(form) as (keyof ProfileFormState)[]).forEach(key => {
      const msg = validateField(key, form[key])
      if (msg) newErrors[key] = msg
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
 
    // 2. Convert form state → Profile object
    const newProfile: Profile = {
      id:        Date.now(),
      name:      form.name.trim(),
      role:      form.role,
      bio:       form.bio.trim(),
      // Split comma-separated skills string into array
      skills:    form.skills
                   .split(",")
                   .map(s => s.trim())
                   .filter(s => s.length > 0),
      isActive:  form.isActive,
      featured:  form.featured,
      // DiceBear avatar seeded from timestamp
      avatarUrl: `https://api.dicebear.com/9.x/adventurer/svg?seed=${Date.now()}`,
    }
 
    // 3. Log to console and pass to parent
    console.log("New profile:", newProfile)
    onAdd(newProfile)
  }
 
  // ── Style helpers ──────────────────────────────────────────────────
  const fieldStyle = (name: keyof ProfileFormState): React.CSSProperties => ({
    display: "block",
    width: "100%",
    padding: "10px 14px",
    marginTop: "6px",
    border: `1px solid ${errors[name] ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  })
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: "600",
    fontSize: "14px",
    color: "#1a2b4a",
    marginTop: "1.25rem",
  }
 
  // ── JSX ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate
      style={{ padding: "2rem", maxWidth: "520px" }}
    >
      <h2 style={{ color:"#1a2b4a", marginBottom:"0.25rem" }}>
        Add New Profile
      </h2>
      <p style={{ color:"#64748b", fontSize:"14px", marginBottom:"1.5rem" }}>
        Fill in the details below to add a new team member.
      </p>
 
      {/* ── Name (text) ─────────────────────────────────────────── */}
      <label htmlFor="name" style={labelStyle}>Full name *</label>
      <input
        id="name" name="name" type="text"
        placeholder="e.g. Priya Sharma"
        value={form.name}
        onChange={handleChange}
        onBlur={handleBlur}
        style={fieldStyle("name")}
      />
      <ErrorMsg msg={errors.name} />
 
      {/* ── Role (select / dropdown) ────────────────────────────── */}
      <label htmlFor="role" style={labelStyle}>Role *</label>
      <select
        id="role" name="role"
        value={form.role}
        onChange={handleChange}
        onBlur={handleBlur}
        style={fieldStyle("role")}
      >
        <option value="">-- select a role --</option>
        {ROLE_OPTIONS.map(r => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <ErrorMsg msg={errors.role} />
 
      {/* ── Bio (textarea) ──────────────────────────────────────── */}
      <label htmlFor="bio" style={labelStyle}>Bio *</label>
      <textarea
        id="bio" name="bio" rows={3}
        placeholder="Brief description of their expertise..."
        value={form.bio}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{ ...fieldStyle("bio"), resize:"vertical" }}
      />
      <ErrorMsg msg={errors.bio} />
 
      {/* ── Skills (text → array on submit) ─────────────────────── */}
      <label htmlFor="skills" style={labelStyle}>
        Skills * <span style={{ fontWeight:"normal", color:"#94a3b8" }}>
          (comma-separated)
        </span>
      </label>
      <input
        id="skills" name="skills" type="text"
        placeholder="e.g. Equities, Fixed Income, ETFs"
        value={form.skills}
        onChange={handleChange}
        onBlur={handleBlur}
        style={fieldStyle("skills")}
      />
      <ErrorMsg msg={errors.skills} />
 
      {/* ── isActive (checkbox) ─────────────────────────────────── */}
      <label style={{ ...labelStyle, display:"flex", alignItems:"center",
                      gap:"10px", cursor:"pointer" }}>
        <input
          type="checkbox" name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          style={{ width:"18px", height:"18px", accentColor:"#0D9488" }}
        />
        Mark as Active
      </label>
 
      {/* ── featured (checkbox) ─────────────────────────────────── */}
      <label style={{ ...labelStyle, display:"flex", alignItems:"center",
                      gap:"10px", cursor:"pointer", marginTop:"0.75rem" }}>
        <input
          type="checkbox" name="featured"
          checked={form.featured}
          onChange={handleChange}
          style={{ width:"18px", height:"18px", accentColor:"#0D9488" }}
        />
        Feature this profile
      </label>
 
      {/* ── Actions ─────────────────────────────────────────────── */}
      <div style={{ display:"flex", gap:"12px", marginTop:"2rem" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: "12px",
            background: "#0D9488",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Add Profile
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "12px",
            background: "transparent",
            color: "#64748b",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
 
export default AddProfileForm
