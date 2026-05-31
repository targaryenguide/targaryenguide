let menuData = null;
let loadedStages = {};
let currentTab = 'journey';

const categoryNames = {
    hair: "TÓC",
    dress: "ĐẦM",
    coat: "KHOÁC",
    top: "ÁO",
    bottom: "QUẦN",
    leglet: "PHỤ KIỆN CHÂN",
    hosiery: "VỚ",
    shoes: "GIÀY",
    makeup: "MẶT",
    spirit: "HỒN ĐOM ĐÓM",
    hairornament: "PHỤ KIỆN TÓC",
    veil: "KHĂN TRÙM ĐẦU",
    hairpin: "KẸP TÓC",
    ear: "TAI",
    earring: "HOA TAI",
    scarf: "KHĂN CHOÀNG CỔ",
    necklace: "DÂY CHUYỀN",
    righthandornament: "VÒNG TAY PHẢI",
    lefthandornament: "VÒNG TAY TRÁI",
    gloves: "GĂNG TAY",
    righthandheld: "TÚI PHẢI",
    lefthandheld: "TÚI TRÁI",
    waist: "DÂY LƯNG",
    faceaccessory: "MẶT NẠ",
    brooch: "CÀI ÁO",
    tattoo: "HÌNH XĂM",
    wings: "CÁNH",
    tail: "ĐUÔI",
    foreground: "NỀN TRƯỚC",
    background: "NỀN SAU",
    headornament: "ĐỈNH ĐẦU",
    ground: "MẶT ĐẤT",
    skin: "DA"
};

function getAttrClass(attrName) {
    if (!attrName) return "";
    if (attrName.includes("Đơn giản") || attrName.includes("Simple")) return "attr-simple";
    if (attrName.includes("Quý phái") || attrName.includes("Gorgeous")) return "attr-gorgeous";
    if (attrName.includes("Thanh lịch") || attrName.includes("Elegant")) return "attr-elegant";
    if (attrName.includes("Năng động") || attrName.includes("Lively")) return "attr-lively";
    if (attrName.includes("Dễ thương") || attrName.includes("Cute")) return "attr-cute";
    if (attrName.includes("Trưởng thành") || attrName.includes("Mature")) return "attr-mature";
    if (attrName.includes("Gợi cảm") || attrName.includes("Sexy")) return "attr-sexy";
    if (attrName.includes("Trong sáng") || attrName.includes("Pure")) return "attr-pure";
    if (attrName.includes("Giữ ấm") || attrName.includes("Warm")) return "attr-warm";
    if (attrName.includes("Mát mẻ") || attrName.includes("Cool")) return "attr-cool";
    return "";
}

const menuBtn = document.getElementById('menu-toggle-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function toggleMobileMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}
menuBtn.addEventListener('click', toggleMobileMenu);
overlay.addEventListener('click', toggleMobileMenu);

const logoElement = document.querySelector('.logo');
if (logoElement) {
    logoElement.style.cursor = 'pointer';
    logoElement.addEventListener('click', () => {
        window.location.reload();
    });
}

async function loadMenuData() {
    try {
        const response = await fetch('data/menu.json');
        menuData = await response.json();
        initTabs();
        renderSidebar();
    } catch (error) {
        console.error("Lỗi đọc sơ đồ menu.json:", error);
    }
}

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTab = btn.dataset.tab;
            renderSidebar();
        });
    });
}

function renderSidebar() {
    const sidebarContainer = document.getElementById('chapter-list');
    sidebarContainer.innerHTML = '';
    if (!menuData) return;

    if (currentTab === 'arena') {
        if (!menuData.arena) return;
        const title = document.createElement('div');
        title.className = 'nested-title-level1';
        title.innerText = "CHỦ ĐỀ THI ĐẤU";
        sidebarContainer.appendChild(title);

        menuData.arena.forEach(stage => {
            const fileKey = stage.stage_id.split('/').pop();
            createStageButton(stage.stage_name, fileKey, stage.stage_id, sidebarContainer);
        });
    } else if (currentTab === 'journey') {
        if (!menuData.journey) return;
        menuData.journey.forEach(book => {
            const bookWrapper = document.createElement('div');
            bookWrapper.className = 'nested-wrapper';
            const bookToggle = document.createElement('div');
            bookToggle.className = 'nested-toggle-btn level1';
            bookToggle.innerHTML = `<span> ${book.book_name}</span><span class="sub-arrow">▼</span>`;
            bookWrapper.appendChild(bookToggle);

            const bookContent = document.createElement('div');
            bookContent.className = 'nested-content';

            book.chapters.forEach(chapter => {
                const chapterWrapper = document.createElement('div');
                chapterWrapper.className = 'nested-chapter-block';
                const chapterToggle = document.createElement('div');
                chapterToggle.className = 'nested-toggle-btn level2';
                chapterToggle.innerHTML = `<span>${chapter.chapter_name}</span><span class="sub-arrow">▼</span>`;
                chapterWrapper.appendChild(chapterToggle);

                const stageList = document.createElement('div');
                stageList.className = 'nested-content-stages';

                chapter.stages.forEach(stage => {
                    const displayLabel = `Ải ${stage.stage_id.split('/').pop()}: ${stage.stage_name}`;
                    const fileKey = stage.stage_id.split('/').pop();
                    createStageButton(displayLabel, fileKey, stage.stage_id, stageList);
                });

                chapterWrapper.appendChild(stageList);
                chapterToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    chapterToggle.classList.toggle('active');
                    stageList.classList.toggle('show');
                });
                bookContent.appendChild(chapterWrapper);
            });

            bookWrapper.appendChild(bookContent);
            bookToggle.addEventListener('click', () => {
                bookToggle.classList.toggle('active');
                bookContent.classList.toggle('show');
            });
            sidebarContainer.appendChild(bookWrapper);
        });
    } else if (currentTab === 'association') {
        if (!menuData.association) return;
        menuData.association.forEach(chapter => {
            const chapterWrapper = document.createElement('div');
            chapterWrapper.className = 'nested-wrapper';
            const chapterToggle = document.createElement('div');
            chapterToggle.className = 'nested-toggle-btn level1';
            chapterToggle.innerHTML = `<span>${chapter.chapter_name}</span><span class="sub-arrow">▼</span>`;
            chapterWrapper.appendChild(chapterToggle);

            const stageList = document.createElement('div');
            stageList.className = 'nested-content';

            chapter.stages.forEach(stage => {
                const displayLabel = `Ải ${stage.stage_id.split('/').pop()}: ${stage.stage_name}`;
                const fileKey = stage.stage_id.split('/').pop();
                createStageButton(displayLabel, fileKey, stage.stage_id, stageList);
            });

            chapterWrapper.appendChild(stageList);
            chapterToggle.addEventListener('click', () => {
                chapterToggle.classList.toggle('active');
                stageList.classList.toggle('show');
            });
            sidebarContainer.appendChild(chapterWrapper);
        });
    } else if (currentTab === 'event') {
        if (!menuData.association) return;
        menuData.event.forEach(chapter => {
            const chapterWrapper = document.createElement('div');
            chapterWrapper.className = 'nested-wrapper';
            const chapterToggle = document.createElement('div');
            chapterToggle.className = 'nested-toggle-btn level1';
            chapterToggle.innerHTML = `<span>${chapter.chapter_name}</span><span class="sub-arrow">▼</span>`;
            chapterWrapper.appendChild(chapterToggle);

            const stageList = document.createElement('div');
            stageList.className = 'nested-content';

            chapter.stages.forEach(stage => {
                const displayLabel = `Chủ đề: ${stage.stage_id.split('/').pop()}: ${stage.stage_name}`;
                const fileKey = stage.stage_id.split('/').pop();
                createStageButton(displayLabel, fileKey, stage.stage_id, stageList);
            });

            chapterWrapper.appendChild(stageList);
            chapterToggle.addEventListener('click', () => {
                chapterToggle.classList.toggle('active');
                stageList.classList.toggle('show');
            });
            sidebarContainer.appendChild(chapterWrapper);
        });
    }
}

function createStageButton(labelText, stageKey, fileLoadPath, container) {
    const btn = document.createElement('button');
    btn.className = 'stage-btn';
    btn.innerText = labelText;
    btn.addEventListener('click', () => {
        document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window.innerWidth <= 768) toggleMobileMenu();
        loadAndDisplayStage(fileLoadPath, stageKey, labelText);
    });
    container.appendChild(btn);
}

async function loadAndDisplayStage(fileLoadPath, stageKey, labelText) {
    const mainArea = document.getElementById('stage-details-area');
    const titleElement = document.getElementById('stage-title');
    const attrElement = document.getElementById('stage-attributes');

    titleElement.innerText = "Đang tải dữ liệu...";
    attrElement.innerHTML = '';
    mainArea.innerHTML = '<div style="text-align:center; padding:40px; color:#FF6B8B; font-weight:bold;">Đang chuẩn bị trang phục...</div>';

    const changelogBoard = document.getElementById('changelog-board');
    if (changelogBoard) {
        changelogBoard.style.display = 'none';
    }

    try {
        if (!loadedStages[fileLoadPath]) {
            const response = await fetch(`data/${fileLoadPath}.json`);
            if (!response.ok) throw new Error("Không tìm thấy file JSON");
            loadedStages[fileLoadPath] = await response.json();
        }

        const stageDetail = loadedStages[fileLoadPath][stageKey];
        if (!stageDetail) {
            titleElement.innerText = labelText;
            attrElement.innerHTML = '<span class="stage-special-tag-item">Chưa có dữ liệu</span>';
            mainArea.innerHTML = '<div style="text-align:center; padding:40px; color:#A89598;">Chưa cập nhật gợi ý cho mục này.</div>';
            return;
        }

        titleElement.innerText = labelText;
        attrElement.innerHTML = '';

        if (Array.isArray(stageDetail.attributes)) {
            const flexContainer = document.createElement('div');
            flexContainer.className = 'stage-attrs-flex-container';

            stageDetail.attributes.forEach(attr => {
                const nameText = typeof attr === 'object' ? attr.name : attr;
                const attrClass = getAttrClass(nameText);

                const pill = document.createElement('div');
                pill.className = `attr-pill-block ${attrClass}`;
                pill.innerText = nameText;
                flexContainer.appendChild(pill);
            });
            attrElement.appendChild(flexContainer);
        } else if (stageDetail.attributes) {
            const flexContainer = document.createElement('div');
            flexContainer.className = 'stage-attrs-flex-container';
            stageDetail.attributes.split('-').forEach(str => {
                const nameText = str.trim();
                const pill = document.createElement('div');
                pill.className = `attr-pill-block ${getAttrClass(nameText)}`;
                pill.innerText = nameText;
                flexContainer.appendChild(pill);
            });
            attrElement.appendChild(flexContainer);
        }

        if (Array.isArray(stageDetail.tags) && stageDetail.tags.length > 0) {
            const tagContainer = document.createElement('div');
            tagContainer.className = 'stage-special-tags-container';
            stageDetail.tags.forEach(t => {
                const span = document.createElement('span');
                span.className = 'stage-special-tag-item';
                span.innerText = t;
                tagContainer.appendChild(span);
            });
            attrElement.appendChild(tagContainer);
        }

        mainArea.innerHTML = '';

        if (!stageDetail.recommendations || Object.keys(stageDetail.recommendations).length === 0) {
            mainArea.innerHTML = '<div style="text-align:center; padding:40px; color:#A89598; font-style:italic;">Gợi ý trang phục đang được cập nhật...</div>';
            return;
        }

        for (const [categoryKey, itemsList] of Object.entries(stageDetail.recommendations)) {
            if (!itemsList || itemsList.length === 0) continue;

            const sortedItems = [...itemsList].sort((a, b) => {
                const scoreA = parseInt(String(a.score).replace(/,/g, '')) || 0;
                const scoreB = parseInt(String(b.score).replace(/,/g, '')) || 0;
                return scoreB - scoreA;
            });

            const wrapper = document.createElement('div');
            wrapper.className = 'category-wrapper';

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'category-toggle-btn';
            toggleBtn.innerHTML = `<span>${categoryNames[categoryKey] || categoryKey.toUpperCase()} (${sortedItems.length})</span><span class="arrow">▼</span>`;

            const contentGrid = document.createElement('div');
            contentGrid.className = 'category-content';

            toggleBtn.addEventListener('click', () => {
                toggleBtn.classList.toggle('active');
                contentGrid.classList.toggle('show');
            });

            const top20Items = sortedItems.slice(0, 20);

            let currentRank = 1;
            let highestScore = null;

            top20Items.forEach((item, index) => {
                const currentScore = parseInt(String(item.score).replace(/,/g, '')) || 0;

                if (index === 0) {
                    highestScore = currentScore;
                    currentRank = 1;
                } else {
                    if (currentScore === highestScore) {
                        currentRank = 1;
                    } else {
                        currentRank = index + 1;
                    }
                }

                const card = document.createElement('div');
                card.className = 'item-card';

                let rankBadge = currentRank === 1
                    ? `<div class="item-rank rank-first">#1</div>`
                    : `<div class="item-rank">#${currentRank}</div>`;

                let attrTagsHTML = '';
                if (Array.isArray(item.item_attrs)) {
                    item.item_attrs.forEach(attr => {
                        attrTagsHTML += `<span class="mini-attr-tag ${getAttrClass(attr)}">${attr}</span>`;
                    });
                }

                const realImgPath = `assets/items/${categoryKey}/${item.id}.png`;
                const backupImg = `https://picsum.photos/100?random=${item.id}`;

                const categoriesWithScore = ['dress', 'top', 'bottom', 'skin'];
                let scoreBadge = '';
                if (categoriesWithScore.includes(categoryKey) && item.score) {
                    scoreBadge = `<div class="item-score-badge">${String(item.score).toLocaleString()}</div>`;
                }

                let craftBadge = '';
                if (item.required === true) {
                    craftBadge = `<div class="item-craft-badge">YÊU CẦU CHẾ TẠO</div>`;
                }
                card.innerHTML = `
                 ${rankBadge}
                 ${scoreBadge}
              
                 <img src="${realImgPath}" onerror="this.onerror=null; this.src='${backupImg}';" alt="${item.name}" loading="lazy">
                 ${craftBadge}
                 <div class="item-name">${item.name}</div>
                 <div class="item-mini-attrs-wrap">${attrTagsHTML}</div>
                `;

                card.addEventListener('click', () => openModal(item, categoryKey, realImgPath, backupImg));
                contentGrid.appendChild(card);
            });

            wrapper.appendChild(toggleBtn);
            wrapper.appendChild(contentGrid);
            mainArea.appendChild(wrapper);
        }

    } catch (error) {
        console.error(error);
        titleElement.innerText = "Lỗi dữ liệu";
        mainArea.innerHTML = '<div style="text-align:center; padding:40px; color:red;">Không thể tải dữ liệu chi tiết của ải.</div>';
    }
}

function openModal(item, categoryKey, realImg, backupImg) {
    const modal = document.getElementById('item-modal');
    document.getElementById('modal-title').innerText = item.name;

    const imgElement = document.getElementById('modal-img');
    imgElement.src = realImg;
    imgElement.onerror = () => { imgElement.src = backupImg; };

    document.getElementById('modal-details').innerHTML = `
        <p class="modal-info-p"><b>Loại:</b> ${(categoryNames[categoryKey] || categoryKey).toUpperCase()}</p>
        <p class="modal-info-p"><b>Bộ:</b> ${item.suit}</p>
        <p class="modal-info-p"><b>Cách nhận:</b> ${item.source}</p>
    `;
    modal.showModal();
}

window.addEventListener('DOMContentLoaded', loadMenuData);