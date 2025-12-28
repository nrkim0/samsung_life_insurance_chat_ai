const chatContainer = document.getElementById('chat-container');
const input = document.getElementById('input');
const send = document.getElementById('send');
const toggleBtn = document.getElementById('toggleSidebar');
const sidebar = document.getElementById('sidebar');

/* ======================
   공통 메시지 추가
====================== */
function addMessage(text, sender, id = null) {
  const message = document.createElement('div');
  message.classList.add('message', sender);
  if (id) message.id = id;

  message.innerText = text; // 줄바꿈 가능
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* ======================
   웰컴 메시지 (HTML 포함)
====================== */
function addWelcomeMessage() {
  const message = document.createElement('div');
  message.classList.add('message', 'bot');
  message.id = 'welcome-message';

  // 텍스트 영역
  const text = document.createElement('div');
  text.classList.add('welcome-text');
  text.innerText = "안녕하세요,\n무엇을 도와드릴까요?";

  // HTML 영역
  const extra = document.createElement('div');
  extra.classList.add('welcome-extra');
  extra.innerHTML = `
    <button class="quick-btn box1" data-msg="서비스 안내">📄 서비스 안내</button>
    <button class="quick-btn box2" data-msg="현재 시간">⏰ 현재 시간</button>
    <button class="quick-btn box3" data-msg="개인정보보호">⭐ 개인정보보호</button>
    <button class="quick-btn box4" data-msg="도움말">❓도움말</button>
  `;

  message.appendChild(text);
  message.appendChild(extra);
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* ======================
   타이핑 효과
====================== */
function typeBotMessage(text) {
  const message = document.createElement('div');
  message.classList.add('message', 'bot');
  chatContainer.appendChild(message);

  let i = 0;
  function typeChar() {
    if (i < text.length) {
      message.innerText += text.charAt(i);
      i++;
      setTimeout(typeChar, 30);
    }
  }
  typeChar();
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* ======================
   봇 응답
====================== */
function getBotReply(userMessage) {
  if (userMessage.includes("안녕")) return "안녕하세요!\n무엇을 도와드릴까요?";
  if (userMessage.includes("시간")) return "현재 시간은\n" + new Date().toLocaleTimeString() + " 입니다.";
  return "죄송해요,\n아직 그 말은 이해하지 못했어요 😅";

}
function getQuickReply(type) {
  switch (type) {
    case "서비스 안내":
      return "이 서비스는 간단한 질문에 답변을 제공하는 챗봇입니다.";

    case "현재 시간":
      return `현재 시간은 ${new Date().toLocaleTimeString()} 입니다.`;

    case "개인정보보호":
      return "개인정보 보호와 관련된 안내를 도와드릴게요. \n어떤 내용이 궁금하신가요?";

    case "도움말":
      return "궁금한 내용을 입력해주세요.";

    default:
      return "무엇을 도와드릴까요?";
  }
}

/* ======================
   메시지 전송 처리
====================== */
function handleSend(text = null) {
  const userMessage = text ?? input.value.trim();
  if (userMessage === "") return;

  const welcome = document.getElementById("welcome-message");
  if (welcome) welcome.remove();

  addMessage(userMessage, 'user');
  input.value = "";

  setTimeout(() => {
    const reply = getBotReply(userMessage);
    typeBotMessage(reply);
  }, 500);
}

/* ======================
   이벤트 바인딩
====================== */
send.addEventListener('click', () => handleSend());

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSend();
});

// 웰컴 버튼 클릭 → 메시지 전송
chatContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.quick-btn');
  if (!btn) return;

  const type = btn.dataset.msg;

  const welcome = document.getElementById("welcome-message");
  if (welcome) welcome.remove();

  // 사용자 메시지처럼 출력
  addMessage(type, 'user');

  setTimeout(() => {
    const reply = getQuickReply(type);
    typeBotMessage(reply);
  }, 300);
});


toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
});

/* ======================
   사이드바 반응형
====================== */
function updateSidebarState() {
  if (window.innerWidth <= 768) {
    sidebar.classList.add("collapsed");
  } else {
    sidebar.classList.remove("collapsed");
  }
}

window.addEventListener("resize", updateSidebarState);
window.addEventListener("load", () => {
  updateSidebarState();
  addWelcomeMessage();
});


