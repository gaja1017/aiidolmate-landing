#!/usr/bin/env python3
"""
Add music player to the landing page
"""

import re

# Read the source file
with open('/Users/im-yeongjae/Documents/IDOL/aiidolmate-landing/src/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS for the play button after .song styles
song_css = '.song{display:flex;align-items:center;gap:10px;color:#eee;font-size:12px;padding:13px 0;border-top:1px solid var(--line)}'
new_song_css = '''.song{display:flex;align-items:center;gap:10px;color:#eee;font-size:12px;padding:13px 0;border-top:1px solid var(--line)}.playBtn{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#d5a6ff,#a78bfa);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;box-shadow:0 2px 8px rgba(167,139,250,.3)}.playBtn:hover{transform:scale(1.1);box-shadow:0 4px 12px rgba(167,139,250,.5)}.playBtn svg{width:14px;height:14px;fill:#1a0a2e;margin-left:2px}.playBtn.playing svg{margin-left:0}.audioProgress{position:absolute;bottom:0;left:0;height:3px;background:linear-gradient(90deg,#d5a6ff,#a78bfa);border-radius:0 0 0 12px;transition:width .1s linear}'''

content = content.replace(song_css, new_song_css)

# 2. Replace the static HTML song divs with play buttons
# The pattern for static HTML cards
old_song_pattern = r'<div class="song">♫ <strong>([^<]+)</strong><span>DEBUT SINGLE</span></div>'
def replace_song_html(match):
    song_name = match.group(1)
    # Extract idol ID from nearby context (we'll use a generic approach)
    return f'<div class="song"><button class="playBtn" aria-label="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>♫ <strong>{song_name}</strong><span>DEBUT SINGLE</span></div>'

content = re.sub(old_song_pattern, replace_song_html, content)

# 3. Update the JavaScript template for dynamically generated cards
old_js_template = r'<div class="song">♫ <strong>\$\{h\(i\.song\)\}</strong><span>DEBUT SINGLE</span></div>'
new_js_template = '<div class="song"><button class="playBtn" data-audio="${i.id.toLowerCase()}" aria-label="Play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>♫ <strong>${h(i.song)}</strong><span>DEBUT SINGLE</span></div>'

content = re.sub(old_js_template, new_js_template, content)

# 4. Add audio player JavaScript before the closing </script> tag
audio_player_js = '''
// Audio Player
const audioMap={seoa:"assets/audio/seoa.mp3",yuna:"assets/audio/yuna.mp3",harin:"assets/audio/harin.mp3",jihoon:"assets/audio/jihoon.mp3",taeo:"assets/audio/taeo.mp3",doyun:"assets/audio/doyun.mp3"};
let currentAudio=null;
let currentBtn=null;
function playPauseSvg(isPlaying){return isPlaying?'<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>':'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';}
document.addEventListener("click",function(e){
  const btn=e.target.closest(".playBtn");
  if(!btn)return;
  const idolId=btn.dataset.audio||btn.closest(".idol")?.querySelector("[data-open]")?.dataset.open?.toLowerCase();
  if(!idolId||!audioMap[idolId])return;
  if(currentAudio&&currentBtn===btn){
    if(currentAudio.paused){currentAudio.play();btn.innerHTML=playPauseSvg(true);btn.classList.add("playing");}
    else{currentAudio.pause();btn.innerHTML=playPauseSvg(false);btn.classList.remove("playing");}
    return;
  }
  if(currentAudio){currentAudio.pause();if(currentBtn){currentBtn.innerHTML=playPauseSvg(false);currentBtn.classList.remove("playing");}}
  currentAudio=new Audio(audioMap[idolId]);
  currentBtn=btn;
  currentAudio.play();
  btn.innerHTML=playPauseSvg(true);
  btn.classList.add("playing");
  currentAudio.addEventListener("ended",function(){btn.innerHTML=playPauseSvg(false);btn.classList.remove("playing");currentAudio=null;currentBtn=null;});
});
'''

# Find the closing script tag and add the audio player code before it
content = content.replace('</script><a class="floatingCta"', audio_player_js + '</script><a class="floatingCta"')

# Write the modified content back
with open('/Users/im-yeongjae/Documents/IDOL/aiidolmate-landing/src/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Music player added successfully!")
