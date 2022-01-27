let fn = 'currentTrack.txt'

chrome.storage.onChanged.addListener(function (changes) {
  for (let [key, { newValue }] of Object.entries(changes)) {
    if (key === 'fileName') {
      fn = newValue + '.txt'
    }
  }
});

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
  if (item.byExtensionName === 'Current Track On Stream For OBS') {
    suggest({
      filename: fn || item.filename,
      conflict_action: 'overwrite',
      conflictAction: 'overwrite'
    });
  }
});

function downloadFile(file) {
  const reader = new FileReader();
  reader.onloadend = function () {
    chrome.downloads.download({
      url: reader.result
    });
  }
  reader.readAsDataURL(file);
}

const keywords = [
  'youtube.com', 'open.spotify', 'music.yandex', 'vk.com'
];

(() => setInterval(() => {
  chrome.tabs.query(
    {
      audible: true,
    },
    (tabs) => {
      tabs.forEach(tab => {
        chrome.storage.sync.get(k => {
          fn = k.fileName + '.txt';
          if (k.isExtEnabled) {
            if (keywords.some(k => tab.url.includes(k))) {
              const file = new File([` ${k.leftPart} ` + tab.title + ` ${k.rightPart} `], k.fileName + '.txt', { type: "text/plain;charset=UTF-8" });
              downloadFile(file)
            }
          }
        })
      });
    }
  )
}, 5000))(); 
