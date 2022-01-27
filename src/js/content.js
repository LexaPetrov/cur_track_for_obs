let st = chrome.storage.sync;

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
        leftPart: leftPart || defaultValues.leftPart,
        rightPart: rightPart || defaultValues.rightPart,
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

    $('#cur_track_extension__settings').on('click', e => {
        console.log(1);
        if ($('.cur_track_extension__col2').css('display') === 'none') {
            $('.cur_track_extension__col2').css('display', 'block')
        } else {
            $('.cur_track_extension__col2').css('display', 'none');
        }
        if ($('.cur_track_extension__col1').css('display') === 'block') {
            $('.cur_track_extension__col1').css('display', 'none')
        } else {
            $('.cur_track_extension__col1').css('display', 'block')
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

    $('#cur_track_extension__left').on('change', e => {
        st.set({
            ...st,
            'leftPart': e.target.value
        })
    })

    $('#cur_track_extension__right').on('change', e => {
        st.set({
            ...st,
            'rightPart': e.target.value
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
});