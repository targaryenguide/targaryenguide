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
    righthandholding: "TÚI PHẢI",
    lefthandholding: "TÚI TRÁI",
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
    skin: "DA",
    suit: "TRANG PHỤC",
    special: "ĐẶC BIỆT"
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
if (menuBtn) menuBtn.addEventListener('click', toggleMobileMenu);
if (overlay) overlay.addEventListener('click', toggleMobileMenu);

const logoElement = document.querySelector('.logo-img');
if (logoElement) {
    logoElement.style.cursor = 'pointer';
    logoElement.addEventListener('click', (e) => {
        e.preventDefault();
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

            const doneIcon = stage.done === true
                ? `<span class="cute-cat-container"><img src="assets/cute.webp" class="cute-cat-done-img" style="width: 22px; height: 22px;" alt="Done"></span>`
                : '';
            const btn = document.createElement('button');
            btn.className = 'arena-stage-btn stage-btn';
            btn.innerHTML = `<span>${stage.stage_name}</span> ${doneIcon}`;

            btn.addEventListener('click', () => {
                document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (window.innerWidth <= 768) toggleMobileMenu();

                loadAndDisplayStage(stage.stage_id, fileKey, stage.stage_name);
            });

            sidebarContainer.appendChild(btn);
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

            const bookInner = document.createElement('div');
            bookInner.className = 'nested-content-inner';
            bookContent.appendChild(bookInner);

            book.chapters.forEach(chapter => {
                const chapterWrapper = document.createElement('div');
                chapterWrapper.className = 'nested-chapter-block';
                const chapterToggle = document.createElement('div');
                chapterToggle.className = 'nested-toggle-btn level2';
                chapterToggle.innerHTML = `<span>${chapter.chapter_name}</span><span class="sub-arrow">▼</span>`;
                chapterWrapper.appendChild(chapterToggle);

                const stageList = document.createElement('div');
                stageList.className = 'nested-content-stages';

                const stageInner = document.createElement('div');
                stageInner.className = 'nested-stages-inner';
                stageList.appendChild(stageInner);

                chapter.stages.forEach(stage => {
                    const stageNum = stage.stage_id.split('/').pop();

                    const isStandardDone = stage.done_standard === true || stage.done === true;
                    const isHighDone = stage.done_high === true || stage.done === true;

                    // BO DI HIEU UNG O AI ME
                    // const isAllDone = isStandardDone && isHighDone;
                    // const parentIcon = isAllDone
                    //     ? `<span class="cute-cat-container"><img src="assets/cute.webp" class="cute-cat-done-img" alt="Done"></span>`
                    //     : '';
                    const parentIcon = '';

                    const displayLabel = `Ải ${stageNum}: ${stage.stage_name} ${parentIcon}`;

                    createStageWithSubmenus(displayLabel, stageNum, stage.stage_id, stageInner, isStandardDone, isHighDone);
                });
                chapterWrapper.appendChild(stageList);
                chapterToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    chapterToggle.classList.toggle('active');
                    stageList.classList.toggle('show');
                });
                bookInner.appendChild(chapterWrapper);
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

            const stageInner = document.createElement('div');
            stageInner.className = 'nested-content-inner';
            stageList.appendChild(stageInner);

            chapter.stages.forEach(stage => {
                const stageNum = stage.stage_id.split('/').pop();

                const isStandardDone = stage.done_standard === true || stage.done === true;
                const isHighDone = stage.done_high === true || stage.done === true;

                // BO DI HIEU UNG O AI ME
                // const isAllDone = isStandardDone && isHighDone;
                // const parentIcon = isAllDone
                //     ? `<span class="cute-cat-container"><img src="assets/cute.webp" class="cute-cat-done-img" alt="Done"></span>`
                //     : '';
                const parentIcon = '';

                const displayLabel = `Ải ${stageNum}: ${stage.stage_name} ${parentIcon}`;

                createStageWithSubmenus(displayLabel, stageNum, stage.stage_id, stageInner, isStandardDone, isHighDone);
            });

            chapterWrapper.appendChild(stageList);
            chapterToggle.addEventListener('click', () => {
                chapterToggle.classList.toggle('active');
                stageList.classList.toggle('show');
            });
            sidebarContainer.appendChild(chapterWrapper);
        });
    } else if (currentTab === 'event') {
        if (!menuData.event) return;
        menuData.event.forEach(chapter => {
            const chapterWrapper = document.createElement('div');
            chapterWrapper.className = 'nested-wrapper';
            const chapterToggle = document.createElement('div');
            chapterToggle.className = 'nested-toggle-btn level1';
            chapterToggle.innerHTML = `<span>${chapter.chapter_name}</span><span class="sub-arrow">▼</span>`;
            chapterWrapper.appendChild(chapterToggle);

            const stageList = document.createElement('div');
            stageList.className = 'nested-content';

            const stageInner = document.createElement('div');
            stageInner.className = 'nested-content-inner';
            stageList.appendChild(stageInner);

            chapter.stages.forEach(stage => {
                const stageNum = stage.stage_id.split('/').pop();
                const doneIcon = stage.done === true
                    ? `<span class="cute-cat-container"><img src="assets/cute.png" class="cute-cat-done-img" alt="Done"></span>`
                    : '';
                const displayLabel = `${stage.stage_name} ${doneIcon}`;
                createStageButton(displayLabel, stageNum, stage.stage_id, stageInner);
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
    btn.innerHTML = labelText;
    btn.addEventListener('click', () => {
        document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (window.innerWidth <= 768) toggleMobileMenu();
        loadAndDisplayStage(fileLoadPath, stageKey, labelText);
    });
    container.appendChild(btn);
}

function createStageWithSubmenus(displayLabel, stageNum, fileLoadPath, container, doneStandard, doneHigh) {
    const stageWrapper = document.createElement('div');
    stageWrapper.className = 'nested-stage-block';

    const stageToggle = document.createElement('div');
    stageToggle.className = 'nested-toggle-btn level3';
    stageToggle.innerHTML = `<span>${displayLabel}</span><span class="sub-arrow">▼</span>`;
    stageWrapper.appendChild(stageToggle);

    const subContent = document.createElement('div');
    subContent.className = 'nested-content-sub';

    const subInner = document.createElement('div');
    subInner.className = 'nested-inner-sub';

    const subIcon = `<span class="cute-cat-container"><img src="assets/cute.webp" class="cute-cat-done-img" style="width: 18px; height: 18px;" alt="Done"></span>`;

    const btnStandard = document.createElement('button');
    btnStandard.className = 'sub-stage-btn stage-btn';
    btnStandard.innerHTML = `Trọng lượng tiêu chuẩn ${doneStandard ? subIcon : ''}`;
    btnStandard.addEventListener('click', () => {
        document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
        btnStandard.classList.add('active');
        if (window.innerWidth <= 768) toggleMobileMenu();
        loadAndDisplayStage(`${fileLoadPath}_standard`, stageNum, `${displayLabel} - Tiêu Chuẩn`);
    });
    subInner.appendChild(btnStandard);

    const btnHigh = document.createElement('button');
    btnHigh.className = 'sub-stage-btn stage-btn';
    btnHigh.innerHTML = `Trọng lượng siêu cao ${doneHigh ? subIcon : ''}`;
    btnHigh.addEventListener('click', () => {
        document.querySelectorAll('.stage-btn').forEach(b => b.classList.remove('active'));
        btnHigh.classList.add('active');
        if (window.innerWidth <= 768) toggleMobileMenu();
        loadAndDisplayStage(`${fileLoadPath}_high`, stageNum, `${displayLabel} - Siêu Cao`);
    });
    subInner.appendChild(btnHigh);

    subContent.appendChild(subInner);

    stageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        stageToggle.classList.toggle('active');
        subContent.classList.toggle('show');
    });

    stageWrapper.appendChild(subContent);
    container.appendChild(stageWrapper);
}

async function loadAndDisplayStage(fileLoadPath, stageKey, labelText) {
    const mainArea = document.getElementById('stage-details-area');
    const titleElement = document.getElementById('stage-title');
    const attrElement = document.getElementById('stage-attributes');

    titleElement.innerText = "Đang tải dữ liệu...";
    attrElement.innerHTML = '';

    mainArea.innerHTML = `
        <div style="text-align:center; padding:60px 20px;">
            <div class="loading-spinner"></div>
            <div style="color:var(--primary-pink); font-weight:700; font-size: 15px; letter-spacing: 0.5px;">Đang chuẩn bị trang phục...</div>
        </div>
    `;

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
            titleElement.innerHTML = labelText;
            attrElement.innerHTML = '<span class="stage-special-tag-item">Chưa có dữ liệu</span>';
            mainArea.innerHTML = '<div style="text-align:center; padding:40px; color:#A89598;">Chưa cập nhật gợi ý cho mục này.</div>';
            return;
        }

        titleElement.innerHTML = labelText;
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
        let hasDataToDisplay = false;

        // --- PHẦN 1: THÊM LỜI CẢM ƠN (CREDIT) ĐÁNG YÊU ---
        if (stageDetail.credit) {
            hasDataToDisplay = true;
            const creditWrapper = document.createElement('div');
            creditWrapper.className = 'cute-credit-wrapper';
            creditWrapper.innerHTML = `
                <span class="credit-icon-anim"></span>
                <span class="credit-message">Cảm ơn<b class="credit-name">${stageDetail.credit}</b> vì đã giúp chúng tớ chỉnh sửa và hoàn thiện set ❤️</span>
                <span class="credit-icon-anim" style="animation-delay: 0.5s;"></span>
            `;
            mainArea.appendChild(creditWrapper);
        }

        // --- PHẦN 2: RENDER TRANG PHỤC (RECOMMENDATIONS) ---
        if (stageDetail.recommendations && Object.keys(stageDetail.recommendations).length > 0) {
            hasDataToDisplay = true;
            for (let [categoryKey, itemsList] of Object.entries(stageDetail.recommendations)) {
                if (!itemsList || itemsList.length === 0) continue;

                const isAnswerEvent = stageDetail.is_answer_event;

                let isFixed = false;
                if (isAnswerEvent && categoryKey.includes('[FIXED]')) {
                    isFixed = true;
                    categoryKey = categoryKey.replace('[FIXED]', '').trim();
                }

                const wrapper = document.createElement('div');
                wrapper.className = 'category-wrapper';

                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'category-toggle-btn';

                const contentAnimWrapper = document.createElement('div');
                contentAnimWrapper.className = 'category-anim-wrapper';

                const contentGrid = document.createElement('div');
                contentGrid.className = 'category-content';

                contentAnimWrapper.appendChild(contentGrid);

                let top20Items = [];
                if (stageDetail.is_answer_event) {
                    top20Items = itemsList;
                } else {
                    top20Items = [...itemsList].sort((a, b) => {
                        const scoreA = parseInt(String(a.score).replace(/,/g, '')) || 0;
                        const scoreB = parseInt(String(b.score).replace(/,/g, '')) || 0;
                        return scoreB - scoreA;
                    }).slice(0, 20);
                }

                let isRendered = false;
                const renderItems = () => {
                    if (isRendered) return;

                    let currentRank = 1;
                    let highestScore = null;

                    const fragment = document.createDocumentFragment();

                    top20Items.forEach((item, index) => {
                        const card = document.createElement('div');
                        card.className = 'item-card';

                        let rankBadge = '';
                        if (stageDetail.is_answer_event) {
                            let catText = categoryNames[item.category] || String(item.category).toUpperCase();
                            rankBadge = `<div class="item-rank" style="background:#FFF0F2; color:#FF5A7E; font-size:9px; border:1px solid rgba(255,107,139,0.15); font-weight:800; border-radius:6px; padding:2px 6px;">${catText}</div>`;
                        } else {
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
                            rankBadge = currentRank === 1
                                ? `<div class="item-rank rank-first">#1</div>`
                                : `<div class="item-rank">#${currentRank}</div>`;
                        }

                        let scoreBadge = '';
                        if (!stageDetail.is_answer_event && item.score) {
                            scoreBadge = `<div class="item-score-badge">${String(item.score).toLocaleString()}</div>`;
                        }

                        let craftBadge = '';
                        if (item.required === true) {
                            craftBadge = `<div class="item-craft-badge">YÊU CẦU CHẾ TẠO</div>`;
                        }
                        if (item.note === true) {
                            craftBadge = `<div class="item-note-badge">YÊU CẦU VƯỢT ẢI</div>`;
                        }
                        if (item.suggest === true) {
                            craftBadge = `<div class="item-suggest-badge">KHÔNG TỐN KIM CƯƠNG</div>`;
                        }
                        if (item.custom_red_badge && typeof item.custom_red_badge === 'string') {
                            craftBadge = `<div class="item-custom-red-badge">${item.custom_red_badge.toUpperCase()}</div>`;
                        }

                        let attrTagsHTML = '';
                        if (Array.isArray(item.item_attrs)) {
                            item.item_attrs.forEach(attr => {
                                attrTagsHTML += `<span class="mini-attr-tag ${getAttrClass(attr)}">${attr}</span>`;
                            });
                        }

                        const itemCategoryFolder = stageDetail.is_answer_event ? (item.category || 'accessory') : categoryKey;

                        const webpImgPath = `assets/items/${itemCategoryFolder}/${item.id}.webp`;
                        const pngImgPath = `assets/items/${itemCategoryFolder}/${item.id}.png`;
                        const backupImg = `https://picsum.photos/100?random=${item.id}`;

                        card.innerHTML = `
                            ${rankBadge}
                            ${scoreBadge}
                            <div class="item-image-container">
                                <img src="${webpImgPath}" 
                                     decoding="async"
                                     onerror="if(!this.dataset.triedPng){ this.dataset.triedPng=true; this.src='${pngImgPath}'; } else { this.onerror=null; this.src='${backupImg}'; }" 
                                     alt="${item.name}" 
                                     loading="lazy">
                                ${craftBadge}
                            </div>
                            <div class="item-name">${item.name}</div>
                            <div class="item-mini-attrs-wrap">${attrTagsHTML}</div>
                        `;

                        card.addEventListener('click', () => openModal(item, itemCategoryFolder, webpImgPath, backupImg));
                        fragment.appendChild(card);
                    });

                    contentGrid.appendChild(fragment);
                    isRendered = true;
                };

                if (isFixed) {
                    toggleBtn.className = 'category-toggle-btn active';
                    toggleBtn.style.cursor = 'default';
                    toggleBtn.style.color = '#f85454';
                    toggleBtn.innerHTML = `<span>${categoryKey.toUpperCase()}</span>`;
                    contentAnimWrapper.className = 'category-anim-wrapper show';
                    renderItems();
                } else {
                    if (isAnswerEvent) {
                        toggleBtn.style.color = '#000000';
                        toggleBtn.innerHTML = `<span>${categoryKey.toUpperCase()}</span><span class="arrow">▼</span>`;
                    } else {
                        toggleBtn.innerHTML = `<span>${categoryNames[categoryKey] || categoryKey.toUpperCase()}</span><span class="arrow">▼</span>`;
                    }

                    toggleBtn.addEventListener('click', () => {
                        renderItems();
                        toggleBtn.classList.toggle('active');
                        contentAnimWrapper.classList.toggle('show');
                    });
                }

                wrapper.appendChild(toggleBtn);
                wrapper.appendChild(contentAnimWrapper);
                mainArea.appendChild(wrapper);
            }
        }

        // --- PHẦN 3: RENDER CÂU HỎI & ĐÁP ÁN (Q&A) ---
        if (stageDetail.qna && stageDetail.qna.length > 0) {
            hasDataToDisplay = true;
            const qnaWrapper = document.createElement('div');
            qnaWrapper.className = 'qna-wrapper';

            const qnaTitle = document.createElement('div');
            qnaTitle.className = 'qna-title';
            qnaTitle.innerHTML = '<span> CÂU HỎI & ĐÁP ÁN</span>';

            const qnaContent = document.createElement('div');
            qnaContent.className = 'qna-content';

            stageDetail.qna.forEach(item => {
                const qBlock = document.createElement('div');
                qBlock.className = 'qna-item';
                qBlock.innerHTML = `
                    <div class="qna-question"><span class="q-label">Q:</span> ${item.question || item.q}</div>
                    <div class="qna-answer"><span class="a-label">A:</span> <span class="highlight-answer">${item.answer || item.a}</span></div>
                `;
                qnaContent.appendChild(qBlock);
            });

            qnaWrapper.appendChild(qnaTitle);
            qnaWrapper.appendChild(qnaContent);
            mainArea.appendChild(qnaWrapper);
        }

        // --- XỬ LÝ TRƯỜNG HỢP KHÔNG CÓ DỮ LIỆU ---
        if (!hasDataToDisplay) {
            mainArea.innerHTML = '<div style="text-align:center; padding:40px; color:#A89598; font-style:italic;">Gợi ý đang được cập nhật...</div>';
        }

    } catch (error) {
        console.error(error);
        titleElement.innerText = "Mục này chưa có dữ liệu. Đợi chúng tớ nhé!!!";
        mainArea.innerHTML = '<div style="text-align:center; padding:40px; color:red;">Đang đợi thêm dữ liệu......</div>';
    }
}

function formatTitleCase(str) {
    if (!str) return "";
    return str.toLowerCase().replace(/(^|\s)\S/g, function (l) {
        return l.toUpperCase();
    });
}

function openModal(item, categoryKey, webpImg, backupImg) {
    const modal = document.getElementById('item-modal');
    document.getElementById('modal-title').innerText = item.name;

    const imgElement = document.getElementById('modal-img');
    const pngImg = webpImg.replace('.webp', '.png');

    if (imgElement) {
        delete imgElement.dataset.triedPng;
        imgElement.src = webpImg;
        imgElement.onerror = () => {
            if (!imgElement.dataset.triedPng) {
                imgElement.dataset.triedPng = "true";
                imgElement.src = pngImg;
            } else {
                imgElement.onerror = null;
                imgElement.src = backupImg;
            }
        };
    }

    const rawCategory = categoryNames[categoryKey] || categoryKey;
    const formattedCategory = formatTitleCase(rawCategory);

    const detailsElement = document.getElementById('modal-details');
    if (detailsElement) {
        detailsElement.innerHTML = `
            <p class="modal-info-p"><b>↬ Loại:</b> ${formattedCategory}</p>
            <p class="modal-info-p"><b>↬ Bộ:</b> ${item.suit || "Chưa cập nhập"}</p>
            <p class="modal-info-p"><b>↬ Cách nhận:</b> ${item.source || "Chưa cập nhật"}</p>
        `;
    }
    if (modal) modal.showModal();
}

const itemModal = document.getElementById('item-modal');
if (itemModal) {
    itemModal.addEventListener('click', (event) => {
        const rect = itemModal.getBoundingClientRect();
        const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            itemModal.close();
        }
    });
}

window.addEventListener('DOMContentLoaded', loadMenuData);