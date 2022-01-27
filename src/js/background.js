// chrome.runtime.onInstalled.addListener((reason) => {
//   if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
//     chrome.tabs.create({
//       url: 'popup.html'
//     });
//   }
// });

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
  suggest({
    filename: item.filename,
    conflict_action: 'overwrite',
    conflictAction: 'overwrite'
  });
});

const keywords = [
  'youtube.com', 'open.spotify', 'music.yandex', 'vk.com'
]

window.onload = async function () {
  await setInterval(async () => {
    await chrome.tabs.query(
      {
        audible: true,
      },
      tabs => {
        tabs.forEach(tab => {
          chrome.storage.sync.get(k => {
            if (k.isExtEnabled) {
              if (keywords.some(k => tab.url.includes(k))) {
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(` ${k.leftPart} ` + tab.title + ` ${k.rightPart} `));
                element.setAttribute('download', k.fileName + '.txt');
                element.click();
              }
            }
          })
        });
      }
    )
  }, 5000)
}