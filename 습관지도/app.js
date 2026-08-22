// 데이터 구조
let mapData = {
  date: getTodayDate(),
  checkpoints: [],
  obstacles: [],
  signs: [],
  memos: {},
  bookmarks: {} // { signNumber: true } - 책갈피한 해결 방안 메모
};

let checkpointCounter = 0;
let obstacleCounter = 0;
let signCounter = 0;

// 오른쪽 오브제를 드래그해서 지도에 놓을 때, 드롭 위치 계산 결과를
// 모달을 확인하기 전까지 잠시 담아두는 곳
let pendingDrop = null;

// 이전/이후(되돌리기) 기록. mapData의 스냅샷(JSON 문자열)을 순서대로 담아둠
let history = [];
let historyIndex = -1;

// ============ 초기화 ============
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadMapData();
  resetHistory();
  renderPreviousMaps();
  updateDate();
});

function initializeApp() {
  mapData = {
    date: getTodayDate(),
    checkpoints: [],
    obstacles: [],
    signs: [],
    memos: {},
    bookmarks: {}
  };
  checkpointCounter = 0;
  obstacleCounter = 0;
  signCounter = 0;
  pendingDrop = null;
}

// ============ 이전/이후(되돌리기) ============
// 지금의 mapData를 기록의 첫 시점으로 삼아 되돌리기 기록을 새로 시작함
// (다른 날짜의 지도를 불러왔을 때처럼, 지금 mapData가 통째로 바뀐 시점에 호출)
function resetHistory() {
  history = [JSON.stringify(mapData)];
  historyIndex = 0;
  updateUndoRedoButtons();
}

// 지금 mapData 상태를 기록에 새로 남김 (깃발/막다른 길/표지판을 추가했을 때 호출)
function pushHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(JSON.stringify(mapData));
  historyIndex = history.length - 1;
  updateUndoRedoButtons();
}

function undo() {
  if (historyIndex <= 0) return;
  historyIndex--;
  mapData = JSON.parse(history[historyIndex]);
  afterHistoryJump();
}

function redo() {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  mapData = JSON.parse(history[historyIndex]);
  afterHistoryJump();
}

function afterHistoryJump() {
  renderMap();
  renderMemoSection();
  saveMapData();
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  if (undoBtn) undoBtn.disabled = historyIndex <= 0;
  if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
}

function getTodayDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// 날짜 입력창에 지금 작성 중인 지도의 날짜(mapData.date)를 표시
function updateDate() {
  document.getElementById('mapDateInput').value = mapData.date;
}

// 사용자가 날짜 입력창에서 날짜를 직접 바꿨을 때
function handleDateChange(e) {
  const newDate = e.target.value;
  const oldDate = mapData.date;
  if (!newDate || newDate === oldDate) return;

  const existingRaw = localStorage.getItem(newDate);
  if (existingRaw) {
    const loadExisting = confirm(
      `${newDate}에는 이미 작성된 지도가 있어요.\n\n` +
      `확인: 그 지도를 불러올게요 (지금 작성 중이던 내용은 사라져요)\n` +
      `취소: 지금 작성 중인 내용을 이 날짜로 옮길게요 (기존 지도는 덮어써져요)`
    );
    if (loadExisting) {
      mapData = JSON.parse(existingRaw);
      mapData.bookmarks = mapData.bookmarks || {};
      checkpointCounter = Math.max(...mapData.checkpoints.map(cp => cp.id + 1), 0);
      obstacleCounter = Math.max(...mapData.obstacles.map(obs => obs.id + 1), 0);
      signCounter = Math.max(...Object.keys(mapData.memos).map(Number)) + 1 || 0;
      renderMap();
      renderMemoSection();
      updateDate();
      resetHistory();
      renderPreviousMaps();
      return;
    }
  }

  // 지금 작성 중인 지도를 새 날짜로 옮김 (예전 날짜 항목은 지움)
  localStorage.removeItem(oldDate);
  mapData.date = newDate;
  saveMapData();
  updateDate();
  resetHistory();
  renderPreviousMaps();
}

// ============ 이벤트 리스너 ============
function setupEventListeners() {
  // 오브제 드래그 시작 (깃발 / 막다른 길 / 표지판)
  document.querySelectorAll('.tool-object').forEach(obj => {
    obj.addEventListener('dragstart', handleDragStart);
  });

  // 지도 영역에 드롭
  const mapAreaEl = document.querySelector('.map-area');
  let dragCounter = 0;
  mapAreaEl.addEventListener('dragover', (e) => e.preventDefault());
  mapAreaEl.addEventListener('dragenter', () => {
    dragCounter++;
    mapAreaEl.classList.add('drag-hover');
  });
  mapAreaEl.addEventListener('dragleave', () => {
    dragCounter = Math.max(0, dragCounter - 1);
    if (dragCounter === 0) mapAreaEl.classList.remove('drag-hover');
  });
  mapAreaEl.addEventListener('drop', (e) => {
    dragCounter = 0;
    mapAreaEl.classList.remove('drag-hover');
    handleDrop(e);
  });

  // 이전/이후 상태로 되돌리기
  document.getElementById('undoBtn').addEventListener('click', undo);
  document.getElementById('redoBtn').addEventListener('click', redo);

  // 지도 날짜 변경
  document.getElementById('mapDateInput').addEventListener('change', handleDateChange);

  // 모달 닫기
  document.querySelector('.close').addEventListener('click', closeModal);
  document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
  document.getElementById('modalConfirmBtn').addEventListener('click', handleModalConfirm);

  // 이용설명서 팝업
  document.getElementById('usageGuideBtn').addEventListener('click', openUsageModal);
  document.getElementById('usageModalClose').addEventListener('click', closeUsageModal);

  // 탭 전환
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.target.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // 모달 바깥 클릭 시 닫기
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
      closeModal();
    }
    const usageModal = document.getElementById('usageModal');
    if (e.target === usageModal) {
      closeUsageModal();
    }
  });
}

function openUsageModal() {
  document.getElementById('usageModal').classList.add('show');
}

function closeUsageModal() {
  document.getElementById('usageModal').classList.remove('show');
}

// ============ 드래그 앤 드롭 ============
function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.type);
  e.dataTransfer.effectAllowed = 'copy';

  // 네모난 도구 칸 전체가 아니라, 그 안의 오브제(아이콘)만 드래그되어 보이도록
  const icon = e.currentTarget.querySelector('.tool-icon');
  if (icon) {
    const rect = icon.getBoundingClientRect();
    e.dataTransfer.setDragImage(icon, rect.width / 2, rect.height / 2);
  }

  e.currentTarget.classList.add('dragging');
  e.currentTarget.addEventListener('dragend', () => {
    e.currentTarget.classList.remove('dragging');
  }, { once: true });
}

// 화면 좌표(clientX/Y)를 지도 SVG 내부 좌표로 변환
function toSvgPoint(clientX, clientY) {
  const svg = document.getElementById('mapSvg');
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

// 큰 길(#mainPath) 위에서 (x, y)와 가장 가까운 지점을 찾아
// 좌표와 함께, 그 지점이 길의 시작점부터 얼마나 떨어져 있는지(pathPos)를 반환
// → pathPos가 클수록 길을 더 많이 지나온 지점 = 전후관계를 판단하는 기준이 됨
function getNearestPointOnPath(x, y) {
  const path = document.getElementById('mainPath');
  const totalLength = path.getTotalLength();
  const SAMPLES = 200;
  let best = null;
  let bestDist = Infinity;

  for (let i = 0; i <= SAMPLES; i++) {
    const len = (totalLength * i) / SAMPLES;
    const pt = path.getPointAtLength(len);
    const dist = (pt.x - x) ** 2 + (pt.y - y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = { x: pt.x, y: pt.y, pathPos: len };
    }
  }
  return best;
}

// 큰 길의 "가장자리" 지점을 계산 (중심선이 아니라, 도로 폭만큼 옆으로 옮긴 지점)
// → 막다른 길이 중심선이 아니라 큰 길 옆면에서 자연스럽게 갈라져 나오게 함
// towardX/Y: 사용자가 드롭한 위치 (도로의 어느 쪽 가장자리인지 결정하는 데 씀)
const ROAD_HALF_WIDTH = 39; // #mainPath 가장 바깥쪽 폭(78)의 정확히 절반 = 큰 길의 실제 가장자리

function getRoadEdgePoint(pathPos, towardX, towardY) {
  const path = document.getElementById('mainPath');
  const totalLength = path.getTotalLength();
  const delta = 3;
  const p0 = path.getPointAtLength(Math.max(0, pathPos - delta));
  const p1 = path.getPointAtLength(Math.min(totalLength, pathPos + delta));
  const center = path.getPointAtLength(pathPos);

  // 그 지점에서 길이 향하는 방향(접선)과, 그에 수직인 방향(도로 폭 방향)
  const tx = p1.x - p0.x;
  const ty = p1.y - p0.y;
  const tLen = Math.hypot(tx, ty) || 1;
  const nx = -ty / tLen;
  const ny = tx / tLen;

  // 드롭한 위치가 중심선 기준 어느 쪽인지에 맞춰 가장자리 방향(부호)을 정함
  const side = (towardX - center.x) * nx + (towardY - center.y) * ny;
  const sign = side >= 0 ? 1 : -1;

  return {
    x: center.x + nx * ROAD_HALF_WIDTH * sign,
    y: center.y + ny * ROAD_HALF_WIDTH * sign
  };
}

// 정렬된 깃발 목록에서, 주어진 pathPos(막다른 길이 갈라지는 지점)의
// 바로 앞/뒤 깃발을 찾음 → 이 두 깃발 사이의 막다른 길이 됨
function getBracketingCheckpoints(sortedCps, pathPos) {
  for (let i = 0; i < sortedCps.length - 1; i++) {
    if (pathPos >= sortedCps[i].pathPos && pathPos <= sortedCps[i + 1].pathPos) {
      return { before: sortedCps[i], after: sortedCps[i + 1] };
    }
  }
  if (pathPos < sortedCps[0].pathPos) {
    return { before: sortedCps[0], after: sortedCps[1] };
  }
  return { before: sortedCps[sortedCps.length - 2], after: sortedCps[sortedCps.length - 1] };
}

function handleDrop(e) {
  e.preventDefault();

  // 놓자마자 도구 칸 오브제가 흐린 채로 남지 않도록 확실히 되돌림
  // (dragend 이벤트로도 지워지지만, 놓는 순간 한 번 더 확실히 지움)
  document.querySelectorAll('.tool-object.dragging').forEach(el => el.classList.remove('dragging'));

  const type = e.dataTransfer.getData('text/plain');
  if (!type) return;

  const svgPoint = toSvgPoint(e.clientX, e.clientY);

  if (type === 'checkpoint') {
    handleCheckpointDrop(svgPoint);
  } else if (type === 'obstacle') {
    handleObstacleDrop(svgPoint);
  } else if (type === 'sign') {
    handleSignDrop(svgPoint);
  }
}

// 깃발: 큰 길 가운데 점선(중심선)에 자동으로 정렬되도록 스냅
function handleCheckpointDrop(svgPoint) {
  const snap = getNearestPointOnPath(svgPoint.x, svgPoint.y);
  pendingDrop = { type: 'checkpoint', x: snap.x, y: snap.y, pathPos: snap.pathPos };
  showModal('checkpoint');
}

// 막다른 길: 큰 길에서 갈라지는 지점(도로 접점)은 중심선이 아니라 큰 길의 가장자리에 스냅하고,
// 실제로 드롭한 방향으로 살짝 떨어진 곳에 막다른 길 모양을 배치
function handleObstacleDrop(svgPoint) {
  if (mapData.checkpoints.length < 2) {
    alert('먼저 깃발을 2개 이상 추가해주세요');
    return;
  }

  const snap = getNearestPointOnPath(svgPoint.x, svgPoint.y);
  const edge = getRoadEdgePoint(snap.pathPos, svgPoint.x, svgPoint.y);

  const dx = svgPoint.x - edge.x;
  const dy = svgPoint.y - edge.y;
  const dist = Math.hypot(dx, dy) || 1;
  const branchLength = 90; // 조금 더 길게
  const bx = edge.x + (dx / dist) * branchLength;
  const by = edge.y + (dy / dist) * branchLength;

  pendingDrop = {
    type: 'obstacle',
    x: bx,
    y: by,
    roadX: edge.x,
    roadY: edge.y,
    pathPos: snap.pathPos
  };
  showModal('obstacle');
}

// 표지판: 드롭한 위치에서 가장 가까운 막다른 길을 찾아 자동으로 연결
function handleSignDrop(svgPoint) {
  if (mapData.obstacles.length === 0) {
    alert('먼저 막다른 길을 추가해주세요');
    return;
  }

  let nearest = null;
  let bestDist = Infinity;
  mapData.obstacles.forEach(obs => {
    const dist = (obs.x - svgPoint.x) ** 2 + (obs.y - svgPoint.y) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      nearest = obs;
    }
  });

  pendingDrop = { type: 'sign', obstacleId: nearest.id };
  showModal('sign');
}

// ============ 모달 관리 ============
let currentModalType = null;

function showModal(type) {
  currentModalType = type;
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (type === 'checkpoint') {
    modalTitle.textContent = '🚩 깃발 추가';
    modalBody.innerHTML = `
      <label>활동 이름</label>
      <input type="text" class="modal-input" id="checkpointName" placeholder="예: 저녁식사">
      <label>색상</label>
      <select class="modal-select" id="checkpointColor">
        <option value="red">🔴 빨강</option>
        <option value="blue">🔵 파랑</option>
        <option value="yellow">🟡 노랑</option>
        <option value="green">🟢 초록</option>
      </select>
    `;
  } else if (type === 'obstacle') {
    modalTitle.textContent = '🛑 막다른 길 추가';
    modalBody.innerHTML = `
      <label>방해 요소</label>
      <input type="text" class="modal-input" id="obstacleName" placeholder="예: 유튜브">
    `;
  } else if (type === 'sign') {
    modalTitle.textContent = '📍 표지판 추가 & 메모';
    modalBody.innerHTML = `
      <label>개선 방안 (메모)</label>
      <textarea class="modal-input" id="signMemo" placeholder="예: 알람 맞춰두기" style="height: 80px; resize: none;"></textarea>
    `;
  }

  modal.classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  currentModalType = null;
  pendingDrop = null;
}

function handleModalConfirm() {
  if (!pendingDrop) {
    // 드래그로 지도에 놓은 오브제가 없으면(=위치 정보가 없으면) 만들 수 없음
    closeModal();
    return;
  }

  if (currentModalType === 'checkpoint') {
    const name = document.getElementById('checkpointName').value;
    const color = document.getElementById('checkpointColor').value;

    if (!name) {
      alert('활동 이름을 입력해주세요');
      return;
    }

    const checkpoint = {
      id: checkpointCounter++,
      name: name,
      color: color,
      x: pendingDrop.x,
      y: pendingDrop.y,
      pathPos: pendingDrop.pathPos
    };

    mapData.checkpoints.push(checkpoint);
    // 큰 길을 따라간 거리(pathPos) 순으로 정렬 → 정확한 시간 없이도 전후관계가 유지됨
    mapData.checkpoints.sort((a, b) => a.pathPos - b.pathPos);
  } else if (currentModalType === 'obstacle') {
    const name = document.getElementById('obstacleName').value;

    if (!name) {
      alert('방해 요소를 입력해주세요');
      return;
    }

    const sortedCps = [...mapData.checkpoints].sort((a, b) => a.pathPos - b.pathPos);
    const bracket = getBracketingCheckpoints(sortedCps, pendingDrop.pathPos);

    const obstacle = {
      id: obstacleCounter++,
      name: name,
      checkpointBefore: bracket.before.id,
      checkpointAfter: bracket.after.id,
      x: pendingDrop.x,
      y: pendingDrop.y,
      roadX: pendingDrop.roadX,
      roadY: pendingDrop.roadY,
      pathPos: pendingDrop.pathPos,
      signNumber: null
    };

    mapData.obstacles.push(obstacle);
  } else if (currentModalType === 'sign') {
    const memo = document.getElementById('signMemo').value;

    if (!memo) {
      alert('개선 방안을 입력해주세요');
      return;
    }

    const obstacle = mapData.obstacles.find(obs => obs.id === pendingDrop.obstacleId);
    obstacle.signNumber = signCounter;
    mapData.memos[signCounter] = memo;

    const sign = {
      id: signCounter++,
      obstacleId: obstacle.id,
      // #objSign은 기준점(0,0)이 기둥 밑동이므로, 막다른 길 끝(obstacle.x/y)에 바로 앵커링
      x: obstacle.x,
      y: obstacle.y,
      number: obstacle.signNumber
    };

    mapData.signs.push(sign);
  }

  closeModal();
  renderMap();
  renderMemoSection();
  saveMapData();
  pushHistory();
}

// ============ 렌더링 ============
function renderMap() {
  const checkpointsGroup = document.getElementById('checkpointsGroup');
  const obstaclesGroup = document.getElementById('obstaclesGroup');
  const signsGroup = document.getElementById('signsGroup');

  checkpointsGroup.innerHTML = '';
  obstaclesGroup.innerHTML = '';
  signsGroup.innerHTML = '';

  // 깃발 렌더링
  mapData.checkpoints.forEach(cp => {
    const flagSvg = createFlagSvg(cp);
    checkpointsGroup.appendChild(flagSvg);
  });

  // 막다른 길 렌더링
  mapData.obstacles.forEach(obs => {
    const lineSvg = createObstacleSvg(obs);
    obstaclesGroup.appendChild(lineSvg);
  });

  // 표지판 렌더링
  mapData.signs.forEach(sign => {
    const signSvg = createSignSvg(sign);
    signsGroup.appendChild(signSvg);
  });
}

// 오른쪽 도구 칸의 오브제와 정확히 같은 모양(#objFlag/#objObstacle/#objSign, index.html의 <defs> 참고)을
// <use>로 그대로 가져다 쓴다 → 도구 칸 오브제와 지도 위 오브제의 모양이 항상 같음
const FLAG_COLOR_MAP = {
  red: '#ff6b6b',
  blue: '#4ecdc4',
  yellow: '#ffe66d',
  green: '#95e77d'
};

// #objObstacle 원본 곡선(M0 0 Q28 -26 56 0)의 접점(0,0)→끝(56,0) 거리
// → 실제 지도 위에서 이 길이만큼 늘렸다 줄였다 하면서 크기를 맞춘다
const OBSTACLE_SHAPE_LENGTH = 56;

function createFlagSvg(checkpoint) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#objFlag');
  use.setAttribute('transform', `translate(${checkpoint.x} ${checkpoint.y})`);
  use.setAttribute('fill', FLAG_COLOR_MAP[checkpoint.color] || FLAG_COLOR_MAP.red);
  use.classList.add('checkpoint-flag');

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', checkpoint.x + 38);
  label.setAttribute('y', checkpoint.y + 30);
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('font-size', '24'); // 지도 위 깃발 설명 글자: 이전(36px)의 2/3
  label.setAttribute('fill', '#666');
  label.textContent = checkpoint.name;

  group.appendChild(use);
  group.appendChild(label);

  return group;
}

function createObstacleSvg(obstacle) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const cpBefore = mapData.checkpoints.find(cp => cp.id === obstacle.checkpointBefore);

  // roadX/roadY: 막다른 길이 큰 길에서 갈라져 나가는 실제 접점(드롭 시 스냅된 지점)
  // 예전 데이터(드래그 도입 전)에는 없을 수 있어 이전 깃발 위치로 대체
  const startX = obstacle.roadX !== undefined ? obstacle.roadX : (cpBefore ? cpBefore.x : obstacle.x);
  const startY = obstacle.roadY !== undefined ? obstacle.roadY : (cpBefore ? cpBefore.y : obstacle.y);

  // 접점(startX,startY)에서 갈라진 끝(obstacle.x,y) 방향으로 회전 + 길이에 맞춰 확대
  const dx = obstacle.x - startX;
  const dy = obstacle.y - startY;
  const dist = Math.hypot(dx, dy) || 1;
  const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
  const scale = dist / OBSTACLE_SHAPE_LENGTH;

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#objObstacle');
  use.setAttribute('transform', `translate(${startX} ${startY}) rotate(${angleDeg}) scale(${scale})`);
  use.classList.add('obstacle-line');

  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', obstacle.x + 10);
  label.setAttribute('y', obstacle.y - 8);
  label.setAttribute('font-size', '22'); // 지도 위 막다른 길 설명 글자: 이전(33px)의 2/3
  label.setAttribute('fill', '#6e5636');
  label.setAttribute('font-weight', 'bold');
  label.textContent = obstacle.name;

  group.appendChild(use);
  group.appendChild(label);

  return group;
}

function createSignSvg(sign) {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#objSign');
  use.setAttribute('transform', `translate(${sign.x} ${sign.y})`);
  use.classList.add('sign-icon');

  // 직사각형 판(가로 -39~39, 세로 -90~-39) 정가운데쯤에 번호 표시
  const number = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  number.setAttribute('x', sign.x);
  number.setAttribute('y', sign.y - 57);
  number.setAttribute('text-anchor', 'middle');
  number.setAttribute('font-size', '22');
  number.setAttribute('font-weight', 'bold');
  number.setAttribute('fill', 'white');
  number.textContent = sign.number;

  group.appendChild(use);
  group.appendChild(number);

  return group;
}

// HTML 속성/텍스트에 안전하게 넣기 위한 이스케이프
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 지도보기 아래 메모칸: 첫 줄은 "표지판 내용" 고정 제목,
// 그 아래로 표지판을 추가한 순서대로 (번호 배지 + 직접 고칠 수 있는 입력칸)이 한 줄씩 나옴
function renderMemoSection() {
  const memoContent = document.getElementById('memoContent');

  let html = '<p class="memo-header-line">표지판 내용</p>';

  mapData.signs.forEach(sign => {
    const memoText = mapData.memos[sign.number] || '';
    html += `
      <div class="memo-edit-row">
        <span class="memo-num-badge">${sign.number}</span>
        <input type="text" class="memo-edit-input" value="${escapeHtml(memoText)}"
          placeholder="메모를 입력하세요" onchange="handleMemoEdit(${sign.number}, this.value)">
      </div>`;
  });

  memoContent.innerHTML = html;
}

// 메모칸에서 표지판 메모를 직접 고쳤을 때
function handleMemoEdit(signNumber, newText) {
  mapData.memos[signNumber] = newText;
  saveMapData();
}

// ============ 탭 전환 ============
function switchTab(tabName) {
  // 탭 버튼 활성화
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

  // 탭 콘텐츠 표시
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');

  if (tabName === 'memo') {
    renderAllMemos();
  }
}

// 저장된 모든 날짜를 훑어서 (막다른 길, 해결 방안 메모) 하나하나를
// 개별 항목으로 모은다 → 책갈피는 이 개별 항목 단위로 붙는다
function collectAllMemoEntries() {
  const savedDates = getSavedDates().sort().reverse(); // 최신 날짜가 먼저
  const entries = [];

  savedDates.forEach(date => {
    const raw = localStorage.getItem(date);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (!data.memos || Object.keys(data.memos).length === 0) return;
    const bookmarks = data.bookmarks || {};

    (data.obstacles || []).forEach(obs => {
      if (obs.signNumber === null || obs.signNumber === undefined) return;
      const memoText = data.memos[obs.signNumber];
      if (!memoText) return;

      const cpBefore = data.checkpoints.find(cp => cp.id === obs.checkpointBefore);
      const cpAfter = data.checkpoints.find(cp => cp.id === obs.checkpointAfter);

      entries.push({
        date,
        signNumber: obs.signNumber,
        obstacleName: obs.name,
        memoText,
        beforeName: cpBefore ? cpBefore.name : '',
        afterName: cpAfter ? cpAfter.name : '',
        bookmarked: !!bookmarks[obs.signNumber]
      });
    });
  });

  return entries;
}

// (앞 깃발) ㅡ (표지판 메모) ㅡ (뒤 깃발) 형식.
// 앞/뒤 깃발은 그 표지판이 달린 막다른 길의 바로 앞/뒤에 있던 깃발
function renderMemoCardHtml(entry) {
  // 기본은 빈 별(☆), 책갈피하면 노란 채워진 별(★)로 바뀜
  return `
    <div class="memo-card${entry.bookmarked ? ' bookmarked' : ''}">
      <button class="bookmark-btn${entry.bookmarked ? ' bookmarked' : ''}" onclick="toggleBookmark('${entry.date}', ${entry.signNumber})" title="책갈피">${entry.bookmarked ? '★' : '☆'}</button>
      <div class="memo-card-body">
        <div class="memo-card-line"><strong>${entry.beforeName}</strong> ㅡ ${entry.memoText} ㅡ <strong>${entry.afterName || '마침'}</strong></div>
      </div>
    </div>`;
}

function renderAllMemos() {
  const allMemosList = document.getElementById('allMemosList');
  const entries = collectAllMemoEntries();

  if (entries.length === 0) {
    allMemosList.innerHTML = '<p class="empty-message">아직 메모가 없어요</p>';
    return;
  }

  const bookmarked = entries.filter(e => e.bookmarked);
  const rest = entries.filter(e => !e.bookmarked);

  let html = '';

  if (bookmarked.length > 0) {
    html += `<div class="memo-section-label">★ 책갈피한 메모</div>`;
    html += bookmarked.map(renderMemoCardHtml).join('');
  }

  let lastDate = null;
  rest.forEach(entry => {
    if (entry.date !== lastDate) {
      html += `<div class="memo-date-label">${new Date(entry.date).toLocaleDateString('ko-KR')}</div>`;
      lastDate = entry.date;
    }
    html += renderMemoCardHtml(entry);
  });

  allMemosList.innerHTML = html;
}

// 개별 메모(막다른 길 하나)에 책갈피를 켜고 끈다.
// 지금 작성 중인 날짜의 메모면 mapData를 직접 바꾸고, 다른 날짜의 메모면
// 그 날짜의 저장된 데이터만 따로 불러와 바꾼 뒤 다시 저장한다.
function toggleBookmark(date, signNumber) {
  const isCurrent = date === mapData.date;
  let data;

  if (isCurrent) {
    data = mapData;
  } else {
    const raw = localStorage.getItem(date);
    if (!raw) return;
    data = JSON.parse(raw);
  }

  if (!data.bookmarks) data.bookmarks = {};
  data.bookmarks[signNumber] = !data.bookmarks[signNumber];

  if (isCurrent) {
    saveMapData();
  } else {
    localStorage.setItem(date, JSON.stringify(data));
  }

  renderAllMemos();
}

// ============ 저장 & 불러오기 ============
function saveMapData() {
  localStorage.setItem(mapData.date, JSON.stringify(mapData));
}

function loadMapData() {
  const saved = localStorage.getItem(getTodayDate());
  if (saved) {
    mapData = JSON.parse(saved);
    mapData.bookmarks = mapData.bookmarks || {};
    checkpointCounter = Math.max(...mapData.checkpoints.map(cp => cp.id + 1), 0);
    obstacleCounter = Math.max(...mapData.obstacles.map(obs => obs.id + 1), 0);
    signCounter = Math.max(...Object.keys(mapData.memos).map(Number)) + 1 || 0;
  }
  renderMap();
  renderMemoSection();
}

function getSavedDates() {
  const keys = Object.keys(localStorage);
  return keys.filter(key => /^\d{4}-\d{2}-\d{2}$/.test(key));
}

function renderPreviousMaps() {
  const previousMapsList = document.getElementById('previousMapsList');
  const savedDates = getSavedDates();

  if (savedDates.length === 0) {
    previousMapsList.innerHTML = '<p class="empty-message">아직 지도가 없어요</p>';
    return;
  }

  let html = '';
  savedDates.sort().reverse().forEach(date => {
    // 지금 보고 있는 날짜도 목록에서 빼지 않고, 대신 다른 색으로 표시만 함
    // (예전엔 여기서 뺐더니 "다른 날짜들이 없어진다"고 느껴졌음)
    const isActive = date === mapData.date;
    const displayDate = new Date(date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit'
    });
    html += `<div class="map-item${isActive ? ' active' : ''}" onclick="loadPreviousMap('${date}')">${displayDate}</div>`;
  });

  previousMapsList.innerHTML = html || '<p class="empty-message">이전 지도가 없어요</p>';
}

function loadPreviousMap(date) {
  const saved = localStorage.getItem(date);
  if (saved) {
    mapData = JSON.parse(saved);
    mapData.bookmarks = mapData.bookmarks || {};
    checkpointCounter = Math.max(...mapData.checkpoints.map(cp => cp.id + 1), 0);
    obstacleCounter = Math.max(...mapData.obstacles.map(obs => obs.id + 1), 0);
    signCounter = Math.max(...Object.keys(mapData.memos).map(Number)) + 1 || 0;
    renderMap();
    renderMemoSection();
    updateDate();
    resetHistory();
    renderPreviousMaps();
  }
}
