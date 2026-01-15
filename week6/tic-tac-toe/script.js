const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';

let currentTurn = 'X';
let xScore = 0;
let oScore = 0;
let isGameOver = false; // เพิ่มสถานะเช็คว่าเกมจบหรือยัง

// 1. กำหนดรูปแบบการชนะ (แนวราบ, แนวตั้ง, แนวทแยง)
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // แนวนอน
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // แนวตั้ง
    [0, 4, 8], [2, 4, 6]             // แนวทแยง
];

function onClick(event) {
    if (isGameOver) return; // ถ้าเกมจบแล้ว กดต่อไม่ได้

    const container = event.currentTarget;
    const image = document.createElement('img');
    
    // ใส่ class หรือ attribute เพื่อใช้เช็คผู้ชนะภายหลัง
    container.dataset.owner = currentTurn;

    if (currentTurn === 'X') {
        image.src = X_IMAGE_URL;
        image.style.filter = "hue-rotate(90deg)"; // เปลี่ยนสี X ตามโจทย์
        currentTurn = 'O';
    } else {
        image.src = O_IMAGE_URL;
        currentTurn = 'X';
    }

    container.appendChild(image);
    container.removeEventListener('click', onClick);
    
    checkWinner(); // ทุกครั้งที่คลิก ให้เช็คว่ามีคนชนะหรือยัง
}

// 2. ฟังก์ชันตรวจสอบผู้ชนะ
function checkWinner() {
    const boxes = document.querySelectorAll('#grid div');
    
    for (let combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        
        // เช็คว่าทั้ง 3 ช่องในแนวเดียวกัน มีเจ้าของคนเดียวกันหรือไม่
        if (boxes[a].dataset.owner && 
            boxes[a].dataset.owner === boxes[b].dataset.owner && 
            boxes[a].dataset.owner === boxes[c].dataset.owner) {
            
            const winner = boxes[a].dataset.owner;
            updateScore(winner);
            isGameOver = true;
            alert("Winner is " + winner);
            return;
        }
    }
}

// 3. ฟังก์ชันอัปเดตคะแนน
function updateScore(winner) {
    if (winner === 'X') {
        xScore++;
        document.querySelector('#x-score').textContent = xScore;
    } else {
        oScore++;
        document.querySelector('#o-score').textContent = oScore;
    }
}

const resetBtn = document.querySelector('#reset-button');
resetBtn.addEventListener('click', () => {
    const boxes = document.querySelectorAll('#grid div');
    for (const box of boxes) {
        box.innerHTML = ''; 
        delete box.dataset.owner; // ล้างสถานะเจ้าของช่อง
        box.addEventListener('click', onClick); 
    }
    currentTurn = 'X';
    isGameOver = false;
});

const boxes = document.querySelectorAll('#grid div');
for (const box of boxes) {
    box.addEventListener('click', onClick);
}