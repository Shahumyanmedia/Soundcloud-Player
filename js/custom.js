var cId = '5390b0c5733513ef1df0dd70b38d96b5',
    cIdLink = '/stream?client_id=' + cId,
    set_url = "https://soundcloud.com/mallderking/sets/dance-electronic",
    tracks = [];
SC.initialize({
    client_id: cId
});
SC.get('/resolve', {url: set_url}, function (set) {

    set.tracks.forEach(function (track, i) {
        tracks.push(
            {
                song: track.uri + cIdLink,
                image: track.artwork_url,
                author: track.user.username,
                name: track.title
            }
        );
    });
})



/**
 * Player Timer
 * @param sec
 * @constructor
 */
var s = {
    currentTime: 0,
    currentSong: 0,
    currentVol: 1,
    changedVol: 1,
    stopped: false,
    currentAct: null,
    audio: ''
};

function secToMin(Fsec) {
    var minutes = Math.floor(Fsec / 60),
        seconds = Fsec - minutes * 60;
    if(seconds < 10){seconds = '0' + seconds;}
    if(minutes < 10){minutes = '0' + minutes;}
    return minutes + ':' + seconds;
}


function Timer() {

    s.audio.ontimeupdate = function (e) {
        document.getElementById("bz").style.opacity = '0';
        if (s.currentTime != Math.round(s.audio.currentTime)) {
            s.currentTime = Math.round(s.audio.currentTime);
            document.getElementById("curr").innerHTML = secToMin(Math.round(s.audio.currentTime));
            document.getElementById("prP").dataset.pp = parseFloat(document.getElementById("prP").dataset.pp) + parseInt(document.getElementById("sk").clientWidth) / tracks[s.currentSong].time;
            document.getElementById("prP").style.width = document.getElementById("prP").dataset.pp + 'px';
            document.getElementById("ciD_").style.left = document.getElementById("prP").dataset.pp - 6 + 'px';
        }
        if(s.currentTime == Math.round(tracks[s.currentSong].time)){
            var next = new Player();
            next.setAction('next');
        }
    }
}
/**
 * Player Tracker
 * @param act
 * @constructor
 */
function Tracker(act, acts) {
    function play() {
        s.currentAct = 'play';
        s.audio = new Audio(tracks[s.currentSong].song);
        s.audio.addEventListener('loadedmetadata', function() {
            tracks[s.currentSong].time = Math.round(s.audio.duration);
            new Timer();
            s.stopped = false;
            s.audio.volume = s.changedVol;
            s.audio.play();
        });
    }
    function next() {
        document.getElementById("bz").style.opacity = '1';
        document.getElementById("prP").dataset.pp = document.getElementById("prP").style.width = 0;
        document.getElementById("play").dataset.status = 1;
        s.currentSong = s.currentSong + 1;
        s.audio.currentTime = s.currentTime = 0;
        s.audio.pause();
        if(s.currentSong >= tracks.length){
            s.currentSong = 0;
            console.log('playlist completed');
        }
        play();
        document.getElementById("curr").innerHTML = '00:00';
    }
    function prev() {
        document.getElementById("bz").style.opacity = '1';
        document.getElementById("prP").dataset.pp = document.getElementById("prP").style.width = 0;
        document.getElementById("play").dataset.status = 1;
        s.currentSong = s.currentSong - 1;
        s.audio.currentTime = s.currentTime = 0;
        s.audio.pause();
        if(s.currentSong < 0){
            s.currentSong = tracks.length - 1;
        }
        play();
        document.getElementById("curr").innerHTML = '00:00';
    }
    function pause() {
        s.currentAct = 'pause';
        s.audio.pause();
        s.audio.currentTime = s.currentTime;

    }
    function stop() {
        s.currentAct = 'stop';
        s.audio.currentTime = s.currentTime = s.currentSong = 0;
        s.audio.pause();
        s.stopped = true;
    }
    Tracker[act] = function () {
        play();
    };
    Tracker.next = function () {
        next();
    };
    Tracker.stop = function () {
        stop();
    };
    Tracker.pause = function () {
        pause();
    };
    Tracker.prev = function () {
        prev();
    };
    if(acts.length) {
        acts.forEach(function (value) {
            if (act == value) {
                if(act != s.currentAct) {
                    (Tracker[act])();
                }else{
                    console.warn('Action ' + act + ' cannot be repeated');
                }
            }
        })
    }

    if(s.audio != ''){
        s.audio.addEventListener('playing', function() {
            document.getElementById("image").style.backgroundImage = "url('" + tracks[s.currentSong].image + "')";
            document.getElementById("author").innerHTML  = tracks[s.currentSong].author;
            document.getElementById("name").innerHTML  = tracks[s.currentSong].name;
            document.getElementById("full").innerHTML  = secToMin(tracks[s.currentSong].time);
        });
    }
}
/**
 * Player
 * @constructor
 */
function Player(){

    var action = null,
        actionTypes = ['play', 'pause', 'stop', 'next', 'prev'];

    this.setAction = function (setter) {
        var err = typeof setter == 'string' && setter != '' ? true : (function(){throw new Error("Actions can be only string")})(),
            found = actionTypes.indexOf(setter);
        if(found >= 0){
            action = setter;
            if(s.audio == '' && action != 'play'){
                // console.warn("");
            }else{
                new Tracker(action, actionTypes);
            }
        }else{
            throw new Error(setter + ' action can nat be found');
        }
        return err;
    };

}


/**
 * Events after page loading
 */
window.onload = function () {
    var playB = document.getElementById("play"),
        nextB = document.getElementById("next"),
        prevB = document.getElementById("prev"),
        stopB = document.getElementById("stop"),
        imgS = document.getElementById("image"),
        curS = document.getElementById("curr"),
        fLs = document.getElementById("full"),
        pRp = document.getElementById("prPS"),
        aUt = document.getElementById("author"),
        nAm = document.getElementById("name"),

        cS = document.getElementById('prF'),
        cSR = document.getElementById('prP'),
        tms = document.getElementById('tms'),
        sd = document.getElementById('sd'),
        sK = document.getElementById('sk'),
        stL = false,

        clicking = document.getElementById("volCl"),
        circ = document.getElementById("volClD"),
        blT = document.getElementById("volPCD"),
        fV = document.getElementById("vol"),
        oP = document.getElementById("volP"),
        div = document.getElementById('volClD'),
        time = 0,
        time0 = 0;



    var x = new Player();
    playB.onclick = function(){
        var stat = playB.dataset.status;
        if(parseInt(stat) == 0) {
            playB.dataset.status = 1;
            x.setAction('play');
        }else{
            playB.dataset.status = 0;
            x.setAction('pause');
        }
    };
    nextB.onclick = function(){
        document.getElementById("ciD_").style.left = document.getElementById("prP").dataset.pp = - 6 + 'px';
        x.setAction('next');
    };
    prevB.onclick = function(){
        document.getElementById("ciD_").style.left = document.getElementById("prP").dataset.pp = - 6 + 'px';
        x.setAction('prev');
    };
    stopB.onclick = function(){
        if(s.currentTime != 0) {
            x.setAction('stop');
            imgS.style.backgroundImage = "url('" + tracks[0].image + "')";
            curS.innerHTML = '00:00';
            fLs.innerHTML = secToMin(tracks[0].time);
            pRp.style.width = cSR.style.width = cSR.dataset.pp = playB.dataset.status = 0;
            aUt.innerHTML = tracks[0].author;
            nAm.innerHTML = tracks[0].name;
        }
    };
    cS.onclick = function(e){
        var lef = e.clientX - document.getElementById('ps').offsetLeft - imgS.offsetWidth - sK.offsetLeft;
        if(s.currentTime != 0  && !s.stopped) {
            cSR.dataset.pp = lef;
            cSR.style.width = lef + 'px';
            s.currentTime = s.audio.currentTime = Math.round(lef / (parseInt(document.getElementById("sk").clientWidth) / tracks[s.currentSong].time));
            new Timer(tracks[s.currentSong].time - s.currentTime, tracks[s.currentSong].time);
            var pop = secToMin(Math.round(lef / (parseInt(document.getElementById("sk").clientWidth) / tracks[s.currentSong].time) + 1));
            document.getElementById("prP").dataset.pp = parseFloat(document.getElementById("prP").dataset.pp) + parseInt(document.getElementById("sk").clientWidth)/tracks[s.currentSong].time;
            document.getElementById("prP").style.width = document.getElementById("prP").dataset.pp + 'px';
            document.getElementById("ciD_").style.left = document.getElementById("prP").dataset.pp - 6 + 'px';
            document.getElementById("bz").style.opacity = '1';
            document.getElementById("curr").innerHTML = pop;
            if(s.audio.paused){
                playB.dataset.status = 1;
                x.setAction('play');
            }
        }
    };
    cS.onmousemove = function(e){
        var lef = e.clientX - document.getElementById('ps').offsetLeft - imgS.offsetWidth - sK.offsetLeft;
        if(s.currentTime != 0 && !s.stopped) {
            pRp.style.width = lef + 'px';
            var pop = secToMin(Math.round(lef / (parseInt(document.getElementById("sk").clientWidth) / tracks[s.currentSong].time) + 1)),
                node = document.createElement("span"),
                textnode = document.createTextNode(pop),
                popT = document.getElementById("popT");

            node.id = 'popT';
            node.style.left = lef + 'px';
            if(popT)
                popT.parentNode.removeChild(popT);
            node.appendChild(textnode);
            document.getElementById("_r").appendChild(node);
        }
    };
    cS.onmouseout = function () {
        if(s.currentTime != 0 && !s.stopped) {
            var popT = document.getElementById("popT");
            pRp.style.width = 0;
            if(popT)
                popT.parentNode.removeChild(popT);
        }
    };


    /**
     * Volume events
     * @param e
     */
    clicking.onclick = function(e){
        if(s.currentTime != 0  && !s.stopped) {
            var vol = (100/30 * (30 - e.offsetY))/100,
                ht = 30 - e.offsetY;
            if(ht >= 0 && ht <= 30 && vol >= 0 && vol <= 1) {
                circ.style.top = e.offsetY;
                blT.style.height = ht;
                s.changedVol = s.currentVol = s.audio.volume = vol;
                fV.dataset.speak = 1;
            }
        }
    };
    fV.onmouseover = function () {
        clearTimeout(time);
        time0 = setTimeout(function () {
            oP.style.display = 'block';
        },  100)
    };
    fV.onmouseout = function () {
        clearTimeout(time0);
        time = setTimeout(function () {
            oP.style.display = 'none';
        }, 5000)
    };
    fV.onclick = function (e) {
        var sp = parseInt(fV.dataset.speak);
        if(e.target == fV && s.currentTime != 0  && !s.stopped) {
            if (sp == 1) {
                fV.dataset.speak = 0;
                s.changedVol = s.audio.volume = 0;
                div.style.top = 30 + 'px';
                blT.style.height = 0;
            } else {
                fV.dataset.speak = 1;
                if(s.currentVol == 0){
                    s.changedVol = s.currentVol = 1;
                }
                s.changedVol = s.audio.volume = s.currentVol;
                div.style.top = 30 - s.currentVol*30 + 'px';
                blT.style.height = s.currentVol*30;
            }
        }
    };


    clicking.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    function mouseUp()
    {
        window.removeEventListener('mousemove', divMove, true);
    }

    function mouseDown(e){
        window.addEventListener('mousemove', divMove, true);
    }

    function divMove(e){
        if(e.offsetY <= 27 && e.offsetY >= 0 && s.currentTime != 0  && !s.stopped ) {
            if(e.target == clicking) {
                fV.dataset.speak = 1;
                var vol = (100/30 * (30 - e.offsetY))/100;
                if(vol == 0.1){
                    vol = 0;
                    fV.dataset.speak = 0;
                }
                div.style.top = e.offsetY + 'px';
                blT.style.height = 30 - e.offsetY;
                s.currentVol = s.audio.volume = vol;
            }
        }
    }
    document.onclick = function (e) {
        if(e.target != fV && e.target != clicking){
            oP.style.display = 'none';
        }
    };


    /**
     * Slider move
     */
    sK.onmousedown = function (e) {
        if(e.target == cSR || e.target == cS){
            stL = true;
        }
        window.addEventListener('mousemove', divMove2, true);
    }
    window.onmouseup = function () {
        stL = false;
    }
    function divMove2(e){
        var lef = e.clientX - document.getElementById('ps').offsetLeft - imgS.offsetWidth - sK.offsetLeft;
        if(lef <= parseInt(document.getElementById("sk").clientWidth) && lef >= 0 && s.currentTime != 0  && !s.stopped ) {
            if(stL) {
                cSR.dataset.pp = lef;
                cSR.style.width = lef  + 'px';
                document.getElementById("bz").style.opacity = '1';
                s.currentTime = s.audio.currentTime = Math.round((lef) / (parseInt(document.getElementById("sk").clientWidth) / tracks[s.currentSong].time));
                document.getElementById("prP").dataset.pp = parseFloat(document.getElementById("prP").dataset.pp) + parseInt(document.getElementById("sk").clientWidth)/tracks[s.currentSong].time;
                document.getElementById("prP").style.width = document.getElementById("prP").dataset.pp + 'px';
                document.getElementById("ciD_").style.left = document.getElementById("prP").dataset.pp - 6 + 'px';
                new Timer(tracks[s.currentSong].time - s.currentTime, tracks[s.currentSong].time);

                var pop = secToMin(Math.round(lef / (parseInt(document.getElementById("sk").clientWidth) / tracks[s.currentSong].time) + 1));
                document.getElementById("curr").innerHTML = pop;
                if(s.audio.paused){
                    playB.dataset.status = 1;
                    s.audio.play();
                    s.currentAct = 'play';

                }
            }
        }
    }
};