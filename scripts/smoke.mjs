import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:3001';
async function req(path,body,cookie) {
 const r=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const text=await r.text(); let data;try{data=JSON.parse(text)}catch{data=text}
 return {status:r.status,data,cookie:r.headers.get('set-cookie')};
}
for(const p of ['/','/book','/admin/login']){const r=await req(p);assert.equal(r.status,200,p);assert.equal(typeof r.data,'string');assert(!r.data.includes('Internal Server Error'));}
assert.equal((await req('/api/admin/bookings')).status,401);
const quote={routeId:1,vehicleCategoryId:1,passengerCount:2,largeBags:1,smallBags:1,tripType:'one_way'};
assert.equal((await req('/api/quote',quote)).data.fare,4800);
assert.equal((await req('/api/quote',{...quote,passengerCount:10})).status,422);
const booking={...quote,pickupDate:'2026-12-20',pickupTime:'12:00',customerName:'Local smoke test',email:'smoke@example.test',phone:'+639000000000',preferredContact:'email'};
const created=await req('/api/bookings',booking);assert.equal(created.status,200,JSON.stringify(created.data));assert(created.data.referenceCode);
assert.equal((await req('/api/bookings',booking)).data.referenceCode,created.data.referenceCode);
assert.equal((await req('/book/confirmation/'+created.data.referenceCode)).status,200);
assert.equal((await req('/api/admin/login',{email:'admin@localhost.test',password:'wrong'})).status,401);
const login=await req('/api/admin/login',JSON.parse(readFileSync('.local/admin.json','utf8')));
assert.equal(login.status,200,JSON.stringify(login.data));assert(login.cookie?.includes('HttpOnly'));
const cookie=login.cookie.split(';')[0];
assert.equal((await req('/api/admin/bookings',null,cookie)).status,200);
for(const p of ['/admin','/admin/routes','/admin/vehicles','/admin/settings']) assert.equal((await req(p,null,cookie)).status,200,p);
console.log('PASS: homepage, booking page, quotes, capacity checks, booking persistence, duplicate protection, confirmation, admin login, protected APIs and dashboard pages.');
