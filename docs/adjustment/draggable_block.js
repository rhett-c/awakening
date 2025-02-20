// 坐标：右侧至页面右侧、底部至页面底部的距离

const draggable_block = document.getElementById('draggable-block');
const headerElement = document.querySelector('.md-header.md-header--shadow'); // 顶部导航栏
let tempX, tempY;
let isDragging = false;
const debounce_time = 50; // 防抖时间
const edge_distance = 20; // 触发自动贴边的距离
let maxX, maxY; // 限制拖动范围在可视区域内

// 触摸事件处理
draggable_block.addEventListener('touchstart', touchStart);
draggable_block.addEventListener('touchmove', touchMove);
draggable_block.addEventListener('touchend', touchEnd);

// 鼠标事件处理
draggable_block.addEventListener('mousedown', mouseDown);
document.addEventListener('mousemove', mouseMove);
document.addEventListener('mouseup', mouseUp);

function edgeStick(newX, newY) {
    // 判断靠近边缘并自动贴边
    if (newX < edge_distance) {
        draggable_block.style.right = '0';
    } else if (newX > maxX - edge_distance) {
        draggable_block.style.right = `${maxX}px`;
    }
    if (newY < edge_distance) {
        draggable_block.style.bottom = '0';
    } else if (newY > maxY - edge_distance) {
        draggable_block.style.bottom = `${maxY}px`;
    }
}

function touchStart(e) {
    const touch = e.touches[0];
    tempX = touch.clientX + (document.documentElement.clientWidth - draggable_block.getBoundingClientRect().right);
    tempY = touch.clientY + (document.documentElement.clientHeight - draggable_block.getBoundingClientRect().bottom);
    isDragging = true;
}

function touchMove(e) {
    if (!isDragging) return;

    e.preventDefault(); // 阻止默认的滚动行为

    const touch = e.touches[0];
    let newX = tempX - touch.clientX;
    let newY = tempY - touch.clientY;

    maxX = document.documentElement.clientWidth - draggable_block.offsetWidth;
    maxY = document.documentElement.clientHeight - draggable_block.offsetHeight - headerElement.offsetHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    draggable_block.style.right = `${newX}px`;
    draggable_block.style.bottom = `${newY}px`;

    edgeStick(newX, newY);
}

function touchEnd() {
    isDragging = false;
}

function mouseDown(e) {
    tempX = e.clientX + (document.documentElement.clientWidth - draggable_block.getBoundingClientRect().right);
    tempY = e.clientY + (document.documentElement.clientHeight - draggable_block.getBoundingClientRect().bottom);
    isDragging = true;
}

function mouseMove(e) {
    if (!isDragging) return;

    e.preventDefault(); // 阻止默认的拖动行为

    let newX = tempX - e.clientX;
    let newY = tempY - e.clientY;

    maxX = document.documentElement.clientWidth - draggable_block.offsetWidth;
    maxY = document.documentElement.clientHeight - draggable_block.offsetHeight - headerElement.offsetHeight;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    draggable_block.style.right = `${newX}px`;
    draggable_block.style.bottom = `${newY}px`;

    edgeStick(newX, newY);
}

function mouseUp() {
    isDragging = false;
}

const debounce = (fn, delay) => {
    let timer;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn();
        }, delay);
    }
};

const onResize = () => {
    // 重新计算拖动范围
    maxX = document.documentElement.clientWidth - draggable_block.offsetWidth;
    maxY = document.documentElement.clientHeight - draggable_block.offsetHeight - headerElement.offsetHeight;

    // 限制拖动范围在可视区域内
    let newX = document.documentElement.clientWidth - draggable_block.getBoundingClientRect().right;
    let newY = document.documentElement.clientHeight - draggable_block.getBoundingClientRect().bottom;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    draggable_block.style.right = `${newX}px`;
    draggable_block.style.bottom = `${newY}px`;

    edgeStick(newX, newY);
};

const resizeHandler = debounce(onResize, debounce_time);

// 窗口大小变化时，重新计算拖动范围
window.addEventListener('resize', resizeHandler);
