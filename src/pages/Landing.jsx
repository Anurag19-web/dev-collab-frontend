import { Link } from "react-router-dom";

function Landing() {

const snippets = [
{
id:1,
title:"React Counter",
language:"JavaScript",
user:"Rahul",
avatar:"https://i.pravatar.cc/150?img=3",
code:`const [count,setCount] = useState(0);

<button onClick={()=>setCount(count+1)}>
 Count: {count}
</button>`
},

{
id:2,
title:"Python Fibonacci",
language:"Python",
user:"Aman",
avatar:"https://i.pravatar.cc/150?img=5",
code:`def fib(n):
 if n<=1:
  return n
 return fib(n-1)+fib(n-2)`
},

{
id:3,
title:"CSS Center Div",
language:"CSS",
user:"Priya",
avatar:"https://i.pravatar.cc/150?img=8",
code:`.container{
 display:flex;
 justify-content:center;
 align-items:center;
}`
},

{
id:4,
title:"Node Express Server",
language:"JavaScript",
user:"Karan",
avatar:"https://i.pravatar.cc/150?img=11",
code:`import express from "express";
const app = express();

app.get("/",(req,res)=>{
 res.send("Hello World");
});`
},

{
id:5,
title:"Array Sum JS",
language:"JavaScript",
user:"Mehul",
avatar:"https://i.pravatar.cc/150?img=12",
code:`const arr=[1,2,3,4];

const sum=arr.reduce(
(a,b)=>a+b,0
);

console.log(sum);`
},

{
id:6,
title:"SQL Select Query",
language:"SQL",
user:"Riya",
avatar:"https://i.pravatar.cc/150?img=9",
code:`SELECT name,email
FROM users
WHERE active = 1
ORDER BY created_at DESC;`
}
];


return (

<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black min-h-screen text-white">

{/* NAVBAR */}

<nav className="flex justify-between items-center px-10 py-6">

<h1 className="font-bold text-blue-400 text-2xl">
DevCollab
</h1>

<div className="flex gap-6">

<Link to="/login" className="mt-2 hover:text-blue-400">
Login
</Link>

<Link
to="/signup"
className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg"
>
Signup
</Link>

</div>

</nav>


{/* HERO */}

<div className="mt-16 px-6 text-center">

<h2 className="font-bold text-5xl">
Collaborate with Developers
</h2>

<p className="mt-4 text-gray-400 text-lg">
Share code snippets, review code and learn from developers around the world.
</p>

<Link
to="/home"
className="inline-block bg-blue-500 hover:bg-blue-600 mt-8 px-8 py-3 rounded-lg text-lg"
>
Enter Platform
</Link>

</div>


{/* STATS */}

<div className="flex justify-center gap-16 mt-16 text-center">

<div>
<h3 className="font-bold text-3xl">10K+</h3>
<p className="text-gray-400">Developers</p>
</div>

<div>
<h3 className="font-bold text-3xl">25K+</h3>
<p className="text-gray-400">Snippets</p>
</div>

<div>
<h3 className="font-bold text-3xl">50K+</h3>
<p className="text-gray-400">Reviews</p>
</div>

</div>


{/* SNIPPETS */}

<h2 className="mt-20 font-bold text-3xl text-center">
Trending Snippets
</h2>


<div className="gap-8 grid md:grid-cols-3 mx-auto mt-12 px-8 max-w-6xl">

{snippets.map((snippet)=>(

<div
key={snippet.id}
className="bg-white/5 backdrop-blur-lg p-6 border border-white/10 rounded-xl hover:scale-105 transition"
>

{/* USER */}

<div className="flex items-center gap-3 mb-4">

<img
src={snippet.avatar}
className="rounded-full w-10 h-10"
/>

<div>
<p className="font-semibold text-sm">
{snippet.user}
</p>

<p className="text-gray-400 text-xs">
{snippet.language}
</p>
</div>

</div>


{/* TITLE */}

<h3 className="mb-3 font-semibold text-lg">
{snippet.title}
</h3>


{/* CODE */}

<pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-green-400 text-sm">
<code>
{snippet.code}
</code>
</pre>

</div>

))}

</div>


{/* FEATURES */}

<div className="gap-10 grid md:grid-cols-3 mx-auto mt-24 px-10 max-w-6xl text-center">

<div className="bg-white/5 p-6 border border-white/10 rounded-xl">
<h3 className="mb-2 font-semibold text-xl">
Share Snippets
</h3>
<p className="text-gray-400 text-sm">
Upload and share useful code snippets with the developer community.
</p>
</div>

<div className="bg-white/5 p-6 border border-white/10 rounded-xl">
<h3 className="mb-2 font-semibold text-xl">
Code Reviews
</h3>
<p className="text-gray-400 text-sm">
Get feedback on your code and improve your development skills.
</p>
</div>

<div className="bg-white/5 p-6 border border-white/10 rounded-xl">
<h3 className="mb-2 font-semibold text-xl">
Developer Profiles
</h3>
<p className="text-gray-400 text-sm">
Build your developer profile and connect with other coders.
</p>
</div>

</div>


{/* FOOTER */}

<div className="mt-20 pb-10 text-gray-500 text-sm text-center">
© 2026 DevCollab. All rights reserved.
</div>


</div>

);
}

export default Landing;