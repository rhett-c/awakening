const fab = document.getElementById('fab');
const iconBox = document.getElementsByClassName('icon-box')[0];
const coveredTextList = document.getElementsByClassName('covered-text');
const sidebar = document.querySelector('.md-sidebar.md-sidebar--secondary'); // 侧边栏（右侧导航栏）
const nav = document.querySelector('.md-nav.md-nav--secondary'); // 导航栏（竖屏界面菜单内导航栏）
const modeSwitchWidth = 945; // 切换横竖屏的页面宽度
// ⬆ TODO:  无法隐藏侧边导航中出现的作者名称，作为替代，隐藏整个侧边导航
//          触发竖屏模式的条件: 页面宽度小于 1220px / 945px (怎么变了？)
let coveringTextList;
const minWidth = 250; // 显示悬浮按钮的最小页面宽度
const minHeight = 400; // 显示悬浮按钮的最小页面高度
const debounce_time = 50; // 防抖时间
const textAppearTime = 200; // 文本出现时间
const textDisappearTime = 200; // 文本消失时间
const onFabTitle = '熄灭蜡烛'; // 按钮激活时的提示
const offFabTitle = '点燃蜡烛'; // 按钮未激活时的提示
const onImagePath = 'https://rhett-c.github.io/awakening/icons/lighted_candle.png'; // 按钮激活时的图标路径
const offImagePath = 'https://rhett-c.github.io/awakening/icons/unlighted_candle.png'; // 按钮未激活时的图标路径

// 页面加载时，初始化
window.addEventListener('load', init);

function init() {
    // 页面加载时，判断是否显示悬浮按钮
    displayFab();

    // 页面加载时，加载按钮图标和提示（默认为未激活状态）
    fab.title = offFabTitle;
    iconBox.style.backgroundImage = `url(${offImagePath})`;

    // 页面加载时，隐藏导航栏（尝试在float_action_button.css中设置）
    // 需要注意sidebar与nav的隐藏方式不同
    if (document.documentElement.clientWidth >= modeSwitchWidth) {
        sidebar.style.opacity = 0;
        sidebar.style.pointerEvents = 'none';
        nav.style.opacity = 1;
    } else {
        nav.style.opacity = 0;
        nav.style.pointerEvents = 'none';
        sidebar.style.opacity = 1;
    }
    sidebar.style.transition = 'all 0.75s ease';
    nav.style.transition = 'all 0.75s ease';

    // 页面加载时，预处理所有covered-text元素
    // 生成covering-text元素，用来替代covered-text元素
    for (let i = 0; i < coveredTextList.length; i++) {
        coveredTextList[i].style.display = 'none';
        // 添加替代性文本
        const newTextDiv = document.createElement('div');
        newTextDiv.className = 'covering-text';
        newTextDiv.innerHTML = "████████";
        // newTextDiv.style.backgroundColor = '#000000'; // 微软雅黑字体可以显示出练续黑条，且宽度比背景色宽，因此不使用黑色背景
        newTextDiv.style.backgroundColor = '#ffffff';
        newTextDiv.style.opacity = 0;
        newTextDiv.style.display = 'inline';
        newTextDiv.style.transition = 'all 0.4s ease-in-out';
        coveredTextList[i].parentNode.insertBefore(newTextDiv, coveredTextList[i]);
    }

    // 获取所有covering-text元素
    coveringTextList = document.getElementsByClassName('covering-text');
    // 重新显示covering-text元素
    for (let i = 0; i < coveringTextList.length; i++) {
        setTimeout(() => {
            coveringTextList[i].style.opacity = 1;
        }, textAppearTime);
    }
}

// 页面大小发生变化时，重新判断是否显示悬浮按钮
function displayFab() {
    if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
        fab.style.display = 'none';
    } else {
        fab.style.display = 'block';
    }
}

// 页面大小发生变化时，重新判断是否隐藏导航栏
function displaySidebarOrNav() {
    if (buttonStatus) {
        // 按钮处于激活状态
        if (document.documentElement.clientWidth >= modeSwitchWidth) {
            sidebar.style.opacity = 1;
            sidebar.style.pointerEvents = 'auto';
        } else {
            nav.style.opacity = 1;
            nav.style.pointerEvents = 'auto';
        }
    }
    else {
        // 按钮处于未激活状态
        if (document.documentElement.clientWidth >= modeSwitchWidth) {
            sidebar.style.opacity = 0;
            sidebar.style.pointerEvents = 'none';
        } else {
            nav.style.opacity = 0;
            nav.style.pointerEvents = 'none';
        }
    }
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
    displayFab();
    displaySidebarOrNav();
}

const resizeHandler = debounce(onResize, debounce_time);

window.addEventListener('resize', resizeHandler);

// 控制按钮状态切换
let buttonStatus = false; // 按钮状态
fab.addEventListener('click', () => {
    buttonStatus = !buttonStatus;
    if (buttonStatus) {

        // 按钮处于激活状态

        fab.classList.add('active');
        fab.title = onFabTitle;
        fab.style.backgroundColor = '#d7c9af';
        iconBox.style.backgroundImage = `url(${onImagePath})`;
        if (document.documentElement.clientWidth >= modeSwitchWidth) {
            sidebar.style.opacity = 1;
            sidebar.style.pointerEvents = 'auto';
        } else {
            nav.style.opacity = 1;
            nav.style.pointerEvents = 'auto';
        }
        document.documentElement.style.filter = 'brightness(100%)';

        for (let i = 0; i < coveredTextList.length; i++) {
            // 隐藏covering-text元素
            textDisappearing(coveringTextList[i], textDisappearTime);
            setTimeout(() => {
                // 显示covered-text元素
                textAppearing(coveredTextList[i], textAppearTime);
            }, textDisappearTime);
        }
    } else {

        // 按钮处于未激活状态

        fab.classList.remove('active');
        fab.title = offFabTitle;
        fab.style.backgroundColor = '#c2b08f';
        iconBox.style.backgroundImage = `url(${offImagePath})`;
        if (document.documentElement.clientWidth >= modeSwitchWidth) {
            sidebar.style.opacity = 0;
            sidebar.style.pointerEvents = 'none';
        } else {
            nav.style.opacity = 0;
            nav.style.pointerEvents = 'none';
        }
        document.documentElement.style.filter = 'brightness(90%)';

        for (let i = 0; i < coveredTextList.length; i++) {
            // 隐藏covered-text元素
            textDisappearing(coveredTextList[i], textDisappearTime);
            setTimeout(() => {
                // 显示covering-text元素
                textAppearing(coveringTextList[i], textAppearTime);
            }, textDisappearTime);
        }
    }
});

function textAppearing(div, time_delay) {
    // 首先隐藏
    div.style.opacity = 0;
    div.style.display = 'inline';
    // 等待一段时间后，恢复原状
    setTimeout(() => {
        div.style.opacity = 1;
    }, time_delay);
}

function textDisappearing(div, time_delay) {
    // 等待一段时间后，隐藏
    div.style.opacity = 0;
    setTimeout(() => {
        div.style.display = 'none';
    }, time_delay);
}

// 点击按钮时，创造一个新的div元素，并播放效果动画
fab.addEventListener('click', () => {
    const newDiv = document.createElement('div');
    newDiv.classList.add('wave');
    if (buttonStatus) {
        newDiv.style.animation = 'wave-animation 3s';
    }
    else {
        newDiv.style.animation = 'wave-animation-reverse 4s';
    }
    fab.appendChild(newDiv);
    setTimeout(() => {
        fab.removeChild(newDiv);
    }, 5000);
});