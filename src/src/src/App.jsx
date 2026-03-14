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

      {notif && <div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#3d2c1e",color:"#fff",padding:"9px 20px",borderRadius:50,fontSize:13,fontFamily:"'DM Sans',sans-serif",zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.2)" }} className="fade-in">{notif}</div>}

      {view==="home" && (
        <div className="fade-in">
          <div style={{ background:"linear-gradient(160deg,#3d2c1e 0%,#7a4430 50%,#c4704a 100%)",padding:"50px 26px 46px",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(255,255,255,.05)" }}/>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:30 }}>
              <span style={{ color:"#f5c9a6",fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700 }}>SoloNest</span>
              <button onClick={()=>setView("profile")} style={{ background:"rgba(255,255,255,.15)",border:"none",borderRadius:"50%",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:17 }}>👤</button>
            </div>
            <div style={{ fontSize:11,color:"#f5c9a6aa",marginBottom:7,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif" }}>A space for us</div>
            <h1 className="pf" style={{ fontSize:31,color:"#fff",lineHeight:1.2,marginBottom:12,fontWeight:400 }}>Find your people,<br/>share your home</h1>
            <p style={{ color:"#f5c9a699",fontSize:14,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif",marginBottom:26,maxWidth:290 }}>Connect with single mums who understand the juggle and want to build something better together.</p>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              <button className="btn-rust" style={{ background:"#f5c9a6",color:"#3d2c1e",fontWeight:600 }} onClick={()=>setView("browse")}>🏠 Find a Room</button>
              <button className="btn-blue" style={{ background:"rgba(74,111,196,.85)" }} onClick={()=>setView("buddy")}>🤝 Find a Buddy</button>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",background:"#fff",borderBottom:"1px solid #f0e8e0" }}>
            {[["1,240+","Mums"],["890+","Rooms"],["340+","Buddies"],["4.9","Trust"]].map(([n,l])=>(
              <div key={l} style={{ padding:"15px 6px",textAlign:"center",borderRight:"1px solid #f0e8e0" }}>
                <div className="pf" style={{ fontSize:16,color:"#c4704a",fontWeight:700 }}>{n}</div>
                <div style={{ fontSize:10,color:"#9a8878",fontFamily:"'DM Sans',sans-serif",marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:"22px 18px 0" }}>
            <h2 className="pf" style={{ fontSize:19,color:"#3d2c1e",marginBottom:12 }}>What would you like to do?</h2>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22 }}>
              <div onClick={()=>setView("browse")} style={{ background:"linear-gradient(135deg,#fff5ef,#ffe8d8)",borderRadius:18,padding:"18px 14px",cursor:"pointer",boxShadow:"0 2px 12px rgba(196,112,74,.1)" }}>
                <div style={{ fontSize:30,marginBottom:8 }}>🏠</div>
                <div className="pf" style={{ fontSize:14,color:"#3d2c1e",marginBottom:3 }}>I have a room</div>
                <div style={{ fontSize:11,color:"#9a8878",fontFamily:"'DM Sans',sans-serif",lineHeight:1.4 }}>List or find a room in someones home</div>
              </div>
              <div onClick={()=>setView("buddy")} style={{ background:"linear-gradient(135deg,#eff3ff,#dce6ff)",borderRadius:18,padding:"18px 14px",cursor:"pointer",boxShadow:"0 2px 12px rgba(74,111,196,.1)" }}>
                <div style={{ fontSize:30,marginBottom:8 }}>🤝</div>
                <div className="pf" style={{ fontSize:14,color:"#1a2a4a",marginBottom:3 }}>Find a Buddy</div>
                <div style={{ fontSize:11,color:"#6a7aaa",fontFamily:"'DM Sans',sans-serif",lineHeight:1.4 }}>Team up with another mum to rent together</div>
              </div>
            </div>
          </div>
          <div style={{ padding:"0 18px 6px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <h2 className="pf" style={{ fontSize:17,color:"#1a2a4a" }}>Latest Buddy Ads</h2>
              <button onClick={()=>setView("buddy")} style={{ color:"#4a6fc4",background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,cursor:"pointer" }}>See all</button>
            </div>
            {buddies.slice(0,2).map(b=><BuddyCard key={b.id} b={b}/>)}
          </div>
          <div style={{ padding:"6px 18px 100px" }}>
            <h2 className="pf" style={{ fontSize:17,color:"#3d2c1e",marginBottom:14 }}>How it works</h2>
            {[["🔍","Browse and search","Filter by location, budget and kids ages."],["🤝","Find a buddy","Team up with twice the bargaining power."],["💬","Connect and chat","Message before committing to anything."],["🏡","Move in together","Share costs, support, and build a home."]].map(([icon,title,desc])=>(
              <div key={title} style={{ display:"flex",gap:13,marginBottom:16 }}>
                <div style={{ width:40,height:40,borderRadius:"50%",background:"#f5ede6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#3d2c1e",marginBottom:2,fontSize:14 }}>{title}</div>
                  <div style={{ fontSize:12,color:"#9a8878",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==="browse" && (
        <div className="fade-in">
          <div style={{ padding:"50px 18px 12px",background:"#fff",borderBottom:"1px solid #f0e8e0",position:"sticky",top:0,zIndex:100 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <h1 className="pf" style={{ fontSize:21,color:"#3d2c1e" }}>Find a Room</h1>
              <button onClick={()=>setShowListingForm(true)} className="btn-rust" style={{ padding:"9px 14px",fontSize:12 }}>+ List Space</button>
            </div>
            <div style={{ position:"relative",marginBottom:8 }}>
              <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14 }}>🔍</span>
              <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="City, suburb, name" style={{ paddingLeft:38 }}/>
            </div>
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <button onClick={()=>setFilterOpen(!filterOpen)} className="btn-ol-rust" style={{padding:"7px 12px",fontSize:12}}>Filters</button>
              <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#9a8878" }}>{filteredListings.length} listings</span>
            </div>
            {filterOpen && <div style={{ marginTop:10,padding:12,background:"#faf7f2",borderRadius:12 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6b5a50",marginBottom:5 }}>Max rent: £{maxRent}/mo</div>
              <input type="range" min={300} max={2000} value={maxRent} onChange={e=>setMaxRent(Number(e.target.value))} style={{ width:"100%",border:"none",background:"none",padding:0,accentColor:"#c4704a" }}/>
            </div>}
          </div>
          <div style={{ padding:"14px 18px 100px" }}>
            {filteredListings.length===0 && <div style={{ textAlign:"center",padding:"60px 20px",color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}><div style={{fontSize:36,marginBottom:10}}>🔍</div>No listings found</div>}
            {filteredListings.map(l=><RoomCard key={l.id} l={l}/>)}
          </div>
        </div>
      )}

      {view==="buddy" && (
        <div className="fade-in">
          <div style={{ padding:"50px 18px 12px",background:"#f0f4ff",borderBottom:"1px solid #d8e2f8",position:"sticky",top:0,zIndex:100 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4 }}>
              <div>
                <h1 className="pf" style={{ fontSize:21,color:"#1a2a4a" }}>Find a Buddy</h1>
                <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6a7aaa",marginTop:2 }}>Team up to find and rent a home together</p>
              </div>
              <button onClick={()=>setShowBuddyForm(true)} className="btn-blue" style={{ padding:"9px 14px",fontSize:12,marginTop:4 }}>+ Post Ad</button>
            </div>
            <div style={{ position:"relative",marginBottom:8,marginTop:10 }}>
              <span style={{ position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14 }}>🔍</span>
              <input value={buddySearch} onChange={e=>setBuddySearch(e.target.value)} placeholder="Search suburb, area, name" style={{ paddingLeft:38,borderColor:"#d8e2f8",background:"#fff" }}/>
            </div>
            <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:8 }}>
              {["All","SOR","NOR","Inner City","Eastern Suburbs","Western Suburbs"].map(a=>(
                <button key={a} onClick={()=>setBuddyArea(a)} style={{ borderRadius:50,padding:"6px 13px",fontSize:11,fontFamily:"'DM Sans',sans-serif",border:"1.5px solid",whiteSpace:"nowrap",cursor:"pointer",transition:"all .2s",background:buddyArea===a?"#4a6fc4":"transparent",color:buddyArea===a?"#fff":"#4a6fc4",borderColor:"#4a6fc4" }}>{a}</button>
              ))}
            </div>
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <button onClick={()=>setBuddyFilterOpen(!buddyFilterOpen)} className="btn-ol-blue" style={{padding:"6px 12px",fontSize:11}}>More Filters</button>
              <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6a7aaa" }}>{filteredBuddies.length} mums searching</span>
            </div>
            {buddyFilterOpen && (
              <div style={{ marginTop:10,padding:12,background:"#fff",borderRadius:12,border:"1px solid #d8e2f8" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#1a2a4a",marginBottom:4 }}>Max budget: ${buddyMaxBudget}/mo</div>
                <input type="range" min={500} max={3000} value={buddyMaxBudget} onChange={e=>setBuddyMaxBudget(Number(e.target.value))} style={{ width:"100%",border:"none",background:"none",padding:0,accentColor:"#4a6fc4" }}/>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#1a2a4a",marginTop:10,marginBottom:4 }}>Kids max age: {buddyMaxKidAge} yrs</div>
                <input type="range" min={0} max={18} value={buddyMaxKidAge} onChange={e=>setBuddyMaxKidAge(Number(e.target.value))} style={{ width:"100%",border:"none",background:"none",padding:0,accentColor:"#4a6fc4" }}/>
              </div>
            )}
          </div>
          <div style={{ padding:"14px 18px 100px" }}>
            {filteredBuddies.length===0 && (
              <div style={{ textAlign:"center",padding:"60px 20px",color:"#6a7aaa",fontFamily:"'DM Sans',sans-serif" }}>
                <div style={{fontSize:36,marginBottom:10}}>🤝</div>
                <div style={{marginBottom:14}}>No buddy ads found.</div>
                <button className="btn-blue" onClick={()=>setShowBuddyForm(true)}>Post your own ad</button>
              </div>
            )}
            {filteredBuddies.map(b=><BuddyCard key={b.id} b={b}/>)}
          </div>
        </div>
      )}

      {view==="buddyDetail" && selectedBuddy && (
        <div className="slide-up">
          <div style={{ background:`linear-gradient(135deg,hsl(${selectedBuddy.id*37+200},40%,82%),hsl(${selectedBuddy.id*37+240},50%,74%))`,padding:"50px 18px 26px",position:"relative" }}>
            <button onClick={()=>setView("buddy")} style={{ position:"absolute",top:14,left:14,background:"rgba(255,255,255,.75)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:15 }}>←</button>
            <button className="hb" style={{ position:"absolute",top:14,right:14,background:"rgba(255,255,255,.75)",borderRadius:"50%",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>toggleSaveBuddy(selectedBuddy.id)}>
              {savedBuddies.includes(selectedBuddy.id)?"💙":"🤍"}
            </button>
            <div style={{ display:"flex",gap:14,alignItems:"center" }}>
              <div className="av" style={{ width:62,height:62,fontSize:22,background:avatarBg(selectedBuddy.id) }}>{selectedBuddy.avatar}</div>
              <div>
                <h1 className="pf" style={{ fontSize:23,color:"#1a2a4a" }}>{selectedBuddy.name}{selectedBuddy.age ? `, ${selectedBuddy.age}` : ""}</h1>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#1a2a4aaa" }}>📍 {selectedBuddy.location}</div>
                {selectedBuddy.verified && <div style={{ fontSize:11,color:"#4a6fc4",fontFamily:"'DM Sans',sans-serif",marginTop:2 }}>Identity verified</div>}
              </div>
            </div>
          </div>
          <div style={{ padding:"20px 18px 100px" }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9,marginBottom:18 }}>
              {[["💰","Budget",`$${selectedBuddy.budget}/mo`],["👧","Children",selectedBuddy.childrenDesc],["🗺","Area",selectedBuddy.area]].map(([icon,label,val])=>(
                <div key={label} style={{ background:"#eff3ff",borderRadius:14,padding:"13px 8px",textAlign:"center" }}>
                  <div style={{fontSize:18,marginBottom:3}}>{icon}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#6a7aaa",marginBottom:2 }}>{label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#1a2a4a" }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"#f8faff",border:"1.5px solid #d8e2f8",borderRadius:16,padding:16,marginBottom:14 }}>
              <h3 className="pf" style={{ fontSize:15,color:"#1a2a4a",marginBottom:9 }}>Her message</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#3a4a6a",lineHeight:1.7,fontStyle:"italic" }}>"{selectedBuddy.message}"</p>
            </div>
            {selectedBuddy.preferences.length>0 && (
              <div style={{ marginBottom:14 }}>
                <h3 className="pf" style={{ fontSize:15,color:"#1a2a4a",marginBottom:8 }}>Preferences</h3>
                <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                  {selectedBuddy.preferences.map(p=><span key={p} style={{ background:"#fff",border:"1.5px solid #d8e2f8",borderRadius:50,padding:"5px 13px",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:"#3a4a6a" }}>{p}</span>)}
                </div>
              </div>
            )}
            {selectedBuddy.tags.length>0 && (
              <div style={{ marginBottom:22 }}>
                <h3 className="pf" style={{ fontSize:15,color:"#1a2a4a",marginBottom:8 }}>Lifestyle</h3>
                <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                  {selectedBuddy.tags.map(t=><span key={t} className="tag-blue">{t}</span>)}
                </div>
              </div>
            )}
            <button className="btn-blue" style={{ width:"100%",padding:15,fontSize:15 }} onClick={()=>{setActiveChat(selectedBuddy);setView("chat")}}>
              Connect with {selectedBuddy.name.split(" ")[0]}
            </button>
          </div>
        </div>
      )}

      {view==="detail" && selectedListing && (
        <div className="slide-up">
          <div style={{ background:`linear-gradient(135deg,hsl(${selectedListing.id*57+20},40%,85%),hsl(${selectedListing.id*57+60},50%,78%))`,padding:"50px 18px 26px",textAlign:"center",position:"relative",fontSize:66 }}>
            <button onClick={()=>setView("browse")} style={{ position:"absolute",top:14,left:14,background:"rgba(255,255,255,.75)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:15 }}>←</button>
            <button className="hb" style={{ position:"absolute",top:14,right:14,background:"rgba(255,255,255,.75)",borderRadius:"50%",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={()=>toggleSave(selectedListing.id)}>
              {saved.includes(selectedListing.id)?"❤️":"🤍"}
            </button>
            {selectedListing.photos}
          </div>
          <div style={{ padding:"20px 18px 100px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14 }}>
              <div>
                <h1 className="pf" style={{ fontSize:23,color:"#3d2c1e",marginBottom:3 }}>{selectedListing.name}</h1>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#9a8878" }}>📍 {selectedListing.location}</div>
              </div>
              <div className="pf" style={{ color:"#c4704a",fontSize:22,fontWeight:700,textAlign:"right" }}>
                £{selectedListing.rent}<div style={{ fontSize:11,fontWeight:400,color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>per month</div>
              </div>
            </div>
            {selectedListing.verified && <div style={{ background:"#f0f9f0",borderRadius:10,padding:"9px 13px",marginBottom:12,display:"flex",gap:7,alignItems:"center" }}><span>✅</span><span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#3a7a3a" }}>Identity verified</span></div>}
            <div className="card" style={{ padding:15,marginBottom:12 }}>
              <h3 className="pf" style={{ fontSize:14,color:"#3d2c1e",marginBottom:8 }}>About this home</h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:"#6b5a50",lineHeight:1.7 }}>{selectedListing.bio}</p>
            </div>
            <div className="card" style={{ padding:15,marginBottom:12 }}>
              <h3 className="pf" style={{ fontSize:14,color:"#3d2c1e",marginBottom:9 }}>Details</h3>
              {[["🛏","Bedrooms",selectedListing.bedrooms+" bedrooms"],["🏠","Availability",selectedListing.available],["👧","Children",selectedListing.children],["📅","Posted",selectedListing.posted]].map(([icon,label,val])=>(
                <div key={label} style={{ display:"flex",justifyContent:"space-between",marginBottom:7 }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#9a8878" }}>{icon} {label}</div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#3d2c1e",fontWeight:500 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:12 }}>
              <h3 className="pf" style={{ fontSize:14,color:"#3d2c1e",marginBottom:8 }}>Amenities</h3>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {selectedListing.amenities.map(a=><span key={a} style={{ background:"#fff",border:"1.5px solid #e8ddd5",borderRadius:50,padding:"5px 12px",fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#6b5a50" }}>{a}</span>)}
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <h3 className="pf" style={{ fontSize:14,color:"#3d2c1e",marginBottom:8 }}>Lifestyle</h3>
              <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                {selectedListing.tags.map(t=><span key={t} className="tag-rust">{t}</span>)}
              </div>
            </div>
            <button className="btn-rust" style={{ width:"100%",padding:14,fontSize:15 }} onClick={()=>{setActiveChat(selectedListing);setView("chat")}}>
              Message {selectedListing.name.split(" ")[0]}
            </button>
          </div>
        </div>
      )}

      {view==="messages" && (
        <div className="fade-in">
          <div style={{ padding:"50px 18px 14px",background:"#fff",borderBottom:"1px solid #f0e8e0" }}>
            <h1 className="pf" style={{ fontSize:21,color:"#3d2c1e" }}>Messages</h1>
          </div>
          <div style={{ padding:"14px 18px 100px" }}>
            {conversations.length===0 && (
              <div style={{ textAlign:"center",padding:"60px 20px",color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>
                <div style={{fontSize:36,marginBottom:10}}>💬</div>
                <div>No messages yet.</div>
              </div>
            )}
            {conversations.map(l=>{
              const last = messages[l.id]?.[messages[l.id].length-1];
              const isBuddy = !!l.message;
              return (
                <div key={l.id} className="card" style={{ marginBottom:10,cursor:"pointer",padding:14 }} onClick={()=>{setActiveChat(l);setView("chat")}}>
                  <div style={{ display:"flex",gap:11,alignItems:"center" }}>
                    <div className="av" style={{ width:44,height:44,fontSize:14,background:avatarBg(l.id) }}>{l.avatar}</div>
                    <div style={{ flex:1,overflow:"hidden" }}>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                        <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#3d2c1e",fontSize:14 }}>
                          {l.name}
                          {isBuddy && <span style={{ marginLeft:5,fontSize:10,background:"#e8f0fe",color:"#4a6fc4",borderRadius:50,padding:"2px 6px" }}>Buddy</span>}
                        </div>
                        <div style={{ fontSize:10,color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>{last?.time}</div>
                      </div>
                      <div style={{ fontSize:12,color:"#9a8878",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{last?.text}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view==="chat" && activeChat && (
        <div className="fade-in" style={{ display:"flex",flexDirection:"column",height:"100vh" }}>
          <div style={{ padding:"50px 14px 10px",background:"#fff",borderBottom:"1px solid #f0e8e0",display:"flex",gap:11,alignItems:"center",flexShrink:0 }}>
            <button onClick={()=>setView("messages")} style={{ background:"none",border:"none",cursor:"pointer",fontSize:19,color:"#9a8878" }}>←</button>
            <div className="av" style={{ width:36,height:36,fontSize:13,background:avatarBg(activeChat.id) }}>{activeChat.avatar}</div>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#3d2c1e",fontSize:14 }}>{activeChat.name}</div>
              <div style={{ fontSize:11,color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>📍 {activeChat.suburb||activeChat.location}</div>
            </div>
          </div>
          <div style={{ flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:9,background:"#faf7f2" }}>
            {(messages[activeChat.id]||[]).length===0 && (
              <div style={{ textAlign:"center",padding:"28px 0",color:"#9a8878",fontFamily:"'DM Sans',sans-serif",fontSize:13 }}>Say hello to {activeChat.name.split(" ")[0]}!</div>
            )}
            {(messages[activeChat.id]||[]).map((msg,i)=>(
              <div key={i} style={{ display:"flex",justifyContent:msg.from==="me"?"flex-end":"flex-start" }}>
                <div style={{ background:msg.from==="me"?"#c4704a":"#fff",color:msg.from==="me"?"#fff":"#3d2c1e",borderRadius:msg.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 15px",maxWidth:"78%",fontFamily:"'DM Sans',sans-serif",fontSize:13.5,lineHeight:1.5,boxShadow:"0 1px 6px rgba(0,0,0,.07)" }}>
                  {msg.text}
                  <div style={{ fontSize:9,marginTop:3,opacity:.6,textAlign:msg.from==="me"?"right":"left" }}>{msg.time}</div>
                </div>
              </div>
            ))}
            <div ref={chatEnd}/>
          </div>
          <div style={{ padding:"10px 14px 26px",background:"#fff",borderTop:"1px solid #f0e8e0",display:"flex",gap:9 }}>
            <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Write a message" style={{ flex:1,borderRadius:50 }}/>
            <button onClick={sendMsg} style={{ width:40,height:40,borderRadius:"50%",background:"#c4704a",border:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center" }}>➤</button>
          </div>
        </div>
      )}

      {view==="saved" && (
        <div className="fade-in">
          <div style={{ padding:"50px 18px 14px",background:"#fff",borderBottom:"1px solid #f0e8e0" }}>
            <h1 className="pf" style={{ fontSize:21,color:"#3d2c1e" }}>Saved</h1>
          </div>
          <div style={{ padding:"14px 18px 100px" }}>
            {saved.length>0 && <h3 className="pf" style={{ fontSize:15,color:"#3d2c1e",marginBottom:10 }}>Saved Rooms</h3>}
            {listings.filter(l=>saved.includes(l.id)).map(l=>(
              <div key={l.id} className="card" style={{ marginBottom:10,cursor:"pointer",padding:14 }} onClick={()=>{setSelectedListing(l);setView("detail")}}>
                <div style={{ display:"flex",gap:11,alignItems:"center" }}>
                  <div className="av" style={{ width:42,height:42,fontSize:14,background:avatarBg(l.id) }}>{l.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#3d2c1e",fontSize:14 }}>{l.name}</div>
                    <div style={{ fontSize:11,color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>📍 {l.location}</div>
                    <div className="pf" style={{ color:"#c4704a",fontSize:14,marginTop:2 }}>£{l.rent}/month</div>
                  </div>
                  <button className="hb" onClick={e=>{e.stopPropagation();toggleSave(l.id)}}>❤️</button>
                </div>
              </div>
            ))}
            {savedBuddies.length>0 && <h3 className="pf" style={{ fontSize:15,color:"#1a2a4a",marginTop:18,marginBottom:10 }}>Saved Buddies</h3>}
            {buddies.filter(b=>savedBuddies.includes(b.id)).map(b=>(
              <div key={b.id} style={{ background:"#f8faff",border:"1.5px solid #d8e2f8",borderRadius:16,marginBottom:10,cursor:"pointer",padding:14 }} onClick={()=>{setSelectedBuddy(b);setView("buddyDetail")}}>
                <div style={{ display:"flex",gap:11,alignItems:"center" }}>
                  <div className="av" style={{ width:42,height:42,fontSize:14,background:avatarBg(b.id) }}>{b.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:"#1a2a4a",fontSize:14 }}>{b.name}{b.age ? `, ${b.age}` : ""}</div>
                    <div style={{ fontSize:11,color:"#6a7aaa",fontFamily:"'DM Sans',sans-serif" }}>📍 {b.location} · {b.area}</div>
                    <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#4a6fc4",marginTop:2 }}>Budget: ${b.budget}/mo</div>
                  </div>
                  <button className="hb" onClick={e=>{e.stopPropagation();toggleSaveBuddy(b.id)}}>💙</button>
                </div>
              </div>
            ))}
            {saved.length===0 && savedBuddies.length===0 && (
              <div style={{ textAlign:"center",padding:"60px 20px",color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>
                <div style={{fontSize:36,marginBottom:10}}>🤍</div>
                <div>Nothing saved yet.</div>
                <div style={{ display:"flex",gap:10,justifyContent:"center",marginTop:14 }}>
                  <button className="btn-rust" style={{padding:"10px 16px",fontSize:12}} onClick={()=>setView("browse")}>Browse Rooms</button>
                  <button className="btn-blue" style={{padding:"10px 16px",fontSize:12}} onClick={()=>setView("buddy")}>Find Buddies</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view==="profile" && (
        <div className="fade-in">
          <div style={{ background:"linear-gradient(160deg,#3d2c1e,#7a4430)",padding:"50px 18px 26px",textAlign:"center" }}>
            <div className="av" style={{ width:72,height:72,fontSize:24,background:"#c4704a",margin:"0 auto 10px" }}>ME</div>
            <h2 className="pf" style={{ fontSize:20,color:"#fff",marginBottom:3 }}>My Profile</h2>
            <p style={{ color:"#f5c9a6aa",fontFamily:"'DM Sans',sans-serif",fontSize:12 }}>Single mum · SoloNest member</p>
          </div>
          <div style={{ padding:"20px 18px 100px" }}>
            {[["🏠","My Room Listings","Manage your listings",()=>setView("browse")],["🤝","My Buddy Ads","Find mums to rent with",()=>setView("buddy")],["🤍","Saved","Rooms and buddies saved",()=>setView("saved")],["💬","Messages","Chat with other mums",()=>setView("messages")],["✏️","Edit Profile","Update your details",()=>toast("Coming soon!")],["🔒","Privacy and Safety","Your safety tools",()=>toast("Coming soon!")],["❓","Help and Support","Get help anytime",()=>toast("Coming soon!")]].map(([icon,title,sub,action])=>(
              <div key={title} onClick={action} style={{ display:"flex",gap:12,alignItems:"center",padding:"14px 0",borderBottom:"1px solid #f0e8e0",cursor:"pointer" }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:"#f5ede6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>{icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontWeight:500,color:"#3d2c1e",fontSize:14 }}>{title}</div>
                  <div style={{ fontSize:11,color:"#9a8878",fontFamily:"'DM Sans',sans-serif" }}>{sub}</div>
                </div>
                <span style={{ color:"#c4c0ba" }}>›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBuddyForm && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:500,display:"flex",alignItems:"flex-end" }} onClick={()=>setShowBuddyForm(false)}>
          <div className="slide-up" style={{ background:"#f0f4ff",borderRadius:"24px 24px 0 0",padding:"22px 18px 40px",width:"100%",maxHeight:"93vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
              <h2 className="pf" style={{ fontSize:19,color:"#1a2a4a" }}>Post a Buddy Ad</h2>
              <button onClick={()=>setShowBuddyForm(false)} style={{ background:"#d8e2f8",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14 }}>X</button>
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6a7aaa",marginBottom:16 }}>Tell other mums who you are and what you are looking for so they can reach out and team up with you.</p>
            <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
              {[["Your name","name","text","e.g. Tania W."],["Your age","age","number","e.g. 25"],["Preferred location","location","text","e.g. Melville, WA"],["Max budget per month","budget","number","e.g. 900"],["Kids ages comma separated","childrenAges","text","e.g. 5, 7"]].map(([label,field,type,ph])=>(
                <div key={field}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#3a4a6a",marginBottom:4 }}>{label}</div>
                  <input type={type} placeholder={ph} value={buddyForm[field]} onChange={e=>setBuddyForm(p=>({...p,[field]:e.target.value}))} style={{ borderColor:"#d8e2f8",background:"#fff" }}/>
                </div>
              ))}
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#3a4a6a",marginBottom:4 }}>Preferred area</div>
                <select value={buddyForm.area} onChange={e=>setBuddyForm(p=>({...p,area:e.target.value}))} style={{ borderColor:"#d8e2f8",background:"#fff" }}>
                  {["SOR","NOR","Inner City","Eastern Suburbs","Western Suburbs","Flexible"].map(a=><option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#3a4a6a",marginBottom:4 }}>Your message</div>
                <textarea rows={5} placeholder="e.g. Hi I am Tania, 25 years old with 2 young kids age 5 and 7 and I am looking for another single mum with similar age to share accommodation preferably SOR around Melville area." value={buddyForm.message} onChange={e=>setBuddyForm(p=>({...p,message:e.target.value}))} style={{ resize:"none",borderColor:"#d8e2f8",background:"#fff" }}/>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#3a4a6a",marginBottom:4 }}>Housing preferences comma separated</div>
                <input placeholder="e.g. Near schools, Big backyard, 3+ bedrooms" value={buddyForm.preferences} onChange={e=>setBuddyForm(p=>({...p,preferences:e.target.value}))} style={{ borderColor:"#d8e2f8",background:"#fff" }}/>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#3a4a6a",marginBottom:4 }}>Lifestyle tags comma separated</div>
                <input placeholder="e.g. Non-smoker, Early riser, Pet-free" value={buddyForm.tags} onChange={e=>setBuddyForm(p=>({...p,tags:e.target.value}))} style={{ borderColor:"#d8e2f8",background:"#fff" }}/>
              </div>
              <button className="btn-blue" style={{ marginTop:5,padding:14,fontSize:14 }} onClick={submitBuddy}>Publish Buddy Ad</button>
            </div>
          </div>
        </div>
      )}

      {showListingForm && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:500,display:"flex",alignItems:"flex-end" }} onClick={()=>setShowListingForm(false)}>
          <div className="slide-up" style={{ background:"#faf7f2",borderRadius:"24px 24px 0 0",padding:"22px 18px 40px",width:"100%",maxHeight:"93vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
              <h2 className="pf" style={{ fontSize:19,color:"#3d2c1e" }}>List Your Space</h2>
              <button onClick={()=>setShowListingForm(false)} style={{ background:"#e8ddd5",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14 }}>X</button>
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
              {[["Your name","name","text","e.g. Sarah M."],["Location","location","text","e.g. Brighton, UK"],["Monthly rent","rent","number","e.g. 650"],["Number of bedrooms","bedrooms","number","e.g. 3"],["Your children","children","text","e.g. 2 kids ages 4 and 7"]].map(([label,field,type,ph])=>(
                <div key={field}>
                  <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6b5a50",marginBottom:4 }}>{label}</div>
                  <input type={type} placeholder={ph} value={listingForm[field]} onChange={e=>setListingForm(p=>({...p,[field]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6b5a50",marginBottom:4 }}>About your home and lifestyle</div>
                <textarea rows={4} placeholder="Tell us about yourself, your home and what you are looking for" value={listingForm.bio} onChange={e=>setListingForm(p=>({...p,bio:e.target.value}))} style={{ resize:"none" }}/>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6b5a50",marginBottom:4 }}>Amenities comma separated</div>
                <input placeholder="e.g. Garden, Parking, Pet-friendly" value={listingForm.amenities} onChange={e=>setListingForm(p=>({...p,amenities:e.target.value}))}/>
              </div>
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#6b5a50",marginBottom:4 }}>Lifestyle tags comma separated</div>
                <input placeholder="e.g. Non-smoker, Quiet evenings" value={listingForm.tags} onChange={e=>setListingForm(p=>({...p,tags:e.target.value}))}/>
              </div>
              <button className="btn-rust" style={{ marginTop:5,padding:14,fontSize:14 }} onClick={submitListing}>Publish Listing</button>
            </div>
          </div>
        </div>
      )}

      {view!=="chat" && (
        <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#fff",borderTop:"1px solid #f0e8e0",padding:"8px 10px 20px",display:"flex",justifyContent:"space-around",zIndex:200 }}>
          {[["home","🏠","Home"],["browse","🏠","Rooms"],["buddy","🤝","Buddies"],["saved","🤍","Saved"],["messages","💬","Chats"],["profile","👤","Me"]].map(([v,icon,label])=>{
            const active = view===v||(v==="buddy"&&view==="buddyDetail")||(v==="browse"&&view==="detail");
            return (
              <div key={v} className="nav-i" onClick={()=>setView(v)}>
                <span style={{ fontSize:19,filter:active?"none":"grayscale(.3) opacity(.55)" }}>{icon}</span>
                <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:9,color:active?"#c4704a":"#9a8878",fontWeight:active?600:400 }}>{label}</span>
                {active && <div style={{ width:3,height:3,borderRadius:"50%",background:"#c4704a" }}/>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
    
