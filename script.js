// ─── DIALOGUE TREE ──────────────────────────────────────────────────────────
// Each node: { id, text, response, audio, next: [{ label, target }], action }
// action: 'END' | 'RESTART' | null

const nodes = {

  // ── ROOT — only one opener ──
  root: {
    options: [
      { label: "Hey", target: "0" },
    ]
  },

  "0": {
    response: "Hey",
    audio: "0.mp3",
    options: [
      { label: "umm, where are you from?",                                                                                  target: "1" },
      { label: "okayyy, wanna cut the bs, let's head back to my space so i can bang you real hard, by the sink possibly?", target: "2" },
      { label: "Tiki tiki phonk or there will be no next time, capiche?",                                                  target: "3" },
    ]
  },

  "1": {
    response: "haha, you're not really good at this are you?",
    audio: "1.mp3",
    options: [
      { label: "haha, yeah i know",               target: "1.1" },
      { label: "i'm usually good at other things", target: "1.2" },
    ]
  },

  "1.1": {
    response: "it's okay, i find you cute, your friend over there not really, he looks like a pedo",
    audio: "11.mp3",
    options: [
      { label: "oh yeah FUCK that dude.",  target: "1.1.1" },
      { label: "nah he's my boy",          target: "1.1.2" },
    ]
  },

  "1.1.1": {
    response: "hahaha, anyways, you want my number?",
    audio: "111.mp3",
    options: [
      { label: "yeah, but first, i'd like to know, where are you from? What do you do?", target: "1.1.1.1" },
    ]
  },

  "1.1.1.1": {
    response: "i'm from Massachusetts, i go to MIT…that's it, i'm only in vegas for a few months, so yeah.",
    audio: "1111.mp3",
    options: [
      { label: "aight, we'll talk later",                                                       target: "yes-end"   },
      { label: "okayyy, wanna cut the bs, let's head back to my space so i can bang you real hard", target: "yes-end-2" },
    ]
  },

  "1.1.2": {
    response: "standing up for your boy huh? Anyways you want my number?",
    audio: "112.mp3",
    options: [
      { label: "yes (nonchalantly) but first i'd like to know, where are you from? What do you do?", target: "1.1.2.1" },
    ]
  },

  "1.1.2.1": {
    response: "i'm from Massachusetts, i go to MIT…that's it, i'm only in vegas for a few months, so yeah.",
    audio: "1111.mp3",
    options: [
      { label: "aight, we'll talk later",                                                       target: "yes-end"   },
      { label: "okayyy, wanna cut the bs, let's head back to my space so i can bang you real hard", target: "yes-end-2" },
    ]
  },

  "1.2": {
    response: "*blushes* okay, that one was.. Uhh terrible, but i'll fall for it, you're kinda cute",
    audio: "12.mp3",
    options: [
      { label: "kinda? (with aura)",                target: "1.2.1" },
      { label: "so, are you gonna play tiki tiki phonk now or what?", target: "1.2.2" },
    ]
  },

  "1.2.1": {
    response: "okay big boy, chill. i find you cute yeah, your friend over there not really, he looks like a pedo, but, what you want my number?",
    audio: "121.mp3",
    options: [
      { label: "yeah, but first, i'd like to know, where are you from? What do you do?", target: "1.2.1.1" },
    ]
  },

  "1.2.1.1": {
    response: "i'm from Massachusetts, i go to MIT…that's it, i'm only in vegas for a few months, so yeah.",
    audio: "1111.mp3",
    options: [
      { label: "okay, we'll talk later i guess", target: "yes-end" },
    ]
  },

  "1.2.2": {
    response: "hahahaha what?",
    audio: "122.mp3",
    options: [
      { label: "nevermind, let's just go back to my place, i'll show you some really good tiki tiki phonk", target: "yes-end-2" },
    ]
  },

  "2": {
    response: "By the sink? Hahahah, okay",
    audio: "2.mp3",
    options: [
      { label: "wtf?", target: "2.1" },
    ]
  },

  "2.1": {
    response: "what, i agree, i find you kinda cute… i mean if you didn't come up to me i was about to go to you",
    audio: "21.mp3",
    options: [
      { label: "okay, and how would you open to me?", target: "2.1.1" },
    ]
  },

  "2.1.1": {
    response: "probably with something like…\" hey wanna bang by the sink?\"",
    audio: "211.mp3",
    options: [
      { label: "so tiki tiki phonk?",    target: "tiki-end" },
      { label: "so tiki tiki phonk?",    target: "tiki-end" },
    ]
  },

  // ── TERMINAL NODES ──

  "yes-end": {
    response: "yes",
    audio: "yes.mp3",
    action: "END",
    options: []
  },

  "yes-end-2": {
    response: "yes",
    audio: "yes.mp3",
    action: "END",
    options: []
  },

  "tiki-end": {
    response: "what? You know what let's just go back to my place, and we will, tiki tiki phonk there?",
    audio: "tiki.mp3",
    action: "END",
    options: []
  },

  "3": {
    response: "what? What are you on, you're super weird, get away from me",
    audio: "3.mp3",
    action: "RESTART",
    options: []
  },
};

// ─── STATE ───────────────────────────────────────────────────────────────────
let sfx = null;

// ─── ELEMENTS ────────────────────────────────────────────────────────────────
const page1      = document.getElementById('page1');
const page2      = document.getElementById('page2');
const page3      = document.getElementById('page3');
const startBtn   = document.getElementById('startBtn');
const optionsList= document.getElementById('optionsList');
const responseText = document.getElementById('responseText');
const bgMusic    = document.getElementById('bgMusic');

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function showPage(from, to) {
  from.classList.remove('active');
  setTimeout(() => {
    to.classList.add('active');
  }, 850);
}

function playAudio(file, onEnd) {
  if (sfx) { sfx.pause(); sfx = null; }
  if (!file) { if (onEnd) onEnd(); return; }
  sfx = new Audio(file);
  sfx.play().catch(() => {});
  if (onEnd) sfx.addEventListener('ended', onEnd, { once: true });
}

function renderOptions(nodeId) {
  const node = nodes[nodeId];
  optionsList.innerHTML = '';

  if (!node || !node.options || node.options.length === 0) return;

  node.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => handleChoice(opt.target));
    optionsList.appendChild(btn);
  });
}

function handleChoice(targetId) {
  const node = nodes[targetId];
  if (!node) return;

  // disable all buttons during response
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

  // show response
  responseText.classList.remove('visible');
  setTimeout(() => {
    responseText.textContent = node.response || '';
    responseText.classList.add('visible');
  }, 200);

  // play audio, then handle action or next options
  playAudio(node.audio, () => {
    if (node.action === 'END') {
      setTimeout(() => showPage(page2, page3), 600);
    } else if (node.action === 'RESTART') {
      setTimeout(() => {
        responseText.classList.remove('visible');
        responseText.textContent = '';
        renderOptions('root');
      }, 1200);
    } else {
      setTimeout(() => renderOptions(targetId), 400);
    }
  });

  // if no audio file exists yet, still continue after a short beat
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
startBtn.addEventListener('click', () => {
  bgMusic.volume = 0.5;
  bgMusic.play().catch(() => {});
  showPage(page1, page2);
  setTimeout(() => renderOptions('root'), 900);
});
