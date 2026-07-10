[![wakatime](https://wakatime.com/badge/github/Cookie4686/CEDT-Intern-Map.svg)](https://wakatime.com/badge/github/Cookie4686/CEDT-Intern-Map)

# About This Project

โปรเจคนี้ทำการดึงข้อมูลตำแหน่งฝึกงานจากระบบของสาขาวิชา  
เพื่อค้นหาตำแหน่งผ่าน Google API แล้วนำผลที่ได้ไปแสดงลงบนแผนที่

หากมีความต้องการนำโค้ดไปใช้สามารถนำไปใช้ได้เลย

# Idea

เนื่องจากใน Website ของสาขามีตำแหน่งสถานที่ฝึกงานมา และต้องนำไปค้นหาทีละอันเอง  
จึงหาวิธีให้สามารถค้นหาตำแหน่งเหล่านั้นได้ทั้งหมด และแสดงบนแผนที่ให้ตัดสินใจเลือกได้ทีเดียวเลย

ระบบที่สร้างไม่ได้ซับซ้อนแต่อย่างใด  
Frontend ใช้ Nextjs+React, Deploy Vercel, แผนที่ใช้ deckgl และ maplibre  
การดึงข้อมูลใช้ Python ยิง API ไปที่เว็บไซต์ภาควิชาและ Google API **(using unethical ways)**

Script ที่ใช้ในการดึงข้อมูลอยู่ใน [Internship_Map.ipynb](Internship_Map.ipynb)  
URL ที่ทำการ deploy [cedt-intern-map.vercel.app](https://cedt-intern-map.vercel.app/)

# This could be wrong

โปรเจคนี้มีข้อมูลที่อาจต้องปิดบังต่อสาธารณะ หากทางสาขาหรือทางบริษัทไม่ต้องการให้ข้อมูลถูกเผยแพร่  
สามารถติดต่อขอปิด repo นี้ได้ผ่านทางอีเมลตามหน้า [Profile GitHub](https://github.com/Cookie4686)
