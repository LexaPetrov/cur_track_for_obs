let st = chrome.storage.sync;
const log = []

const keywords = [
    'youtube.com', 'open.spotify', 'music.yandex', 'vk.com'
];

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
    suggest({
        filename: item.filename,
        conflict_action: 'overwrite',
        conflictAction: 'overwrite'
    });
});

const defaultValues = {
    isExtEnabled: false,
    fileName: 'currentTrack',
    leftPart: '♬',
    rightPart: '♬',
};

st.get(item => {
    fileName = item.fileName;
    leftPart = item.leftPart;
    rightPart = item.rightPart;
    st.set({
        ...st,
        isExtEnabled: defaultValues.isExtEnabled, // always must be false
        fileName: fileName || defaultValues.fileName,
        leftPart: leftPart || '',
        rightPart: rightPart || '',
    })
});

$(function () {

    st.get(item => {
        $('#cur_track_extension__filename').prop('value', item.fileName)
        $('#cur_track_extension__left').prop('value', item.leftPart)
        $('#cur_track_extension__right').prop('value', item.rightPart)
        $('#cur_track_extension__toggle-state__setting1').prop('checked', item.isExtEnabled)
    })

    $('#cur_track_extension__toggle-state__setting1').on('click', e => {
        st.set({
            ...st,
            'isExtEnabled': e.target.checked
        })
        $('#cur_track_extension__filename').attr('disabled', e.target.checked);
        $('#cur_track_extension__button').attr('disabled', e.target.checked);
    })

    $('#cur_track_extension__settings').on('click', () => {
        if ($('.cur_track_extension__col2').css('display') === 'none') {
            $('.cur_track_extension__col2').css('display', 'block')
        } else {
            $('.cur_track_extension__col2').css('display', 'none');
        }
    })

    $('#cur_track_extension__logs').on('click', () => {
        if ($('.cur_track_extension__col4').css('display') === 'none') {
            $('.cur_track_extension__col4').css('display', 'block')
        } else {
            $('.cur_track_extension__col4').css('display', 'none');
        }
    })

    $('#cur_track_extension__filename').on('change', e => {
        st.set({
            ...st,
            'fileName': e.target.value
        })
        if (!e.target.value) $('#cur_track_extension__toggle-state__setting1').attr('disabled', true)
        else $('#cur_track_extension__toggle-state__setting1').attr('disabled', false)
    })

    $('#cur_track_extension__left, #cur_track_extension__right').on('change', e => {
        st.set({
            ...st,
            [e.target.name]: e.target.value
        })
    })

    $('#cur_track_extension__button').on('click', e => {
        st.set({
            ...defaultValues
        })
        $('#cur_track_extension__filename').prop('value', defaultValues.fileName)
        $('#cur_track_extension__left').prop('value', defaultValues.leftPart)
        $('#cur_track_extension__right').prop('value', defaultValues.rightPart)
    })


    $('#cur_track_extension__button-go').on('click', () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("/src/html/main.html") });
    })

    setInterval(() => {
        chrome.tabs.query(
            {
                audible: true,
            },
            (tabs) => {
                tabs.forEach(tab => {
                    st.get(k => {
                        if (k.isExtEnabled) {
                            if (keywords.some(k => tab.url.includes(k))) {
                                $('#cur_track_extension__now-playing').html('🎵 Now playing: ' + tab.title)
                                const element = document.createElement('a');
                                element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(` ${k.leftPart} ` + tab.title + ` ${k.rightPart} `));
                                element.setAttribute('download', k.fileName + '.txt');
                                element.click();
                                delete element;
                            }

                            if (!log.some(item => item.includes(tab.title))) {
                                log.push(tab.title)
                            }

                            $('.cur_track_extension__col4-logs').html('')
                            log.forEach(l => {
                                $('.cur_track_extension__col4-logs').append(`<p class="mt10">${l}</p> <hr class="cur_track_extension__hr" />`)
                            })
                        }
                    })
                });
            }
        )
    }, 5000);
});

