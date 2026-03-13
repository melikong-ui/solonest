import { useState, useEffect, useRef } from "react";

const SAMPLE_LISTINGS = [
  {
    id: 1, name: "Sarah M.", avatar: "SM", location: "Brighton, UK", suburb: "Brighton",
    bedrooms: 3, available: "1 room available", rent: 650, children: "2 kids (ages 4 & 7)",
    bio: "Looking for another mum to share our lovely terrace house. We have a big garden, friendly cat, and I love cooking big Sunday dinners. My girls are school age so the house is quiet during the day.",
    amenities: ["Garden", "Pet-friendly", "Parking", "Washer/Dryer"],
    tags: ["Non-smoker", "Quiet evenings", "Co-parenting friendly"],
    posted: "2 days ago", photos: "🏡", verified: true,
  },
  {
    id: 2, name: "Amara K.", avatar: "AK", location: "Manchester, UK", suburb: "Didsbury",
    bedrooms: 4, available: "2 rooms available", rent: 520, children: "1 toddler (age 2)",
    bio: "I have a large 4-bed house and would love to fill it with warm energy. My son is a bundle of joy. I work from home part-time and enjoy yoga mornings. Looking for calm, kind housemates.",
    amenities: ["Home office", "Large kitchen", "Near schools", "Garden"],
    tags: ["WFH-friendly", "Yoga mornings", "Non-smoker"],
    posted: "5 days ago", photos: "🏠", verified: true,
  },
  {
    id: 3, name: "Priya R.", avatar: "PR", location: "Bristol, UK", suburb: "Clifton",
    bedrooms: 2, available: "1 room available", rent: 700, children: "1 daughter (age 9)",
    bio: "Sharing my beautiful Clifton flat. Walking distance to amazing schools and parks. My daughter is independent and loves art. I am a nurse working shifts so I would love someone flexible and understanding.",
    amenities: ["Near park", "Great transport", "Modern kitchen", "Balcony"],
    tags: ["Shift worker", "Art-loving household", "Girls-only"],
    posted: "1 week ago", photos: "🏢", verified: false,
  },
  {
    id: 4, name: "Jade T.", avatar: "JT", location: "London, UK", suburb: "Hackney",
    bedrooms: 3, available: "1 room available", rent: 900, children: "Twin boys (age 6)",
    bio: "East London terrace with two lively 6-year-olds. We are loud, loving and fun. Looking for someone with kids of a similar age. Close to the park and brilliant primary schools.",
    amenities: ["Loft storage", "Near Overground", "Playroom", "Garden"],
    tags: ["Kids welcome", "Active household", "LGBT+ friendly"],
    posted: "3 days ago", photos: "🏘️", verified: true,
  },
];

const SAMPLE_BUDDIES = [
  {
    id: 101, name: "Tania W.", avatar: "TW", age: 25,
    location: "Melville, WA", suburb: "Melville", area: "SOR",
    budget: 900, childrenAges: [5, 7], childrenDesc: "2 kids ages 5 & 7",
    message: "Hi, I am Tania, 25 years old with 2 young kids age 5 and 7 and I am looking for another single mum with similar age to share an accommodation preferably SOR around Melville area. I work part-time as a teacher and love weekend beach walks with the kids.",
    preferences: ["SOR preferred", "Near schools", "Family-friendly suburb"],
    tags: ["Non-smoker", "Pet-free", "Early riser"],
    posted: "1 day ago", verified: true,
  },
  {
    id: 102, name: "Mia C.", avatar: "MC", age: 31,
    location: "Fremantle, WA", suburb: "Fremantle", area: "SOR",
    budget: 1100, childrenAges: [3, 8], childrenDesc: "2 kids ages 3 & 8",
    message: "Single mum of 2, looking for another mum to find a 3 to 4 bed house together around Freo or Cockburn. I am fun, tidy and love a glass of wine after bedtime. Budget up to $1,100 per month all up.",
    preferences: ["Fremantle area", "3-4 bedrooms", "Close to beach"],
    tags: ["Social", "Tidy", "Weekend explorer"],
    posted: "3 days ago", verified: true,
  },
  {
    id: 103, name: "Kezia O.", avatar: "KO", age: 28,
    location: "Subiaco, WA", suburb: "Subiaco", area: "NOR",
    budget: 1300, childrenAges: [6], childrenDesc: "1 daughter age 6",
    message: "Looking for a calm, kind mum to find a home together NOR or inner suburbs. My daughter is 6 and in kindy. I am a nurse doing rotating shifts so I need someone flexible and understanding. Happy to consider anywhere from Subi to Scarborough.",
    preferences: ["NOR preferred", "Near hospital", "Quiet street"],
    tags: ["Shift worker", "Quiet home", "Non-smoker"],
    posted: "5 days ago", verified: false,
  },
  {
    id: 104, name: "Rachel B.", avatar: "RB", age: 34,
    location: "Victoria Park, WA", suburb: "Victoria Park", area: "SOR",
    budget: 1000, childrenAges: [4, 9, 11], childrenDesc: "3 kids ages 4, 9 & 11",
    message: "Mum of 3 looking for another mum, ideally with kids of similar ages so they can entertain each other. I am looking around Vic Park, Carlisle or Burswood. I love cooking, hate mess, and my kids are pretty well-behaved most of the time.",
    preferences: ["Vic Park area", "Big backyard", "4+ bedrooms"],
    tags: ["Foodie", "Organised", "School run friendly"],
    posted: "2 days ago", verified: true,
  },
];

const INIT_MESSAGES = {
  1: [
    { from: "them", text: "Hi! I saw your listing and it looks amazing", time: "10:32am" },
    { from: "me", text: "Thank you! Feel free to ask anything", time: "10:45am" },
    { from: "them", text: "Is the room still available from next month?", time: "10:46am" },
  ],
  2: [
    { from: "them", text: "Hello! I have a 3-year-old, would that be okay?", time: "Yesterday" },
    { from: "me", text: "Absolutely! The more the merrier", time: "Yesterday" },
  ],
};

const avatarBg = (id) => `hsl(${id * 57 + 20}, 50%, 58%)`;

export default function App() {
  const [view, setView] = useState("home");
  const [listings, setListings] = useState(SAMPLE_LISTINGS);
  const [buddies, setBuddies] = useState(SAMPLE_BUDDIES);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [newMsg, setNewMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [buddySearch, setBuddySearch] = useState("");
  const [buddyArea, setBuddyArea] = useState("All");
  const [buddyMaxBudget, setBuddyMaxBudget] = useState(2000);
  const [buddyMaxKidAge, setBuddyMaxKidAge] = useState(18);
  const [filterOpen, setFilterOpen] = useState(false);
  const [buddyFilterOpen, setBuddyFilterOpen] = useState(false);
  const [maxRent, setMaxRent] = useState(1200);
  const [showListingForm, setShowListingForm] = useState(false);
  const [showBuddyForm, setShowBuddyForm] = useState(false);
  const [saved, setSaved] = useState([]);
  const [savedBuddies, setSavedBuddies] = useState([]);
  const [notif, setNotif] = useState(null);
  const [buddyForm, setBuddyForm] = useState({ name:"", age:"", location:"", area:"SOR", budget:"", childrenAges:"", message:"", preferences:"", tags:"" });
  const [listingForm, setListingForm] = useState({ name:"", location:"", rent:"", bedrooms:"", children:"", bio:"", amenities:"", tags:"" });
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [view, messages]);

  const toast = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 2800); };
  const toggleSave = (id) => { setSaved(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id]); toast(saved.includes(id) ? "Removed from saved" : "Saved!"); };
  const toggleSaveBuddy = (id) => { setSavedBuddies(p => p.includes(id) ? p.filter(s=>s!==id) : [...p,id]); toast(savedBuddies.includes(id) ? "Removed" : "Buddy saved!"); };

  const sendMsg = () => {
    if (!newMsg.trim()) return;
    const id = activeChat.id;
    setMessages(p => ({ ...p, [id]: [...(p[id]||[]), { from:"me", text:newMsg.trim(), time:"Now" }] }));
    setNewMsg("");
    setTimeout(() => setMessages(p => ({ ...p, [id]: [...(p[id]||[]), { from:"them", text:"Thanks for reaching out! Lets chat more", time:"Now" }] })), 1200);
  };

  const submitBuddy = () => {
    if (!buddyForm.name || !buddyForm.location || !buddyForm.message) return toast("Please fill name, location and message");
    const ages = buddyForm.childrenAges.split(",").map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    setBuddies(p => [{
      id: Date.now(), name: buddyForm.name,
      avatar: buddyForm.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
      age: parseInt(buddyForm.age)||null, location: buddyForm.location,
      suburb: buddyForm.location.split(",")[0], area: buddyForm.area,
      budget: parseInt(buddyForm.budget)||1000, childrenAges: ages,
      childrenDesc: ages.length ? `${ages.length} kid${ages.length>1?"s":""} age${ages.length>1?"s":""} ${ages.join(" & ")}` : "Kids",
      message: buddyForm.message,
      preferences: buddyForm.preferences.split(",").map(s=>s.trim()).filter(Boolean),
      tags: buddyForm.tags.split(",").map(s=>s.trim()).filter(Boolean),
      posted:"Just now", verified:false,
    }, ...p]);
    setShowBuddyForm(false);
    setBuddyForm({ name:"",age:"",location:"",area:"SOR",budget:"",childrenAges:"",message:"",preferences:"",tags:"" });
    toast("Your buddy ad is live!");
    setView("buddy");
  };

  const submitListing = () => {
    if (!listingForm.name || !listingForm.location || !listingForm.rent) return toast("Please fill required fields");
    setListings(p => [{
      id: Date.now(), name: listingForm.name,
      avatar: listingForm.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
      location: listingForm.location, suburb: listingForm.location.split(",")[0],
      bedrooms: parseInt(listingForm.bedrooms)||2, available:"1 room available",
      rent: parseInt(listingForm.rent)||600, children: listingForm.children||"Kids welcome",
      bio: listingForm.bio,
      amenities: listingForm.amenities.split(",").map(s=>s.trim()).filter(Boolean),
      tags: listingForm.tags.split(",").map(s=>s.trim()).filter(Boolean),
      posted:"Just now", photos:"🏡", verified:false,
    }, ...p]);
    setShowListingForm(false);
    setListingForm({ name:"",location:"",rent:"",bedrooms:"",children:"",bio:"",amenities:"",tags:"" });
    toast("Your listing is live!");
    setView("browse");
  };

  const filteredListings = listings.filter(l =>
    (l.location+l.name+l.bio).toLowerCase().includes(searchQuery.toLowerCase()) && l.rent <= maxRent
  );

  const filteredBuddies = buddies.filter(b => {
    const text = (b.location+b.name+b.message+b.suburb).toLowerCase();
    return text.includes(buddySearch.toLowerCase()) &&
      (buddyArea === "All" || b.area === buddyArea) &&
      b.budget <= buddyMaxBudget &&
      (b.childrenAges.length === 0 || b.childrenAges.some(a => a <= buddyMaxKidAge));
  });

  const conversations = [...listings, ...buddies].filter(l => messages[l.id]);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#faf7f2}
    .pf{font-family:'Playfair Display',Georgia,serif}
    .fade-in{animation:fadeIn .4s ease}
    .slide-up{animation:slideUp .35s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    .btn-rust{background:#c4704a;color:#fff;border:none;border-radius:50px;padding:13px 26px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}
    .btn-rust:hover{background:#b05e3a;transform:translateY(-1px)}
    .btn-blue{background:#4a6fc4;color:#fff;border:none;border-radius:50px;padding:13px 26px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}
    .btn-blue:hover{background:#3a5ab0;transform:translateY(-1px)}
    .btn-ol-rust{background:transparent;color:#c4704a;border:1.5px solid #c4704a;border-radius:50px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
    .btn-ol-rust:hover{background:#c4704a18}
    .btn-ol-blue{background:transparent;color:#4a6fc4;border:1.5px solid #4a6fc4;border-radius:50px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
    .btn-ol-blue:hover{background:#4a6fc418}
    input,textarea,select{font-family:'DM Sans',sans-serif;font-size:14px;border:1.5px solid #e8ddd5;border-radius:12px;padding:11px 15px;width:100%;background:#faf7f2;outline:none;transition:border .2s}
    input:focus,textarea:focus,select:focus{border-color:#c4704a}
    .av{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;flex-shrink:0}
    .nav-i{display:flex;flex-direction:column;align-items:center;gap:2px;cursor:pointer;padding:5px 0}
    .hb{background:none;border:none;cursor:pointer;font-size:20px;transition:transform .15s}
    .hb:hover{transform:scale(1.2)}
    ::-webkit-scrollbar{width:0}
    .card{background:#fff;border-radius:20px;box-shadow:0 2px 20px rgba(0,0,0,.06);overflow:hidden}
    .tag-rust{background:#f5ede6;color:#9a5535;border-radius:50px;padding:4px 11px;font-size:11px;font-family:'DM Sans',sans-serif}
    .tag-blue{background:#e8f0fe;color:#3a5ab0;border-radius:50px;padding:4px 11px;font-size:11px;font-family:'DM Sans',sans-serif}
  `;

  const BuddyCard = ({ b }) => (
    <div className="card" style={{ marginBottom:16 }}>
      <div style={{ background:`linear-gradient(135deg,hsl(${b.id*37+200},40%,84%),hsl(${b.id*37+240},50%,76%))`, padding:"16px 18px 14px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div className="av" style={{ width:46,height:46,fontSize:15,background:avatarBg(b.id) }}>{b.avatar}</div>
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#1a2a4a",fontSize:15 }}>
              {b.name}{b.age ? `, ${b.age}` : ""} {b.verified && <span style={{color:"#4a6fc4",fontSize:11}}>verified</span>}
            </div>
            <div style={{ fontSize:12,color:"#1a2a4aaa",fontFamily:"'DM Sans',sans-serif" }}>📍 {b.location}</div>
          </div>
        </div>
        <button className="hb" onClick={e=>{e.stopPropagation();toggleSaveBuddy(b.id)}}>{savedBuddies.includes(b.id)?"💙":"🤍"}</button>
      </div>
      <div style={{ padding:"14px 18px 16px" }}>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:10 }}>
          <span className="tag-blue">💰 ${b.budget}/mo</span>
          <span className="tag-blue">👧 {b.childrenDesc}</span>
          <span className="tag-blue">🗺 {b.area}</span>
        </div>
        <p style={{ fontSize:13.5,color:"#3a3a4a",fontFamily:"'DM Sans',sans-serif",lineHeight:1.65,marginBottom:10,fontStyle:"italic",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden" }}>
          "{b.message}"
        </p>
        <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:12 }}>
          {b.tags.slice(0,3).map(t=><span key={t} className="tag-blue">{t}</span>)}
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#9a9ab0" }}>Posted {b.posted}</span>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btn-ol-blue" style={{padding:"7px 13px",fontSize:12}} onClick={()=>{setActiveChat(b);setView("chat")}}>💬 Connect</button>
            <button className="btn-blue" style={{padding:"8px 15px",fontSize:12}} onClick={()=>{setSelectedBuddy(b);setView("buddyDetail")}}>View</button>
          </div>
        </div>
      </div>
    </div>
  );

  const RoomCard = ({ l }) => (
    <div className="card" style={{ marginBottom:16 }}>
      <div style={{ background:`linear-gradient(135deg,hsl(${l.id*57+20},40%,88%),hsl(${l.id*57+60},50%,82%))`,padding:"22px 20px",textAlign:"center",fontSize:42 }}>{l.photos}</div>
      <div style={{ padding:"16px 18px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
          <div style={{ display:"flex",gap:10,alignItems:"center" }}>
            <div className="av" style={{ width:40,height:40,fontSize:14,background:avatarBg(l.id) }}>{l.avatar}</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#3d2c1e",fontSize:14 }}>{l.name} {l.verified && <span style={{color:"#c4704a",fontSize:11}}>verified</span>}</div>
              <div style={{ fontSize:11,color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>📍 {l.location}</div>
            </div>
          </div>
          <button className="hb" onClick={()=>toggleSave(l.id)}>{saved.includes(l.id)?"❤️":"🤍"}</button>
        </div>
        <p style={{ fontSize:13,color:"#6b5a50",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,marginBottom:10,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{l.bio}</p>
        <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:12 }}>
          {l.tags.slice(0,3).map(t=><span key={t} className="tag-rust">{t}</span>)}
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div className="pf" style={{ color:"#c4704a",fontSize:19,fontWeight:700 }}>£{l.rent}<span style={{ fontSize:10,fontWeight:400,color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>/mo</span></div>
          <div style={{ display:"flex",gap:7 }}>
            <button className="btn-ol-rust" style={{padding:"7px 11px",fontSize:12}} onClick={()=>{setActiveChat(l);setView("chat")}}>💬</button>
            <button className="btn-rust" style={{padding:"8px 15px",fontSize:12}} onClick={()=>{setSelectedListing(l);setView("detail")}}>View</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Georgia',serif",background:"#faf7f2",minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden" }}>
      <style>{css}</style>

      {notif && <div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#3d2c1e",color:"#fff",padding:"9px 20px",borderRadius:50,fontSize:13,fontFamily:"'DM San
