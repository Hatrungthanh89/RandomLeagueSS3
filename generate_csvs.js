const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\ULTRA 9\\Desktop\\Database_Template';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const players = `id,name,team,info,img
s1,Hoàng Huy,Sodapop,Đội trưởng,https://i.pravatar.cc/150?u=s1
s2,Thanh Tân,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s2
s3,Nguyên,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s3
s4,Du,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s4
s5,Trí Già,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s5
s6,Bee,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s6
s7,Linh,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s7
s8,Quân,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s8
s9,Vương,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s9
s10,Dân,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s10
s11,Trí Gây Mê,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s11
s12,Ấn,Sodapop,Cầu thủ,https://i.pravatar.cc/150?u=s12
c1,Bình,Chiến Lang,Đội trưởng,https://i.pravatar.cc/150?u=c1
c2,Anh Tú,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c2
c3,Only,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c3
c4,Mỹ,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c4
c5,Tâm Thái,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c5
c6,Vinh,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c6
c7,Nghĩa,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c7
c8,Thành,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c8
c9,Bảo,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c9
c10,Nhật Hòa,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c10
c11,Đức,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c11
c12,Minh Nghi,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c12
c13,Quý,Chiến Lang,Cầu thủ,https://i.pravatar.cc/150?u=c13
t1,Hùng Anh,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t1
t2,Dương Vũ,Thiết Thành,Đội trưởng,https://i.pravatar.cc/150?u=t2
t3,Tuấn Anh,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t3
t4,Tài,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t4
t5,Phát,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t5
t6,Khoa,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t6
t7,Dũng,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t7
t8,Hào,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t8
t9,Tuyên,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t9
t10,Nam Khánh,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t10
t11,Tùng,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t11
t12,Trọng Phú,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t12
t13,Dũng Già,Thiết Thành,Cầu thủ,https://i.pravatar.cc/150?u=t13`;

const matches = `id,round,match,teamA,teamB,scoreA,scoreB,scorers,cards
m1,1,1,Sodapop,Chiến Lang,2,1,"Hoàng Huy(2), Bình(1)",Thanh Tân(Y)`;

const finances = `id,date,content,in,out,balance,note
f1,01/06/2026,Thu quỹ tháng 6 (3 đội),3000000,0,3000000,`;

const rules = `id,rule,detail
r1,1. Thể thức,Đá vòng tròn 3 đội. Mỗi vòng 3 trận.
r2,2. Tính điểm,"Thắng: 2đ, Hòa: 1đ, Thua: 0đ. Hạng 1 vòng: +2đ tổng, Hạng 2 vòng: +1đ tổng."`;

fs.writeFileSync(path.join(dir, 'Players.csv'), "\uFEFF" + players, 'utf8');
fs.writeFileSync(path.join(dir, 'Matches.csv'), "\uFEFF" + matches, 'utf8');
fs.writeFileSync(path.join(dir, 'Finances.csv'), "\uFEFF" + finances, 'utf8');
fs.writeFileSync(path.join(dir, 'Rules.csv'), "\uFEFF" + rules, 'utf8');

console.log("Created CSV templates.");
