# NaTaUI — คลังไอเดีย UI สำหรับทุกคน

NaTaUI คือเว็บแอปภาษาไทยสำหรับค้นหา ทดลอง และเก็บตัวอย่าง UI Component เหมาะกับผู้เริ่มต้นที่อยากนำภาพและคำอธิบายไปให้ AI ช่วยต่อยอดเป็นเว็บไซต์จริง โปรเจกต์นี้จัดทำตามโจทย์ Mini Project 2 ในรูปแบบ Modern Decoupled SPA

## ฟีเจอร์หลัก

- คลังตัวอย่าง UI 21 รายการ 7 หมวดหมู่ พร้อมค้นหาและกรองตามรูปแบบ CSS/Tailwind CSS
- หน้ารายละเอียดพร้อม Preview แบบ sandboxed iframe, source code และปุ่มคัดลอก
- แคปภาพ Preview และคัดลอก Prompt สำหรับนำไปใช้อ้างอิงกับ AI
- My Collection บันทึกรายการโปรดข้ามการรีเฟรชด้วย LocalStorage
- HTML/CSS Playground แก้โค้ดและดูผลลัพธ์แบบสด
- Loading, Error, Retry, Empty state และหน้า 404
- Responsive รองรับมือถือ แท็บเล็ต และเดสก์ท็อป

## เทคโนโลยี

React 19, Vite, TypeScript strict mode, React Router v7, TanStack Query v5, Zustand persist, Tailwind CSS, DaisyUI, Lucide React และ JSON Server

## ติดตั้งและเริ่มใช้งาน

ต้องมี Node.js 20 ขึ้นไป จากนั้นรัน:

```bash
npm install
```

คัดลอก `.env.example` เป็น `.env` หากต้องการเปลี่ยน API URL ค่าเริ่มต้นคือ `/api` ซึ่ง Vite จะ proxy ไป `http://localhost:3001`

เริ่ม Frontend และ Mock API พร้อมกัน:

```bash
npm run dev:all
```

หรือเปิดแยกสอง Terminal:

```bash
npm run api
npm run dev
```

- Frontend: `http://localhost:5173`
- Mock REST API: `http://localhost:3001`

## Routes

| Route | หน้า |
| --- | --- |
| `/` | Explore Components |
| `/components/:id` | Component Detail |
| `/collection` | My Collection |
| `/about` | About |
| `/playground` | Playground |

## API Endpoints

- `GET /components`
- `GET /components/:id`
- `GET /components?category=ปุ่ม`
- `GET /components?framework=Tailwind%20CSS`

ฐานข้อมูลอยู่ที่ `server/db.json` และใช้ [JSON Server](https://github.com/typicode/json-server)

## Deploy บน Vercel

Vercel ใช้คำสั่ง `npm run build` และเผยแพร่โฟลเดอร์ `dist` ได้โดยตรง ข้อมูลตัวอย่างจะถูกรวมอยู่ใน production bundle จึงไม่ต้องเปิด JSON Server แยก ส่วน `vercel.json` จะส่ง route ของ React Router กลับไปยัง `index.html` เพื่อให้เปิดลิงก์ย่อยและรีเฟรชหน้าได้ตามปกติ

## การจัดการ State

- **TanStack Query** ดูแล Server State ได้แก่รายการ Components, รายละเอียด, cache, loading, error และ retry โดยตั้ง `staleTime` 5 นาที
- **Zustand + persist** ดูแล Client State เฉพาะ `favoriteIds` และ actions โดยบันทึกลง LocalStorage ไม่ทำสำเนาข้อมูล API ลงใน store

## ตรวจสอบและ Build

```bash
npm run typecheck
npm run build
npm run preview
```

## ทีมผู้จัดทำ

หน้า About มี placeholder สำหรับสมาชิก 2–3 คน กรุณาแทนที่ชื่อเล่น ชื่อ–นามสกุล รหัสนักศึกษา และหน้าที่ด้วยข้อมูลจริงก่อนส่งงาน

## ภาพหน้าจอสำหรับส่งงาน

ดูรายการที่ควรบันทึกใน `screenshots/README.md` และควรถ่ายจากแอปที่รันจริงเท่านั้น
